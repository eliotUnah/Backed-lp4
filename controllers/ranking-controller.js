"use strict";
const User = require("../models/user-model");
const Habit = require("../models/habits-model");
const Achievement = require("../models/achievement-model");

// Función para calcular puntaje total por usuario
const getGlobalRanking = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.find({}, { uid: 1, email: 1 });

    const ranking = await Promise.all(
      users.map(async (user) => {
        // Obtener mejores rachas del usuario
        const habits = await Habit.find({ userId: user.uid });
        const streakPoints = habits.reduce((total, habit) => total + (habit.streakBest || 0), 0);

        // Obtener cantidad de logros
        const achievementsCount = await Achievement.countDocuments({ userId: user.uid });
        const achievementPoints = achievementsCount * 10; // Cada logro vale 10 puntos (puedes ajustar esto)

        const totalScore = streakPoints + achievementPoints;

        return {
          uid: user.uid,
          email: user.email,
          score: totalScore,
        };
      })
    );

    // Ordenar ranking por puntaje total descendente
    ranking.sort((a, b) => b.score - a.score);

    res.status(200).json({ success: true, data: ranking });
  } catch (error) {
    console.error("Error en getGlobalRanking:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

module.exports = {
  getGlobalRanking,
};
