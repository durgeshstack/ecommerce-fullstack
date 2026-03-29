import { verifyRefreshToken } from "../utils/token";
import { Request, Response, NextFunction } from 'express';
export const refreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new Error("No refresh token");

    const payload = await verifyRefreshToken(token);

    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};