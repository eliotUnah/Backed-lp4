const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticateUser');
const Habit = require('../models/habits-model');

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.uid;
  const { categoryId } = req.query;

  if (!categoryId) {
    return res.status(400).json({ message: "Falta el parámetro categoryId" });
  }

  const habits = await Habit.find({ userId, category: categoryId }) .populate('category', 'name');
  res.json(habits);
});
module.exports = router;  