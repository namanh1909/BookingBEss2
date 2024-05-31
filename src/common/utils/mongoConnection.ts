import mongoose from 'mongoose';

import { logger } from '@/server';

import { env } from './envConfig';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
