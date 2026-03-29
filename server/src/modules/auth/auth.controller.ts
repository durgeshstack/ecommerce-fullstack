import { Request, Response } from 'express';
import {
  changePasswordService,
  forgetService,
  getLoginUserService,
  resetService,
  signinService,
  signupService,
} from './auth.service';
import { sendResponse } from '../../utils/apiResponse';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../../utils/token';
import { PasetoPayload } from '../../types/auth';
import { createSession, deleteSession, getSession } from '../../utils/session';

export const signupController = async (req: Request, res: Response) => {
  const postData = req.body;
  const result = await signupService(postData);

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }
  return sendResponse(res, {}, 'Sign up successfully');
};

export const signinController = async (req: Request, res: Response) => {
  const postData = req.body;

  const result = await signinService(postData);

  if (!result.success || !result.data) {
    throw new Error(result.message);
  }

  const user = result.data;

  const payload: PasetoPayload = {
    userId: user.id,
    tenantId: user.tenantId!,
    roleType: user.roleType,
    tokenVersion: user.tokenVersion,
  };
  const sessionId = await createSession(payload);

  const accessToken = await generateToken({ ...payload, sessionId });
  const refreshToken = await generateRefreshToken({ ...payload, sessionId });

  const isProd = process.env.NODE_ENV === 'production';
  console.log('isProd', isProd);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  return sendResponse(res, user, 'Login successful');
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) throw new Error('No refresh token');

  const payload = (await verifyRefreshToken(token)) as PasetoPayload;

  const session = await getSession(payload.userId, payload.sessionId!);

  if (!session) {
    throw new Error('Session expired');
  }

  const newAccessToken = await generateToken(payload);

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  return sendResponse(res, {}, 'Token refreshed');
};

export const signoutController = async (req: Request, res: Response) => {
  const { userId, sessionId } = req.user as PasetoPayload;

  await deleteSession(userId, sessionId!);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return sendResponse(res, {}, 'Logged out successfully');
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const postData = req.body;
  const result = await forgetService(postData);
  if (!result.success) {
    throw new Error(result.message);
  }
  sendResponse(res, {}, result.message);
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const postData = req.body;
  const { token } = req.params;

  const result = await resetService(postData, token as string);

  if (!result.success) {
    throw new Error(result.message);
  }
  sendResponse(res, {}, result.message);
};

export const changePasswordController = async (req: Request, res: Response) => {
  const postData = req.body;
  const { userId } = req.user as PasetoPayload;

  const result = await changePasswordService(postData, userId);

  if (!result.success) {
    throw new Error(result.message);
  }
  sendResponse(res, {}, result.message);
};

export const getLoginUserController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await getLoginUserService(userId!);
  if (!result.success) {
    throw new Error(result.message);
  }
  sendResponse(res, result.data, result.message);
};
