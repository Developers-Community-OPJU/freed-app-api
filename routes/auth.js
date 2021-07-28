const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")
const authAdminController = require("../controllers/auth.admin.controller")

// STUDENT REGISTRATION
router.post('/register/student', authController.REGISTER_STUDENT)

// STUDENT LOGIN
router.post('/login/student', authController.LOGIN_STUDENT)

// RESET PASSWORD
router.post('/reset-password', authController.RESET_PASSWORD)

// DECRYPT TOKEN
router.post('/spread_token', authController.SPREAD_TOKEN)

module.exports = router;
