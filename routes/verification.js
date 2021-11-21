const express = require("express");
const router = express.Router();
const verificationController = require('../controllers/verification.controller')

// GET STUDENTS LIST FOR VERFICATION
router.get('/list-students', verificationController.LIST_STUDENTS);

// GET STUDENTS LIST FOR VERFICATION
router.get('/get-student/:id', verificationController.GET_STUDENT);

// verfy student
router.post('/verify/:id', verificationController.VERIFY_STUDENT)

module.exports = router;
