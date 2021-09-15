const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller")

// DECRYPT TOKEN
router.get('/list', adminController.LIST_OF_ADMIN)

module.exports = router;
