// models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

checkinSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);