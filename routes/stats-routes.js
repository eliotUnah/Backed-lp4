const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/statsController');
const authMiddleware = require('../middlewares/authenticateUser'); // asegúrate de tener esto

// 🔐 Ruta protegida para dashboard de progreso
router.get('/stats/overview', authMiddleware, getOverviewStats);

module.exports = router;