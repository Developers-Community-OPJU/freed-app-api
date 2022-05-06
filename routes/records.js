const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller");

// ADMIN ROUTES
// LIST ALL RECORDS
router.get("/", recordController.GET_ALL);

// LIST ALL RECORDS
// ex. student id : 01ug18020005
router.get("/sid/:studentId", recordController.GET_RECORDS);

// TO GET ANY RECORD WITH ID
router.get("/:id", recordController.GET_RECORD);

// APPLY FOR NEW LEAVE
router.post("/new", recordController.REQUEST_NEW_RECORD);

// CANCEL REQUEST
router.delete("/:id", recordController.CANCEL_REQUEST);

//UPDATE STATUS
router.put("/:id", recordController.UPDATE_STATUS);

// ADD REMARK
router.post("/:id/remark", recordController.ADD_REMARK);

// REQUSET FOR APPROVAL BY WARDEN
router.post("/approval-request", recordController.REQUEST_APPROVAL);

// ###### APPROVAL ROUTES BY HOD

// DECLINE BY HOD AND ADDING REMARK
router.post("/approval-decline", recordController.DECLINE_APPROVAL);

// ACCEPT APPROvAL BY HOD
router.post("/approval-accept", recordController.ACCEPT_APPROVAL);

// ####### ADMIN RECORD ACTIONS

// ACCEPT MULTIPLE RECORDS
router.post("/accept", recordController.ACCEPT_MULTI_RECORDS);

module.exports = router;
