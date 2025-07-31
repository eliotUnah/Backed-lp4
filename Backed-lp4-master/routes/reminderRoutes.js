// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder,
  toggleReminderState
} = require('../controllers/reminder-controller');

// Definición de endpoints
router.post('/', createReminder);                 // POST /reminders
router.get('/:userId', getUserReminders);         // GET /reminders/:userId
router.put('/:id', updateReminder);               // PUT /reminders/:id
router.delete('/:id', deleteReminder);            // DELETE /reminders/:id
router.patch('/:id/deactivate', toggleReminderState); // PATCH /reminders/:id/deactivate

module.exports = router;