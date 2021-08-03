const express = require("express");
const router = express.Router();
const gateController = require('../controllers/gate.controller')

// PERFORM CHECKSOUT
// For SECURITY ADD HTTP HEADERS AND VALIDATE TO PROCEED
router.post('/checkout', gateController.CHECK_OUT)

// GET CHECKLIST
router.get('/checklist', gateController.GET_CHECK_LIST)

module.exports = router;
