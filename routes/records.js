const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller")

// LIST ALL RECORDS
router.get('/', recordController.all);

// APPLY FOR NEW LEAVE
router.post('/apply', recordController.apply)

module.exports = router;
