// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  userId: {  // Para facilitar búsquedas
    type: String,
    required: true,
    index: true
  },
  email: {
  type: String,
  required: true
},

  time: {   // Hora diaria en formato HH:MM (ej: "14:30")
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/  // Valida formato HH:MM
  },
  timezone: {  // Zona horaria del usuario (ej: "America/Mexico_City")
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


module.exports = mongoose.model('Reminder', reminderSchema); 