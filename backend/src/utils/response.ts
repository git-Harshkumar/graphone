import { Response } from 'express';

export interface ApiResponse<T> {
  data: T | null;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const successResponse = <T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = { data, meta };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: unknown
) => {
  const response: ApiResponse<null> = {
    data: null,
    error: { code, message, details },
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  cursor: string | null,
  hasMore: boolean,
  total?: number | null
) => {
  return successResponse(res, data, {
    pagination: {
      cursor,
      hasMore,
      total: total ?? undefined,
    },
  });
};