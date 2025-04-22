const winston = require('winston');
const { format } = winston;

// Custom console format with colors
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    const msg = typeof message === 'object' ? 
      JSON.stringify(message, null, 2) : message;
    return `${timestamp} ${level}: ${msg}`;
  })
);

// Custom file format
const fileFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    const msg = typeof message === 'object' ? 
      JSON.stringify(message, null, 2) : message;
    return `${timestamp} ${level}: ${msg}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // Console transport (always enabled)
    new winston.transports.Console({
      format: consoleFormat
    }),
    // File transports
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat
    }),
    // File transports
    new winston.transports.File({
      filename: 'logs/adminActivity.log',
      level:'info',
      format: fileFormat
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat
    })
  ]
});

module.exports = logger;