import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'unauthorized'));
  }
  if (req.user.roleType !== 'ADMIN') {
    return next(new ApiError(401, 'Admin only'));
  }
  next();
};

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'unauthorized'));
  }
  if (req.user.roleType !== 'SUPER_ADMIN') {
    return next(new ApiError(401, 'Super Admin only'));
  }
  next();
};
