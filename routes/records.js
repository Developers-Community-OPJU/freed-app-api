const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller")


// ADMIN ROUTES
// LIST ALL RECORDS
router.get('/', recordController.GET_ALL);

// LIST ALL RECORDS
router.get('/sid/:studentId', recordController.GET_RECORDS);

// TO GET ANY RECORD WITH ID
router.get('/:id', recordController.GET_RECORD);

// GET RECORD WITH ID and STUDENT ID
router.get('/:recordId/:RID', recordController.GET_STUDENT_RECORD);

// APPLY FOR NEW LEAVE
router.post('/new', recordController.REQUEST_NEW_RECORD)



// UPDATE RECORD ROUTES - ACTIONS





module.exports = router;
