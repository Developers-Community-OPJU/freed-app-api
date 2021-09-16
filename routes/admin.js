const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller")

// DECRYPT TOKEN
router.get('/list', adminController.LIST_OF_ADMIN)

// NEW ADMIN USER
router.post('/add-user', adminController.ADD_NEW_USER)

module.exports = router;
