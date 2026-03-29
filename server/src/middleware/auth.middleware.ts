import { prisma } from '../config/prisma';
import { PasetoPayload } from '../types/auth';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { getSession } from '../utils/session';
import { verifyToken } from '../utils/token';
import { Request, Response, NextFunction } from 'express';
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    if (!token) {
      throw new Error('Unauthorized');
    }

    const payload = (await verifyToken(token)) as PasetoPayload;

    const session = await getSession(payload.userId, payload.sessionId!);

    if (!session) {
      throw new Error('Session expired. Please login again.');
    }

    const parsed = JSON.parse(session);

    if (parsed.tokenVersion !== payload.tokenVersion) {
      throw new Error('Invalid session');
    }

    req.user = payload;
    next();
  } catch (err) {
    logger.error('token failed', err);
    return next(new ApiError(401, 'Unauthorized'));
  }
};
