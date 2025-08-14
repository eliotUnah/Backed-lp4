// routes/objectives-routes.js
"use strict";
const express = require("express");
const { getGoals } = require("../controllers/objectivesController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.use(authenticateUser);

// GET /api/objectives/goals
router.get("/objectives/goals", getGoals);

module.exports = router;
