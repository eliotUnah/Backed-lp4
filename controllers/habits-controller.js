"use strict";
const mongoose = require('mongoose');
const Habit = require('../models/habits-model');
const Category = require("../models/Category");

const defaultCategories = ['Salud', 'Productividad', 'Bienestar', 'Otros'];

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

    // (Aquí tus validaciones normales...)

    // Verificar categoría
    let categoryDoc = null;

    if (defaultCategories.includes(category)) {
      // Buscar categoría default con userId: null
      categoryDoc = await Category.findOne({ name: category, userId: null });
      // Si no existe, crearla
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category, userId: null });
      }
    } else if (mongoose.Types.ObjectId.isValid(category)) {
      // Categoría personalizada: buscar por _id
      categoryDoc = await Category.findOne({ _id: category, userId });
    } else {
      // Categoría personalizada: buscar por nombre y userId
      categoryDoc = await Category.findOne({ name: category, userId });
    }

    if (!categoryDoc) {
      return res.status(400).json({ message: "❌ La categoría no existe o no te pertenece" });
    }

    // Ahora sí guardamos el _id en la categoría
    req.body.category = categoryDoc._id;

    // Crear hábito con la categoría ya convertida a ObjectId
    const newHabit = await Habit.create({
      userId,
      title,
      category: categoryDoc._id,
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
    const habits = await Habit.find({ userId }).populate('category', 'name');
    return res.json(habits);

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

    // Validaciones y asignación de otros campos
    if (title) {
      if (typeof title !== "string" || title.trim() === "" || title.length > 50) {
        return res.status(400).json({ message: "❌ Título inválido" });
      }
      habit.title = title;
    }

    if (frequency) habit.frequency = frequency;

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

    // --- Bloque para resolver la categoría ---
    if (category) {
      const defaultCategories = ['Salud', 'Productividad', 'Bienestar', 'Otros'];
      let categoryDoc = null;

      if (defaultCategories.includes(category)) {
        categoryDoc = await Category.findOne({ name: category, userId: null });
        if (!categoryDoc) {
          categoryDoc = await Category.create({ name: category, userId: null });
        }
      } else if (mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findOne({ _id: category, userId });
      } else {
        categoryDoc = await Category.findOne({ name: category, userId });
      }

      if (!categoryDoc) {
        return res.status(400).json({ message: "❌ La categoría no existe o no te pertenece" });
      }

      habit.category = categoryDoc._id;
    }
    // -----------------------------------------

    await habit.save();
    await habit.populate('category');

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

    if (frequency) {
      query.frequency = frequency.trim();
    }

    // Aquí va el código para category que te pasé arriba:
    const defaultCategories = ['Salud', 'Productividad', 'Bienestar', 'Otros'];
if (category && category.trim() !== "") {
  if (defaultCategories.includes(category.trim())) {
    // Categoría por defecto (ej: "Salud", "Bienestar")
    const categoryDoc = await Category.findOne({ name: category.trim(), userId: null });
    if (categoryDoc) {
      query.category = categoryDoc._id; // Buscar por _id real
    }
    // Si no existe categoryDoc, no filtrar por categoría
  } else if (mongoose.Types.ObjectId.isValid(category.trim())) {
    // Categoría personalizada con id válido
    query.category = category.trim();
  } else {
    // Nombre que no es por defecto, buscar categoría personalizada con userId
    const categoryDoc = await Category.findOne({ name: category.trim(), userId });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
    // Si no existe categoryDoc, no filtrar por categoría
  }
}



    console.log("🟡 QUERY FILTRADA:", query);

    const habits = await Habit.find(query)
      .select("title category frequency createdAt")
      .populate('category', 'name')
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