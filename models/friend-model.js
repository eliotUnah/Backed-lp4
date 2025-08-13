const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
    ref: 'User' // Referencia al campo uid del modelo User
  },
  recipient: {
    type: String,
    required: true,
    ref: 'User' // También referencia al uid
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Friendship', friendshipSchema);
