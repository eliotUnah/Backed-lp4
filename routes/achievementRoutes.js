const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement-model.js');
const authenticateUser = require('../middlewares/authenticateUser'); // 🔐 tu middleware JWT

// Ruta protegida con JWT en cookie o header
router.get('/achievements', authenticateUser, async (req, res) => {
  try {
     
    const uid = req.user.uid; // ← gracias al middleware, esto funciona
    const achievements = await Achievement.find({ userId: uid }).populate('habitId');
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error al obtener logros:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
