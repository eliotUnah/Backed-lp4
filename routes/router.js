"use strict";
const express = require("express");
const HabitController = require("../controllers/habits-controller");
const authenticateUser = require("../middlewares/authenticateUser"); //importa el middleware

const router = express.Router();

// Aplica el middleware a todas las rutas de hábitos
router.use(authenticateUser);

router
  .post("/crear-habito", HabitController.createHabit)           // Crear hábito
  .get("/buscar-habito", HabitController.getHabits)             // Obtener hábitos propios
  .get("/filtrar-habitos", HabitController.searchHabits)        // Buscar por filtros (HU-05)
  .put("/actualizar-habito", HabitController.updateHabitByUid)  // Actualizar hábito propio
  .delete("/eliminar-habito", HabitController.deleteHabit);     // Eliminar hábito propio

module.exports = router;
