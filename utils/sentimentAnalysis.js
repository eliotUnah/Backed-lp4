// utils/sentimentAnalysis.js
const natural = require('natural');

class SentimentAnalyzer {
  constructor() {
    this.analyzer = new natural.SentimentAnalyzer('Spanish', 
      natural.PorterStemmerEs, 'afinn');
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeSentiment(text) {
    if (!text || text.trim().length === 0) {
      return { sentiment: 'neutral', score: 0.5 };
    }

    // Tokenizar y limpiar texto
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stemmedTokens = tokens.map(token => 
      natural.PorterStemmerEs.stem(token)
    );

    // Análisis básico con natural
    const score = natural.SentimentAnalyzer.getSentiment(stemmedTokens);
    
    // Normalizar score (-1 a 1) a (0 a 1)
    const normalizedScore = (score + 1) / 2;
    
    // Clasificar sentimiento
    let sentiment;
    if (normalizedScore >= 0.6) {
      sentiment = 'positive';
    } else if (normalizedScore <= 0.4) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    return {
      sentiment,
      score: Math.max(0, Math.min(1, normalizedScore))
    };
  }

  // Método mejorado con palabras clave en español
  analyzeWithKeywords(text) {
    const positiveWords = [
      'feliz', 'alegre', 'contento', 'bien', 'genial', 'excelente',
      'amor', 'paz', 'tranquilo', 'relajado', 'motivado', 'energético'
    ];
    
    const negativeWords = [
      'triste', 'deprimido', 'mal', 'terrible', 'horrible', 'enojado',
      'estresado', 'ansioso', 'preocupado', 'cansado', 'frustrado'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });

    const totalWords = words.length;
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;

    let sentiment, score;
    
    if (positiveRatio > negativeRatio) {
      sentiment = 'positive';
      score = 0.5 + (positiveRatio * 0.5);
    } else if (negativeRatio > positiveRatio) {
      sentiment = 'negative';
      score = 0.5 - (negativeRatio * 0.5);
    } else {
      sentiment = 'neutral';
      score = 0.5;
    }

    return {
      sentiment,
      score: Math.max(0, Math.min(1, score))
    };
  }
}

module.exports = new SentimentAnalyzer(); 