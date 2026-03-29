import { redis } from '../config/redis';
import crypto from "crypto";
import { PasetoPayload } from '../types/auth';

const SESSION_TTL = 7 * 24 * 60 * 60;

export const createSession = async (payload: PasetoPayload) => {
  const sessionId = crypto.randomUUID();

  const key = `user:${payload.userId}:sessions:${sessionId}`;

  const value = JSON.stringify({
    userId: payload.userId,
    tenantId: payload.tenantId,
    roleType: payload.roleType,
    tokenVersion: payload.tokenVersion,
  });

  await redis.set(key, value, 'EX', SESSION_TTL);

  return sessionId;
};

export const getSession = async (userId: number, sessionId: string) => {
  const key = `user:${userId}:sessions:${sessionId}`;
  return redis.get(key);
};

export const deleteSession = async (userId: number, sessionId: string) => {
  const key = `user:${userId}:sessions:${sessionId}`;
  return redis.del(key);
};


export const forceLogoutUser = async (userId: number) => {
  const pattern = `user:${userId}:sessions:*`;

  const stream = redis.scanStream({
    match: pattern,
    count: 100,
  });

  const keys: string[] = [];

  for await (const resultKeys of stream) {
    keys.push(...resultKeys);
  }

  if (keys.length > 0) {
    await redis.del(keys);
  }

  return true;
};