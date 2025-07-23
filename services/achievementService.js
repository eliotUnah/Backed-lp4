const Achievement = require('../models/achievement-model.js');
const dayjs = require('dayjs');

async function checkAchievement(habit) {
  const newAchievements = [];

  // 1. Logro semanal para TODOS (cada 7 días consecutivos)
  const totalWeeklyAchievements = await Achievement.countDocuments({
    userId: habit.userId,
    habitId: habit._id,
    type: 'PerfectWeek'
  });

  const streakWeeks = Math.floor(habit.streakCurrent / 7);
  if (streakWeeks > totalWeeklyAchievements) {
    // Crear nuevo logro semanal
    const weekAchievement = await Achievement.create({
      userId: habit.userId,
      habitId: habit._id,
      type: 'PerfectWeek',
      earnedOn: new Date(),
    });

    // Eliminar logros PerfectWeek anteriores (menos el nuevo)
    await Achievement.deleteMany({
      userId: habit.userId,
      habitId: habit._id,
      type: 'PerfectWeek',
      _id: { $ne: weekAchievement._id }  // Eliminar todos excepto el nuevo
    });

    console.log('🏅 Medalla semana perfecta guardada y semanas viejas eliminadas');
    newAchievements.push(weekAchievement);
  }

  // 2. Logro mensual SOLO para hábitos con frecuencia mensual
  if (habit.frequency === 'Mensual') {
    const totalMonthlyAchievements = await Achievement.countDocuments({
      userId: habit.userId,
      habitId: habit._id,
      type: 'MonthlyChampion'
    });

    const streakMonths = Math.floor(habit.streakCurrent / 30);

    // Solo crear logro mensual y eliminar logros semanales si ya se completaron 30 días consecutivos
    if (streakMonths > totalMonthlyAchievements) {
      const monthAchievement = await Achievement.create({
        userId: habit.userId,
        habitId: habit._id,
        type: 'MonthlyChampion',
        earnedOn: new Date(),
        badgeUrl: '/badges/monthly-champion.svg'
      });

      console.log('🏆 Trofeo mensual guardado');

      // Al alcanzar el logro mensual, eliminar todos los logros semanales de este hábito mensual
      await Achievement.deleteMany({
        userId: habit.userId,
        habitId: habit._id,
        type: 'PerfectWeek'
      });

      newAchievements.push(monthAchievement);
    }
  }

  return newAchievements;
}

module.exports = { checkAchievement };