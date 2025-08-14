const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUser');
const {
  updateUserTheme,
  getUserTheme,
} = require('../controllers/userPreferencesController');

router.put('/', authenticateUser, updateUserTheme);
router.get('/', authenticateUser, getUserTheme);

module.exports = router;
