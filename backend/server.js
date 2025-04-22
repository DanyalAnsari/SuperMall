const app = require("./app");
const logger = require("./utils/logger");
const { connectDB, closeDB, checkDBHealth } = require("./db/mongo");

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(process.env.MONGO_DB_URI);


// Add health check endpoint to your app.js
app.get('/health/db', async (req, res) => {
  const dbHealth = await checkDBHealth();
  res.status(dbHealth.status === 'healthy' ? 200 : 503).json(dbHealth);
});

// Initialize server
async function startServer() {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);

      gracefulShutdown(server);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);

      process.exit(1);
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      gracefulShutdown(server);
    });

    // Handle SIGINT
    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully');
      gracefulShutdown(server);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown function
async function gracefulShutdown(server) {
  try {
    await server.close();
    logger.info('Server closed');
    
    await closeDB();
    logger.info('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

startServer();
