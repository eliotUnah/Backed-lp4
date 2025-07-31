const express = require("express");
const router = express.Router();
const { startAuth, handleCallback, checkLinkStatus } = require('../controllers/google_controller');
const authenticateUser = require('../middlewares/authenticateUser');


router.get("/auth",  authenticateUser, startAuth);           
router.get("/callback", authenticateUser, handleCallback); 
router.get("/status", authenticateUser, checkLinkStatus);

module.exports = router;
