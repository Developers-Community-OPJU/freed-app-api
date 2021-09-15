const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller")


// ADMIN ROUTES
// LIST ALL RECORDS
router.get('/', recordController.GET_ALL);

// LIST ALL RECORDS
// ex. student id : 01ug18020005
router.get('/sid/:studentId', recordController.GET_RECORDS);

// TO GET ANY RECORD WITH ID
router.get('/:id', recordController.GET_RECORD);

// APPLY FOR NEW LEAVE
router.post('/new', recordController.REQUEST_NEW_RECORD)

// CANCEL REQUEST
router.delete("/:id", recordController.CANCEL_REQUEST)

//UPDATE STATUS
router.put('/:id', recordController.UPDATE_STATUS)

// ADD REMARK
router.post('/:id/remark', recordController.ADD_REMARK)



// GET RECORD WITH ID and STUDENT ID
// router.get('/:recordId/:RID', recordController.GET_STUDENT_RECORD);

module.exports = router;
