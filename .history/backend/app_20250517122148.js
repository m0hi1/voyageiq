import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import config from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import { setupSwagger } from './utils/swagger.js';
import configureSecurity from './middleware/securityMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

/**
 * Initialize Express application with middleware and routes
 * @returns {Express} Configured Express application
 */
const createApp = () => {
  const app = express();
    // CORS configuration from central config
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (config.cors.allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

  // Security headers
  app.use(helmet());

  // Parse request bodies
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  
  // Parse cookies
  app.use(cookieParser());
  
  // Compress responses
  app.use(compression());
    // Rate limiting based on environment
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.isDevelopment ? 500 : 100, // Higher limit in development
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api', limiter);
  
  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/tours', tourRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
  app.use('/api/v1/trips', tripRoutes);
  
  // Swagger API documentation
  setupSwagger(app);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });
  
  // Error handling
  app.use(notFound); // 404 handler
  app.use(errorHandler); // Global error handler
  
  return app;
};

export default createApp;
