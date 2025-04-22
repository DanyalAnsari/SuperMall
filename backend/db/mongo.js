const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * MongoDB connection options
 */
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: process.env.NODE_ENV !== 'production', // Disable auto-indexing in production
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Monitor connection pool events
    conn.connection.on('connecting', () => {
      logger.info('Establishing database connection...');
    });

    conn.connection.on('connected', () => {
      logger.info('Database connection established');
    });

    conn.connection.on('disconnecting', () => {
      logger.warn('Database disconnecting...');
    });

    conn.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
    });

    conn.connection.on('error', (err) => {
      logger.error('Database connection error:', err);
    });

    // Monitor connection pool events
    conn.connection.on('fullsetup', () => {
      logger.info('MongoDB replica set connected');
    });

    return conn;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed successfully');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

/**
 * Check database health
 */
const checkDBHealth = async () => {
  try {
    const status = await mongoose.connection.db.admin().ping();
    return {
      status: status.ok === 1 ? 'healthy' : 'unhealthy',
      latency: status.ok === 1 ? status.operationTime : null,
      connectionState: mongoose.connection.readyState
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      connectionState: mongoose.connection.readyState
    };
  }
};

module.exports = {
  connectDB,
  closeDB,
  checkDBHealth
};