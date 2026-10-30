const express = require("express");

const {
    getDashboard,
    getAttemptDetails
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getDashboard);

router.get(
    "/attempt/:attemptId",
    protect,
    getAttemptDetails
);

module.exports = router;