const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
