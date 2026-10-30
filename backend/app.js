// we're importing Express
const express = require("express");
const cors = require("cors");

const app = express();

// CORS middleware
app.use(cors());

// JSON middleware
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "PrepPilot API is running"
    });
});

// Authentication routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Question routes
const questionRoutes = require("./routes/questionRoutes");

app.use("/api/question", questionRoutes);

// Practice routes
const practicesRo = require("./routes/practicesRo");

app.use("/api/practice", practicesRo);

// Dashboard routes
const dashboardRoutes = require("./routes/dashboardroutes");

app.use("/api/dashboard", dashboardRoutes);


const profileRoutes = require("./routes/profileRoutes");

app.use("/api/profile", profileRoutes);


const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);

// exporting configured express application
module.exports = app;