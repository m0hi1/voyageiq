import mongoose from 'mongoose';
import logger from './logger.js';
import config from '../config/index.js';

/**
 * Connect to MongoDB with retry logic
 */
export const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(config.mongo.url, config.mongo.options);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      const errorMessage = `MongoDB connection error: ${error.message}`;
      
      if (error.message.includes("IP that isn't whitelisted")) {
        logger.error(`${errorMessage}
        
IMPORTANT: Your IP address is not whitelisted in MongoDB Atlas.
To fix this:
1. Log in to MongoDB Atlas at https://cloud.mongodb.com
2. Go to Network Access under Security in the left menu
3. Click "Add IP Address" and add your current IP address
4. Or use "Allow Access From Anywhere" for development (not recommended for production)
        `);
      } else {
        logger.error(`${errorMessage} (Attempt ${retries}/${maxRetries})`);
      }
      
      if (retries >= maxRetries) {
        logger.error('Failed to connect to MongoDB after multiple attempts. Exiting...');
        process.exit(1);
      }
      
      // Wait for 3 seconds before trying again
      logger.info(`Retrying connection in 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

/**
 * Configure and start the Express server
 * @param {Express} app - The Express application
 * @param {number} port - The port to listen on
 */
export const startServer = (app, port) => {
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${config.env} mode`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
  
  // Handle SIGTERM signal (e.g., from Docker or PaaS)
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
  
  return server;
};
