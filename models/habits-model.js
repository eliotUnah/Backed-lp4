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
// Categoría del hábito
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: false
},
  frequency: {
    type: String,
    enum: ["Diario", "Semanal", "Mensual"],
    required: true
  }, // Frecuencia del hábito
 startTime: {
    type: Date,
    required: true
  }, // Hora de inicio del hábito (en cualquier día base)

  durationMinutes: {
    type: Number,
    default: 30
  }, // Duración estimada en minutos

  daysOfWeek: {
    type: [String],
    enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    default: []
  }, // Días en que se repite el hábito (para eventos recurrentes)

  gcalEventId: {
    type: String,
    default: null
  }, // ID del evento creado en Google Calendar
  
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
