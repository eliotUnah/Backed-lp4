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
const authenticateUser = require('../middlewares/authenticateUser');
// Definición de endpoints
router.post('/:habitId', authenticateUser, createReminder);
router.get('/', authenticateUser, getUserReminders); // ✅ corregido
router.put('/:id', authenticateUser, updateReminder);
router.delete('/:id', authenticateUser, deleteReminder);
router.patch('/:id/deactivate', authenticateUser, toggleReminderState);

module.exports = router;

