const express = require("express");
const router = express.Router();
const wardenDashboard = require("../controllers/warden.dashboard.controller");

router.get("/dashboard", wardenDashboard.GET_DASHBOARD_DATA);

/**
 * Get reports of checklist checkout checkins
 */
router.get("/reports", wardenDashboard.GET_REPORTS);

module.exports = router;
