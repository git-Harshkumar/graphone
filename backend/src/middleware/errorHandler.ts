import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { errorResponse } from '../utils/response';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return errorResponse(res, 'VALIDATION_ERROR', validationError.message, 400, err.errors);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.code, err.message, err.statusCode, err.details);
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponse(res, 'UNAUTHORIZED', 'Invalid or missing API key', 401);
  }

  if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
    return errorResponse(res, 'CONFLICT', 'Resource already exists', 409);
  }

  if (err.message.includes('foreign key constraint')) {
    return errorResponse(res, 'BAD_REQUEST', 'Referenced resource does not exist', 400);
  }

  return errorResponse(res, 'INTERNAL_ERROR', 'An unexpected error occurred', 500);
};

export const notFoundHandler = (_req: Request, res: Response) => {
  errorResponse(res, 'NOT_FOUND', 'Resource not found', 404);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};