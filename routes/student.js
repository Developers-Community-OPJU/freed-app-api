const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// UPDATING STUDENT PROFILE
router.post("/update", studentController.UPDATE_STUDENT_PROFILE);

module.exports = router;
