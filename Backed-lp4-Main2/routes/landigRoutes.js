const express = require('express');
const router = express.Router();
const { getLanding, updateLanding } = require('../controllers/landingController');

router.get('/landing', getLanding);
router.put('/landing', updateLanding);

module.exports = router;
