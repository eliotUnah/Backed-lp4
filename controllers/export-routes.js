const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUser');
const { exportUserHistory } = require('../services/exportService');

router.get('/export', authenticateUser, exportUserHistory);

module.exports = router;
