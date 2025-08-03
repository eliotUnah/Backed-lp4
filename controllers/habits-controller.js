"use strict";
const Habit = require('../models/habits-model');

// Crear un nuevo hábito POST (HU-01)
const createHabit = async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      title,
      category = "Otros",
      frequency,
      startTime,
      durationMinutes = 30,
      daysOfWeek = []
    } = req.body;

    // Validaciones básicas
    if (!title || !frequency || typeof title !== "string" || title.trim() === "" || title.length > 50) {
      return res.status(400).json({ message: "❌ title y frequency son obligatorios y deben ser válidos" });
    }

    if (!startTime || isNaN(Date.parse(startTime))) {
      return res.status(400).json({ message: "❌ startTime debe ser una fecha válida" });
    }

    if (!Array.isArray(daysOfWeek) || daysOfWeek.some(day => !["MO", "TU", "WE", "TH", "FR", "SA", "SU"].includes(day))) {
      return res.status(400).json({ message: "❌ daysOfWeek debe ser un array con códigos válidos de días (MO, TU...)" });
    }

    const existingHabit = await Habit.findOne({ userId, title });
    if (existingHabit) {
      return res.status(400).json({ message: "⚠️ Ya existe un hábito con este título para este usuario" });
    }

    const newHabit = await Habit.create({
      userId,
      title,
      category,
      frequency,
      startTime,
      durationMinutes,
      daysOfWeek
    });

    res.status(201).json({ message: "✅ Hábito creado exitosamente", habit: newHabit });
  } catch (error) {
    console.error("❌ Error al crear hábito:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
};
 
// Obtener hábitos GET 
const getHabits = async (req, res) => {
  try {
    const userId = req.user.uid; // 🔐 viene del token verificado por el middleware

    const habits = await Habit.find({ userId });

   if (!habits || habits.length === 0) {
  return res.status(200).json([]); 
  }
    res.status(200).json(habits);
  } catch (error) {
    console.error("❌ Error al obtener hábitos:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
};
// Eliminar un hábito (DELETE)
const deleteHabit = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { habitId } = req.body;

    if (!habitId) {
      return res.status(400).json({ message: "❌ Se requiere el ID del hábito" });
    }

    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });

    if (!habit) {
      return res.status(404).json({ message: "⚠️ No se encontró un hábito que coincida o no te pertenece" });
    }

    res.status(200).json({ message: "✅ Hábito eliminado exitosamente", habit });
  } catch (error) {
    console.error("❌ Error al eliminar hábito:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
};

// Actualizar un hábito (PUT)
const updateHabitByUid = async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      habitId,
      title,
      frequency,
      category,
      startTime,
      durationMinutes,
      daysOfWeek
    } = req.body;

    if (!habitId) {
      return res.status(400).json({ message: "❌ Se requiere el ID del hábito a actualizar" });
    }

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: "⚠️ No se encontró un hábito que coincida o no te pertenece" });
    }

    // Validaciones y asignación de campos editables
    if (title) {
      if (typeof title !== "string" || title.trim() === "" || title.length > 50) {
        return res.status(400).json({ message: "❌ Título inválido" });
      }
      habit.title = title;
    }

    if (frequency) habit.frequency = frequency;
    if (category) habit.category = category;

    if (startTime) {
      const parsedTime = Date.parse(startTime);
      if (isNaN(parsedTime)) {
        return res.status(400).json({ message: "❌ startTime debe ser una fecha válida" });
      }
      habit.startTime = new Date(parsedTime);
    }

    if (durationMinutes && !isNaN(durationMinutes)) {
      habit.durationMinutes = parseInt(durationMinutes);
    }

    if (Array.isArray(daysOfWeek)) {
      const validDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
      const allValid = daysOfWeek.every(day => validDays.includes(day));
      if (!allValid) {
        return res.status(400).json({ message: "❌ daysOfWeek contiene códigos inválidos de día" });
      }
      habit.daysOfWeek = daysOfWeek;
    }

    await habit.save();

    res.status(200).json({ message: "✅ Hábito actualizado con éxito", habit });
  } catch (error) {
    console.error("❌ Error al actualizar hábito:", error);
    res.status(500).json({ message: "🚨 Error interno del servidor" });
  }
};


// Buscar hábitos con filtros (GET)
const searchHabits = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { search, frequency, category } = req.query;

    let query = { userId };

    if (search) {
      query.$text = { $search: search };
    }
    if (frequency) query.frequency = frequency.trim();
    if (category) query.category = category.trim();

    console.log("🟡 QUERY FILTRADA:", query);

    const habits = await Habit.find(query)
      .select("title category frequency createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ habits });
  } catch (error) {
    console.error("❌ Error en HU-05:", error);
    res.status(500).json({
      error: "Error al filtrar hábitos",
      details: error.message,
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  deleteHabit,
  updateHabitByUid,
  searchHabits
};
