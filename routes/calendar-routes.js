const express = require("express");
const router = express.Router();
const { createTestEvent, syncHabitsToCalendar} = require("../controllers/calendar_controller");
const authenticateUser = require("../middlewares/authenticateUser");

router.post("/sync-habits", authenticateUser, syncHabitsToCalendar);
router.post("/crear-evento-prueba", authenticateUser, createTestEvent);

module.exports = router;
