// controllers/statsController.js
const Checkin = require('../models/checkinModel');
const Habit = require('../models/habits-model');
const { startOfDay, subDays } = require('date-fns');

exports.getOverviewStats = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Obtener IDs de los hábitos del usuario
    const habits = await Habit.find({ userId }).select('_id streakBest');
    const habitIds = habits.map(h => h._id);

    // Obtener racha máxima global del usuario
    const maxStreak = habits.reduce((max, h) => h.streakBest > max ? h.streakBest : max, 0);

    // Rango de fechas: últimos 30 días
    const today = startOfDay(new Date());
    const fromDate = subDays(today, 29);

    // Agregación por día
    const last30Days = await Checkin.aggregate([
      {
        $match: {
          habitId: { $in: habitIds },
          date: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalCheckins = await Checkin.countDocuments({
      habitId: { $in: habitIds }
    });

    const totalHabits = habits.length;
    const totalDays = await Checkin.distinct('date', {
      habitId: { $in: habitIds }
    });

    const percentage = totalHabits === 0
      ? 0
      : Math.min(100, Math.round((totalCheckins / (totalDays.length * totalHabits)) * 100));

    res.json({
      last30Days,      // para la gráfica
      percentage,      // KPI 1
      maxStreak        // KPI 2
    });
  } catch (error) {
    console.error("❌ Error en /stats/overview:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};