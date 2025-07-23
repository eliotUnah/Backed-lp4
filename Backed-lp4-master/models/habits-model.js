"use strict";

const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
    index: true
  }, // ID del usuario

  title: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  }, // Título del hábito

  category: {
    type: String,
    enum: ["Salud", "Productividad", "Bienestar", "Otros"],
    default: "Otros"
  }, // Categoría del hábito

  frequency: {
    type: String,
    enum: ["Diario", "Semanal", "Mensual"],
    required: true
  }, // Frecuencia del hábito

  streakCurrent: {
    type: Number,
    default: 0
  }, // Racha actual

  streakBest: {
    type: Number,
    default: 0
  } // Mejor racha

}, { timestamps: true }); // Crea campos createdAt y updatedAt

// Índices
habitSchema.index({ userId: 1, title: 1 }, { unique: true }); // Evita títulos duplicados por usuario
habitSchema.index({ title: "text" });                      // Habilita búsqueda textual
habitSchema.index({ category: 1 });                        // Filtro por categoría
habitSchema.index({ frequency: 1 });                       // Filtro por frecuencia

module.exports = mongoose.model('Habit', habitSchema);
