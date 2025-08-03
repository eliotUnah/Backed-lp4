// models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
  userId: {
  type: String, 
  ref: 'User', 
  required: true
},

    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

checkinSchema.index({userId: 1, habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);