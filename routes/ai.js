const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const suggestHabit = require("../controllers/aiSuggestController");
const { getUserSuggestions, toggleFavorite, convertToHabit } = require("../controllers/suggestionController");

router.use(authenticateUser);

// Ruta: Obtener sugerencia diaria de IA (1 cada 24 h)
router.get("/suggest", suggestHabit);

// Ruta: Obtener historial de sugerencias
router.get("/history", getUserSuggestions);

// Ruta: Marcar o desmarcar sugerencia como favorita
router.patch("/favorite/:id", toggleFavorite);

// Ruta: Convertir en hábito
router.post('/convert/:id', convertToHabit);

module.exports = router;
