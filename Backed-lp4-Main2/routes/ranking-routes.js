"use strict";
const express = require("express");
const router = express.Router();
const { getGlobalRanking }  = require("../controllers/ranking-controller");
const authenticateUser = require('../middlewares/authenticateUser');

// 📊 Ruta para ranking global
router.get("/global",authenticateUser, getGlobalRanking);

// 📌 Aquí puedes agregar más rutas si quieres (ranking entre amigos, top semanal, etc.)

module.exports = router;
