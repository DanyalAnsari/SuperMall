const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const csurf = require("csurf");


// Configure security middleware
const configureSecurityMiddleware = (app) => {
  // Security headers
  const frontendUrl =process.env.FRONTEND_URL?.trim();
  const allowedOrigins = [
    frontendUrl,
    "http://localhost:3000",
    "http://localhost:5173",
  ];
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP if not configured
    })
  );

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    max: process.env.RATE_LIMIT_MAX || 1000,
    windowMs: process.env.RATE_LIMIT_WINDOW || 3600 * 1000,
    message: "Too many requests from this IP, please try again later",
  });
  app.use("/api", limiter);

  const authLimiter = rateLimit({
    max: 5, // Allow only 5 requests
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many login attempts, please try again later",
  });
  app.use("/api/auth", authLimiter);

  // Data sanitization
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
};

module.exports = configureSecurityMiddleware;
