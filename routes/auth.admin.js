const express = require("express");
const router = express.Router();
const authAdminController = require("../controllers/auth.admin.controller")

// STUDENT REGISTRATION
router.post('/register', authAdminController.REGISTER_ADMIN)

// ADMIN LOGIN
router.post('/login', authAdminController.LOGIN_ADMIN)

// DECRYPT TOKEN
router.post('/spread_token', authAdminController.SPREAD_TOKEN)

module.exports = router;
