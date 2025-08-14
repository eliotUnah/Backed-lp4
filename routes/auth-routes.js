const express = require("express");
const { loginWithFirebase, getCurrentUser } = require("../controllers/auth-controller");


const authenticateUser = require("../middlewares/authenticateUser");


const router = express.Router();

router
  .post("/iniciar-sesion", loginWithFirebase)  //Iniciar sesion 
  .get("/usuario-actual", authenticateUser,getCurrentUser);  //Ver el usuario actual     

module.exports = router;