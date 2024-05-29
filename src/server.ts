import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { authRouter } from './api/auth/authRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

connectMongoDB();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);
app.use(express.json());

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
