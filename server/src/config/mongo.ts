import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB error', error);
  }
};
