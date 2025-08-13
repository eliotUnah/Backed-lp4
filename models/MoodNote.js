// models/MoodNote.js
const mongoose = require("mongoose");

const moodNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  emoji: { type: String, required: true },
  note: { type: String, maxlength: 200 },
  sentiment: { 
    type: String, 
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  sentimentScore: { 
    type: Number, 
    min: 0, 
    max: 1,
    default: 0.5 
  }
}, {
  timestamps: true
});

moodNoteSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MoodNote", moodNoteSchema); 