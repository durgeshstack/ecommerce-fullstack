import { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export const errorMiddleware = (err: ApiError, req: Request, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
