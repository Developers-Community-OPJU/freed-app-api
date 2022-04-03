const express = require("express");
const router = express.Router();
const wardenDashboard = require("../controllers/warden.dashboard.controller")


router.get('/dashboard', wardenDashboard.GET_DASHBOARD_DATA);

module.exports = router;