import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const key = issue.path[0].toString();
            if (!formattedErrors[key]) {
              formattedErrors[key] = issue.message;
            }
          }
        });

        return res.status(422).json(formattedErrors);
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  };
