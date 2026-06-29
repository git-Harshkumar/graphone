import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { AppError } from './errorHandler';

export const apiKeyAuth = (req: Request, _res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return next(new AppError('UNAUTHORIZED', 'API key required', 401));
  }

  if (apiKey !== config.apiKey) {
    return next(new AppError('FORBIDDEN', 'Invalid API key', 403));
  }

  next();
};

export const optionalApiKey = (req: Request, _res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  req.isAdmin = apiKey === config.apiKey;
  next();
};

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}