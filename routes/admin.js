const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller")

// DECRYPT TOKEN
router.get('/list', adminController.LIST_OF_ADMIN)

// NEW ADMIN USER
router.post('/add-user', adminController.ADD_NEW_USER)

// DASHBOARD HOD DATA FETCH
router.get('/fetch/:admin_id', adminController.GET_HOD_RECORDS)

// DASHBOARD HOSTEL WARDEN DATA FETCH
router.get('/fetch-warden/:admin_id', adminController.GET_ADMIN_RECORDS)

// DECLINE AND ADDING REMARK BY HOD
router.post('/add-user', adminController.ADD_NEW_USER)



module.exports = router;
