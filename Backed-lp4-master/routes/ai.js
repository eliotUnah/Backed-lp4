const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const suggestHabit = require("../controllers/aiSuggestController");

router.get("/suggest", authenticateUser, suggestHabit);

module.exports = router;
