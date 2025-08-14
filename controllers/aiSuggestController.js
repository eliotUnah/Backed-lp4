// controllers/aiSuggestController.js
const genAI = require("../utils/geminiClient");
const redisClient = require("../utils/redisClient");
const Suggestion = require("../models/Suggestion");
const moodAnalyzer = require("../utils/moodAnalyzer");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const suggestHabit = async (req, res) => {
  const userId = req.user.uid;
  const cacheKey = `suggestion:${userId}`;
  
  try {
    // 1. Verificar caché
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Sugerencia recuperada de Redis");
      return res.json(JSON.parse(cached));
    }

    // 2. Analizar ánimo reciente del usuario
    console.log("🧠 Analizando ánimo reciente del usuario...");
    const moodAnalysis = await moodAnalyzer.weighMood(userId, 7);
    const frequentEmojis = await moodAnalyzer.getFrequentEmojis(userId, 7);
    
    console.log("📊 Análisis de ánimo:", moodAnalysis);

    // 3. Generar prompt personalizado según ánimo
    const personalizedPrompt = generateMoodBasedPrompt(moodAnalysis, frequentEmojis);
    
    // 4. Generar sugerencia con Gemini
    console.log("✨ Solicitando sugerencia personalizada a Gemini...");
    const result = await model.generateContent(personalizedPrompt);
    const content = result.response.text().trim();
    console.log("✅ Respuesta recibida de Gemini:", content);

    const match = content.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("No se encontró un bloque JSON en la respuesta de Gemini.");

    const suggestion = JSON.parse(match[0]);
    const level = Math.floor(Math.random() * 3) + 1;
    
    // 5. Agregar información del análisis de ánimo
    const response = { 
      ...suggestion, 
      level,
      moodBased: true,
      moodAnalysis: {
        overallMood: moodAnalysis.overallMood,
        trend: moodAnalysis.moodTrend,
        reason: moodAnalysis.reason
      }
    };

    // 6. Guardar en MongoDB con información de ánimo
    await Suggestion.create({
      userId,
      suggestion: suggestion.title,
      reason: suggestion.reason,
      category: suggestion.category,
      frequency: suggestion.frequency,
      level,
      moodBased: true,
      moodContext: {
        overallMood: moodAnalysis.overallMood,
        averageScore: moodAnalysis.averageScore,
        trend: moodAnalysis.moodTrend,
        recommendationType: moodAnalysis.recommendation
      }
    });

    // 7. Guardar en Redis por 24h
    await redisClient.setEx(cacheKey, 60 * 60 * 24, JSON.stringify(response));

    return res.json(response);

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    // Fallback con contexto de ánimo si es posible
    try {
      const moodAnalysis = await moodAnalyzer.weighMood(userId, 7);
      const moodBasedFallback = getMoodBasedFallback(moodAnalysis.overallMood);
      
      return res.json({
        ...moodBasedFallback,
        note: "Sugerencia basada en tu ánimo (modo offline)",
        level: 1,
        moodBased: true,
        moodAnalysis: {
          overallMood: moodAnalysis.overallMood,
          reason: moodAnalysis.reason
        }
      });
    } catch (fallbackError) {
      // Fallback general si todo falla
      const generalFallback = {
        title: "Respira profundo por 2 minutos",
        reason: "La respiración consciente reduce el estrés y mejora el bienestar.",
        category: "Bienestar",
        frequency: "Diario"
      };
      
      return res.json({
        ...generalFallback,
        note: "Sugerencia general (error en análisis)",
        level: 1,
        moodBased: false
      });
    }
  }
};

// Función para generar prompt personalizado según ánimo
function generateMoodBasedPrompt(moodAnalysis, frequentEmojis) {
  const { overallMood, moodTrend, recommendation, reason } = moodAnalysis;
  
  let moodContext = "";
  let suggestionFocus = "";

  // Contexto según ánimo general
  switch (overallMood) {
    case 'positive':
      moodContext = "El usuario ha tenido un ánimo positivo recientemente.";
      suggestionFocus = recommendation === 'maintenance' ? 
        "Sugiere hábitos para mantener este bienestar." :
        "Sugiere hábitos para potenciar aún más su energía positiva.";
      break;
    case 'negative':
      moodContext = "El usuario ha pasado por días difíciles recientemente.";
      suggestionFocus = recommendation === 'recovery' ?
        "Sugiere hábitos suaves de recuperación y autocuidado." :
        "Sugiere hábitos de apoyo emocional y bienestar mental.";
      break;
    default:
      moodContext = "El usuario ha tenido un ánimo estable recientemente.";
      suggestionFocus = "Sugiere hábitos equilibrados para mantener la estabilidad.";
  }

  // Contexto de emojis frecuentes
  const emojiContext = frequentEmojis.length > 0 ? 
    `Sus emojis más usados son: ${frequentEmojis.map(e => e._id).join(', ')}.` : "";

  return `
Eres un experto en hábitos saludables y bienestar emocional.

CONTEXTO DEL USUARIO:
${moodContext}
${emojiContext}
Tendencia: ${moodTrend}
${reason}

INSTRUCCIONES:
${suggestionFocus}
La sugerencia debe ser empática y apropiada para su estado emocional actual.

Devuelve SOLO un JSON con los siguientes campos:
{
  "title": "Texto del hábito (máximo 50 caracteres, sin comillas internas)",
  "reason": "Explicación breve considerando su estado de ánimo actual",
  "category": "Salud" | "Productividad" | "Bienestar" | "Otros",
  "frequency": "Diario" | "Semanal" | "Mensual"
}

✅ IMPORTANTE:
- "title" no debe superar los 50 caracteres.
- "reason" debe mencionar cómo esto puede ayudar con su ánimo actual.
- No incluyas comentarios ni explicación fuera del JSON.
- Sé empático y considerado con su estado emocional.
`;
}

// Fallbacks basados en ánimo
function getMoodBasedFallback(overallMood) {
  const fallbacks = {
    positive: {
      title: "Comparte algo bueno con alguien",
      reason: "Compartir tu energía positiva fortalece las relaciones y mantiene tu buen ánimo.",
      category: "Bienestar",
      frequency: "Diario"
    },
    negative: {
      title: "Escribe 3 cosas por las que estás agradecido",
      reason: "La gratitud ayuda a cambiar el enfoque hacia lo positivo en momentos difíciles.",
      category: "Bienestar", 
      frequency: "Diario"
    },
    neutral: {
      title: "Sal a caminar 10 minutos",
      reason: "El movimiento suave y el aire fresco pueden mejorar tu estado de ánimo.",
      category: "Salud",
      frequency: "Diario"
    }
  };

  return fallbacks[overallMood] || fallbacks.neutral;
}

module.exports = suggestHabit;