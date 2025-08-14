const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middlewares/auth'); // Si tienes autenticación

// POST /share - Generar token de compartir
router.post('/', authMiddleware, shareController.generateShareToken);

// GET /share/:token - Visualizar snapshot compartido
router.get('/:token', shareController.getSharedSnapshot);

module.exports = router;