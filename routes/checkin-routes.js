"use strict";
const express = require("express");
const checkinController = require("../controllers/checkinController");
const authenticateUser = require("../middlewares/authenticateUser"); //importa el middleware
const router = express.Router();

router.use(authenticateUser);

router
  .route("/:id/checkins")
  .post(checkinController.createCheckin)
  .get(checkinController.getCheckins);

module.exports = router;
