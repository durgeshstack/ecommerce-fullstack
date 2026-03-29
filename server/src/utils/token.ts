import { V3 } from 'paseto';
import { env } from '../config/env';
import { PasetoPayload } from '../types/auth';

const secret = Buffer.from(env.PASETO_SECRET!, 'base64');

export const generateToken = async (payload: PasetoPayload) => {
  return await V3.encrypt(
    {
      ...payload,
      type: 'access',
    },
    secret,
    {
      expiresIn: '1h',
    },
  );
};

export const verifyToken = async (token: string) => {
  const data = (await V3.decrypt(token, secret)) as PasetoPayload;

  if (data.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return data;
};

export const generateRefreshToken = async (payload: PasetoPayload) => {
  return await V3.encrypt(
    {
      userId: payload.userId,
      type: 'refresh',
    },
    secret,
    {
      expiresIn: '7d',
    },
  );
};

export const verifyRefreshToken = async (token: string) => {
  const data = (await V3.decrypt(token, secret)) as PasetoPayload;

  if (data.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }

  return data;
};
