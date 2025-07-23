const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
  type: String,
  required: true
},
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['PerfectDailyStreak', 'PerfectWeek', 'MonthlyChampion']
  },
  earnedOn: {
    type: Date,
    default: Date.now
  },
  badgeUrl: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
