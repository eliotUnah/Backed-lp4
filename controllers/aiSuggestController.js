const genAI = require("../utils/geminiClient");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const suggestHabit = async (req, res) => {
  const prompt = `
    Recomienda un hábito personal saludable y breve.
    Devuelve solo un JSON con:
    {
      "title": "Título corto del hábito",
      "reason": "Motivo o beneficio de hacerlo"
    }
  `;

  try {
    console.log("✨ Solicitando sugerencia a Gemini...");
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    console.log("✅ Respuesta recibida de Gemini:", content);

    const match = content.match(/\{[\s\S]*?\}/);
    if (!match) {
      throw new Error("No se encontró un bloque JSON en la respuesta de Gemini.");
    }

    const jsonString = match[0];

    try {
      const suggestion = JSON.parse(jsonString);

      // Añadir campo "level"
      const level = Math.floor(Math.random() * 3) + 1; // Nivel 1 a 3
      return res.json({ ...suggestion, level });
    } catch (parseErr) {
      console.error("❌ Error al parsear JSON extraído:", parseErr, "Contenido:", jsonString);
      return res.status(500).json({ message: "El JSON extraído no es válido." });
    }
  } catch (error) {
    console.error("❌ Error al usar Gemini:", error.message);

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
      note: "Sugerencia mock (error con Gemini)",
      level: 1,
    });
  }
};

module.exports = suggestHabit;