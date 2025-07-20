const Achievement = require('../models/achievement-model.js'); // importa el modelo

async function checkAchievement(habit) {
  const logro = {
    type: 'PerfectWeek',
    threshold: 7,
    badgeUrl: '/badges/perfect-week.svg'
  };

  // ¿Ya tiene el logro?
  const alreadyEarned = await Achievement.findOne({
    userId: habit.userId,
    habitId: habit._id,
    type: logro.type
  });

  if (habit.streakCurrent >= logro.threshold && !alreadyEarned) {
     const newAchievement =await Achievement.create({
      userId: habit.userId,
      habitId: habit._id,
      type: logro.type,
      earnedOn: new Date(),
      badgeUrl: logro.badgeUrl
    });

    console.log(`🏅 Nuevo logro guardado: ${logro.type}`);
    return [newAchievement]; // 👈 Devuelve como array
}

return [];
}
module.exports = { checkAchievement };
