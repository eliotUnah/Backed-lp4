"use strict";
const express = require("express");
const moodController = require("../controllers/moodController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.use(authenticateUser);

router
  .route("/:id/moods")
  .post(moodController.createMood)
  .get(moodController.getMoods);

module.exports = router;
