const MoodNote = require("../models/MoodNote");
const { createMoodSchema } = require("../validations/mood.validation");

const createMood = async (req, res) => {
  try {
    const { emoji, note, date } = req.body;
    const userId = req.params.id;

    const { error } = createMoodSchema.validate({ emoji, note, date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const mood = new MoodNote({ userId, emoji, note, date });
    await mood.save();

    res.status(201).json({ message: "Estado de ánimo guardado", mood });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Ya has registrado un estado de ánimo hoy" });
    }
    res.status(500).json({ error: "Error al guardar estado de ánimo" });
  }
};
// RUTA DE POSTMAN PARA PROBARLO http://localhost:5000/api/68802294712f6c2f40d7479b/moods?range=2024-06-01,2024-06-31
const getMoods = async (req, res) => {
  try {
    const userId = req.params.id;
    const [start, end] = req.query.range.split(",");
    const moods = await MoodNote.find({
      userId,
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).sort({ date: 1 });

    res.status(200).json({ moods });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener estados de ánimo" });
  }
};

module.exports = { createMood, getMoods };
