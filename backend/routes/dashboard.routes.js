const express = require("express");
const {
  getDashboardStatistics,
} = require("../controllers/dashboard.controller");

const router = express.Router();

// Define the route for fetching dashboard statistics
router.get("/statistics", getDashboardStatistics);

module.exports = router;
