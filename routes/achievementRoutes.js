const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement-model.js');

// Obtener logros del usuario autenticado
// Obtener logros del usuario autenticado, con datos del hábito
router.get('/achievements', async (req, res) => {
  try {
    const uid = req.user.uid;
    const achievements = await Achievement.find({ userId: uid }).populate('habitId');
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error al obtener logros:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


module.exports = router;
