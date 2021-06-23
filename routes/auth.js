const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")

// STUDENT REGISTRATION
router.post('/register/student', authController.REGISTER_STUDENT)

// STUDENT LOGIN
router.post('/login/student', authController.LOGIN_STUDENT)

module.exports = router;
