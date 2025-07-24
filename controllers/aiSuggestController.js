const genAI = require("../utils/geminiClient");
const redisClient = require("../utils/redisClient");
const Suggestion = require("../models/Suggestion");


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

    // 2. Generar sugerencia con Gemini
    console.log("✨ Solicitando sugerencia a Gemini...");
    const prompt = `
 Eres un experto en hábitos saludables.

Recomienda un hábito personal, breve, saludable y fácil de implementar.

Devuelve SOLO un JSON con los siguientes campos:

{
  "title": "Texto del hábito (máximo 50 caracteres, sin comillas internas)",
  "reason": "Explicación breve del beneficio",
  "category": "Salud" | "Productividad" | "Bienestar" | "Otros",
  "frequency": "Diario" | "Semanal" | "Mensual"
}

✅ IMPORTANTE:
- "title" no debe superar los 50 caracteres.
- No incluyas comentarios ni explicación fuera del JSON.
- No uses caracteres especiales innecesarios ni saltos de línea fuera del JSON.
`;
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    console.log("✅ Respuesta recibida de Gemini:", content);
    const match = content.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("No se encontró un bloque JSON en la respuesta de Gemini.");

    const suggestion = JSON.parse(match[0]);
    const level = Math.floor(Math.random() * 3) + 1;
    const response = { ...suggestion, level };

    // 3. Guardar en MongoDB
await Suggestion.create({
  userId,
  suggestion: suggestion.title,
  reason: suggestion.reason,
  category: suggestion.category,
  frequency: suggestion.frequency,
  level
});

    // 4. Guardar en Redis por 24h
    await redisClient.setEx(cacheKey, 60 * 60 * 24, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    console.error("❌ Error:", error.message);

    const mocks = [
      {
        title: "Camina 5 minutos cada hora",
        reason: "Mejora tu circulación y despeja la mente.",
      },
      {
        title: "Bebe un vaso de agua al despertar",
        reason: "Hidratarte temprano aumenta tu concentración.",
      },
    ];
    const fallback = mocks[Math.floor(Math.random() * mocks.length)];
    return res.json({
      ...fallback,
      note: "Sugerencia mock (error con IA o Redis)",
      level: 1,
    });
  }
};

module.exports = suggestHabit;
