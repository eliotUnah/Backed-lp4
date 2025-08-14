// controllers/objectivesController.js
"use strict";

const Habit = require("../models/habits-model");
const asyncHandler = require("express-async-handler");

exports.getGoals = asyncHandler(async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  const stats = await Habit.aggregate([
    { $match: { userId } },

    {
      $lookup: {
        from: "numericcheckins",
        localField: "_id",
        foreignField: "habitId",
        as: "checkins"
      }
    },

    {
      $project: {
        title: 1,

        // Si goal es null → 0
        goal: { $ifNull: ["$goal", 0] },

        // Total de checkins
        total: { $sum: "$checkins.value" },

        // Si goal > 0 → calcula %, si no → 0
        progress: {
          $cond: [
            { $gt: ["$goal", 0] },
            {
              $multiply: [
                { $divide: [{ $sum: "$checkins.value" }, "$goal"] },
                100
              ]
            },
            0
          ]
        }
      }
    }
  ]);

  res.json(stats);
});