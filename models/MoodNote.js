// models/MoodNote.js
const mongoose = require("mongoose");

const moodNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  emoji: { type: String, required: true },
  note: { type: String, maxlength: 200 }
});

moodNoteSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MoodNote", moodNoteSchema);
