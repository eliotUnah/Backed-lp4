// controllers/moodController.js
const MoodNote = require("../models/MoodNote");
const { createMoodSchema } = require("../validations/mood.validation");
const sentimentAnalyzer = require("../utils/sentimentAnalysis");

const createMood = async (req, res) => {
  try {
    const { emoji, note, date } = req.body;
    const userId = req.params.id;
    
    const { error } = createMoodSchema.validate({ emoji, note, date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Análisis de sentimiento
    const sentimentResult = note ? 
      sentimentAnalyzer.analyzeWithKeywords(note) : 
      { sentiment: 'neutral', score: 0.5 };

    const mood = new MoodNote({ 
      userId, 
      emoji, 
      note, 
      date,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.score
    });
    
    await mood.save();
    
    res.status(201).json({ 
      message: "Estado de ánimo guardado", 
      mood: {
        ...mood.toObject(),
        sentimentAnalysis: {
          sentiment: sentimentResult.sentiment,
          score: sentimentResult.score,
          confidence: sentimentResult.score > 0.7 || sentimentResult.score < 0.3 ? 'high' : 'medium'
        }
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Ya has registrado un estado de ánimo hoy" });
    }
    console.error("Error en createMood:", err);
    res.status(500).json({ error: "Error al guardar estado de ánimo" });
  }
};

const getMoods = async (req, res) => {
  try {
    const userId = req.params.id;
    const [start, end] = req.query.range.split(",");
    
    const moods = await MoodNote.find({
      userId,
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).sort({ date: 1 });

    // Calcular estadísticas de sentimiento
    const sentimentStats = {
      positive: moods.filter(m => m.sentiment === 'positive').length,
      neutral: moods.filter(m => m.sentiment === 'neutral').length,
      negative: moods.filter(m => m.sentiment === 'negative').length,
      total: moods.length
    };

    const averageScore = moods.length > 0 ? 
      moods.reduce((sum, mood) => sum + (mood.sentimentScore || 0.5), 0) / moods.length : 0.5;

    let overallSentiment = 'neutral';
    if (averageScore >= 0.6) overallSentiment = 'positive';
    else if (averageScore <= 0.4) overallSentiment = 'negative';

    res.status(200).json({ 
      moods,
      sentimentAnalysis: {
        stats: sentimentStats,
        averageScore: Math.round(averageScore * 100) / 100,
        overallSentiment,
        period: { start, end }
      }
    });
  } catch (err) {
    console.error("Error en getMoods:", err);
    res.status(500).json({ error: "Error al obtener estados de ánimo" });
  }
};

module.exports = { createMood, getMoods };