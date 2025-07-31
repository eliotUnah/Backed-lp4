const Suggestion = require('../models/Suggestion');
const Habit = require('../models/habits-model');

// ✅ Guardar sugerencia diaria (una por usuario cada 24h)
const saveSuggestion = async (userId, suggestion, reason) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verificar si ya hay una sugerencia para hoy
  const existing = await Suggestion.findOne({
    userId,
    createdAt: { $gte: today }
  });

  if (existing) {
    return existing; // Ya existe una sugerencia hoy
  }

  // Guardar nueva sugerencia
  const newSuggestion = new Suggestion({
    userId,
    suggestion,
    reason
  });

  await newSuggestion.save();
  return newSuggestion;
};

// ✅ Obtener historial de sugerencias del usuario
const getUserSuggestions = async (req, res) => {
  const userId = req.user.uid;

  try {
    const suggestions = await Suggestion.find({ userId }).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener historial de sugerencias' });
  }
};

// ✅ Marcar o desmarcar como favorito
const toggleFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Sugerencia no encontrada' });
    }

    suggestion.isFavorite = !suggestion.isFavorite;
    await suggestion.save();

    res.json({
      message: 'Estado de favorito actualizado',
      favorite: suggestion.isFavorite
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar favorito' });
  }
};

// ✅ Convertir sugerencia en hábito
const convertToHabit = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Sugerencia no encontrada' });
    }

    // Crear nuevo hábito con campos precargados
    const newHabit = await Habit.create({
       userId,
  title: suggestion.suggestion,
  frequency: "Diario", // por defecto
  category: "Bienestar" // o "Otros"
    });

    res.json({ message: 'Hábito creado con éxito', habit: newHabit });
  } catch (err) {
    res.status(500).json({ message: 'Error al convertir en hábito' });
  }
};

module.exports = {
  saveSuggestion,
  getUserSuggestions,
  toggleFavorite,
  convertToHabit
};

