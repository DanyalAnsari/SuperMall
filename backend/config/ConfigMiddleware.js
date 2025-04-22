const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");



// Configure basic middleware
const configureMiddleware = (app) => {
  // Body parser
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

};

module.exports=configureMiddleware