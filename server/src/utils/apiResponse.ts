import { Response } from 'express';

export const sendResponse = <T>(res: Response, data: T, message = 'Success') => {
  res.json({
    success: true,
    message,
    data,
  });
};
