const express = require("express");

const {
    startPractice,
    submitPractice
} = require("../controllers/practicesCon");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/start", protect, startPractice);

router.post("/submit", protect, submitPractice);

module.exports = router;