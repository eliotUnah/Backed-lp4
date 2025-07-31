const { Parser } = require('json2csv');
const archiver = require('archiver');
const Achievement = require('../models/achievement-model');
const Habit = require('../models/habits-model');

exports.exportUserHistory = async (req, res) => {
  try {
    const format = req.query.format === 'csv' ? 'csv' : 'json';
    const userId = req.user.id || req.user.uid;

    // 1. Obtener logros con hábitos válidos
    const allAchievements = await Achievement.find({ userId }).populate('habitId').lean();
    const achievements = allAchievements.filter(a => a.habitId !== null);

    // 2. Obtener hábitos con racha completada
    const allHabits = await Habit.find({ userId }).lean();
    const completedStreaks = allHabits
      .filter(h => h.streakBest >= 1)
      .map(h => ({
        habitTitle: h.title,
        category: h.category,
        frequency: h.frequency,
        streakCurrent: h.streakCurrent,
        streakBest: h.streakBest
      }));

    if (format === 'json') {
      const data = {
        achievements,
        completedStreaks
      };
      const bufferJSON = Buffer.from(JSON.stringify(data, null, 2));

      if (bufferJSON.length > 5 * 1024 * 1024) {
        res.attachment('history.zip');
        const archive = archiver('zip');
        archive.pipe(res);
        archive.append(bufferJSON, { name: 'history.json' });
        archive.finalize();
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="history.json"');
        res.send(bufferJSON);
      }

    } else {
      // CSV para logros
      const achievementFields = [
        { label: 'Tipo', value: 'type' },
        { label: 'Fecha de logro', value: 'earnedOn' },
        { label: 'Hábito', value: row => row.habitId.title },
        { label: 'URL Insignia', value: 'badgeUrl' }
      ];
      const achievementsCSV = new Parser({ fields: achievementFields }).parse(achievements);

      // CSV para rachas
      const streakFields = [
        { label: 'Hábito', value: 'habitTitle' },
        { label: 'Categoría', value: 'category' },
        { label: 'Frecuencia', value: 'frequency' },
        { label: 'Racha actual', value: 'streakCurrent' },
        { label: 'Mejor racha', value: 'streakBest' }
      ];
      const streaksCSV = new Parser({ fields: streakFields }).parse(completedStreaks);

      const achievementsBuffer = Buffer.from(achievementsCSV);
      const streaksBuffer = Buffer.from(streaksCSV);

      const totalSize = achievementsBuffer.length + streaksBuffer.length;

      if (totalSize > 5 * 1024 * 1024) {
        res.attachment('history.zip');
        const archive = archiver('zip');
        archive.pipe(res);
        archive.append(achievementsCSV, { name: 'achievements.csv' });
        archive.append(streaksCSV, { name: 'streaks.csv' });
        archive.finalize();
      } else {
        // Combinar en un solo CSV (opcional)
        const combinedCSV =
          '=== LOGROS ===\n\n' +
          achievementsCSV +
          '\n\n=== RACHAS COMPLETADAS ===\n\n' +
          streaksCSV;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="history.csv"');
        res.send(combinedCSV);
      }
    }

  } catch (error) {
    console.error('Error al exportar historial:', error);
    res.status(500).json({ message: 'Error al exportar historial.' });
  }
};
