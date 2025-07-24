const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  suggestion: { type: String, required: true },
  reason: { type: String, required: true },
  category: { type: String },  // Nuevo
  frequency: { type: String }, // Nuevo
  level: { type: Number },     // Nuevo
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
