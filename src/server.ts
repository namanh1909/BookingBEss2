import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { authRouter, doctorRouter, userRouter } from './api';
import { connectMongoDB } from './common/utils/mongoConnection';

const logger = pino({ name: 'server start' });
const app: Express = express();

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
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/doctor', doctorRouter);

// Swagger UI
app.use(openAPIRouter);
// Error handlers
app.use(errorHandler());

export { app, logger };
