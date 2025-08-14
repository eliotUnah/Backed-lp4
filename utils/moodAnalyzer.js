// utils/moodAnalyzer.js
const MoodNote = require("../models/MoodNote");

class MoodAnalyzer {
  
  // Función principal para ponderar ánimo reciente
  async weighMood(userId, days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const recentMoods = await MoodNote.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 }).limit(days);

      if (recentMoods.length === 0) {
        return {
          overallMood: 'neutral',
          averageScore: 0.5,
          moodTrend: 'stable',
          recommendation: 'general',
          reason: 'No hay registros de ánimo recientes'
        };
      }

      // Ponderar más los días recientes
      let weightedScore = 0;
      let totalWeight = 0;
      
      recentMoods.forEach((mood, index) => {
        const weight = Math.pow(0.8, index); // Peso decreciente
        weightedScore += (mood.sentimentScore || 0.5) * weight;
        totalWeight += weight;
      });

      const averageScore = weightedScore / totalWeight;
      
      // Determinar tendencia
      const moodTrend = this.calculateTrend(recentMoods);
      
      // Clasificar ánimo general
      let overallMood = 'neutral';
      if (averageScore >= 0.65) overallMood = 'positive';
      else if (averageScore <= 0.35) overallMood = 'negative';

      // Determinar tipo de recomendación
      const recommendation = this.getRecommendationType(overallMood, moodTrend);
      
      return {
        overallMood,
        averageScore: Math.round(averageScore * 100) / 100,
        moodTrend,
        recommendation,
        reason: this.generateReason(overallMood, moodTrend, days),
        recentMoodsCount: recentMoods.length,
        period: `últimos ${days} días`
      };

    } catch (error) {
      console.error("Error en weighMood:", error);
      return {
        overallMood: 'neutral',
        averageScore: 0.5,
        moodTrend: 'stable',
        recommendation: 'general',
        reason: 'Error al analizar el ánimo reciente'
      };
    }
  }

  // Calcular tendencia de ánimo
  calculateTrend(moods) {
    if (moods.length < 2) return 'stable';

    const recent = moods.slice(0, Math.ceil(moods.length / 2));
    const older = moods.slice(Math.ceil(moods.length / 2));

    const recentAvg = recent.reduce((sum, mood) => sum + (mood.sentimentScore || 0.5), 0) / recent.length;
    const olderAvg = older.reduce((sum, mood) => sum + (mood.sentimentScore || 0.5), 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.1) return 'improving';
    else if (difference < -0.1) return 'declining';
    else return 'stable';
  }

  // Determinar tipo de recomendación basado en ánimo
  getRecommendationType(overallMood, trend) {
    if (overallMood === 'negative') {
      return trend === 'improving' ? 'recovery' : 'support';
    } else if (overallMood === 'positive') {
      return trend === 'declining' ? 'maintenance' : 'enhancement';
    } else {
      return trend === 'improving' ? 'boost' : 'balance';
    }
  }

  // Generar razón personalizada
  generateReason(overallMood, trend, days) {
    const moodDescriptions = {
      positive: 'tu ánimo ha sido positivo',
      negative: 'has tenido días difíciles',
      neutral: 'tu ánimo ha sido estable'
    };

    const trendDescriptions = {
      improving: 'y está mejorando',
      declining: 'pero está decayendo',
      stable: 'y se mantiene constante'
    };

    return `Basado en que ${moodDescriptions[overallMood]} en los últimos ${days} días ${trendDescriptions[trend]}`;
  }

  // Obtener emojis más frecuentes
  async getFrequentEmojis(userId, days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const emojiStats = await MoodNote.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$emoji",
            count: { $sum: 1 },
            avgSentiment: { $avg: "$sentimentScore" }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 3
        }
      ]);

      return emojiStats;
    } catch (error) {
      console.error("Error en getFrequentEmojis:", error);
      return [];
    }
  }
}

module.exports = new MoodAnalyzer();