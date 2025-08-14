// models/Suggestion.js - Actualización
const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  suggestion: { type: String, required: true },
  reason: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Salud", "Productividad", "Bienestar", "Otros"],
    required: true 
  },
  frequency: { 
    type: String, 
    enum: ["Diario", "Semanal", "Mensual"],
    required: true 
  },
  level: { type: Number, min: 1, max: 3, default: 1 },
  
  // Nuevos campos para HU-15
  moodBased: { type: Boolean, default: false },
  moodContext: {
    overallMood: { 
      type: String, 
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    averageScore: { type: Number, min: 0, max: 1 },
    trend: { 
      type: String, 
      enum: ['improving', 'stable', 'declining'],
      default: 'stable'
    },
    recommendationType: { 
      type: String, 
      enum: ['general', 'support', 'recovery', 'maintenance', 'enhancement', 'boost', 'balance'],
      default: 'general'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Suggestion", suggestionSchema);