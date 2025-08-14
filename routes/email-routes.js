// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { testEmail } = require('../controllers/emailController');

router.post('/send-test-email', testEmail);

module.exports = router;
