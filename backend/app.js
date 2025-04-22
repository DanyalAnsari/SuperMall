const express = require("express");
const globalErrorHandler = require("./controllers/ErrorController");
const configureSecurityMiddleware = require("./config/ConfigSecurity");
const configureMiddleware = require("./config/ConfigMiddleware");
const CustomError = require("./utils/CustomError");
const router = require("./routes/MainRoute");
const requestLogger = require('./middlewares/LoggerMiddleware');
require('dotenv').config()

// Initialize express app
const app = express();

// Security Middleware Configuration
configureSecurityMiddleware(app);

// Basic Middleware Configuration
configureMiddleware(app);

// Request Logger Middleware
app.use(requestLogger);

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes with version prefix
app.use("/api", router);

// Handle 404 Routes
app.all("*", (req, res, next) => {
  next(new CustomError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
