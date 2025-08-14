// models/numeric-checkin-model.js
const mongoose = require('mongoose');

const numericCheckinSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  userId: { type: String, required: true }, // uid Firebase
  value: { type: Number, required: true }, // cantidad sumada
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NumericCheckin', numericCheckinSchema);