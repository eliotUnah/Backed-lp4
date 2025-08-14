// routes/numeric-checkin-routes.js
const express = require('express');
const numericCheckinController = require("../controllers/numericCheckinController");
const authenticateUser = require("../middlewares/authenticateUser");
const router = express.Router();

router.use(authenticateUser);

router.post("/:id/checkins/number", numericCheckinController.addNumericCheckin);
router.get("/:id/checkins/number", numericCheckinController.getNumericCheckins);

module.exports = router;
