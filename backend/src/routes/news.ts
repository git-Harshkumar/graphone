import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { PaginationParams, NewsArticleCreateSchema } from '../types/index.js';
import { newsService } from '../services/database.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    tag: req.query.tag as string | undefined,
  };
  const pagination = PaginationParams.parse(req.query);

  const { data, nextCursor, hasMore, total } = await newsService.list(filters, pagination);
  paginatedResponse(res, data, nextCursor, hasMore, total);
}));

router.get('/trending', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const data = await newsService.getTrending(limit);
  successResponse(res, data);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = NewsArticleCreateSchema.parse(req.body);
  const { supabaseAdminClient } = await import('../config/supabase.js');
  const { data: article, error } = await supabaseAdminClient
    .from('news_articles')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  successResponse(res, article, {}, 201);
}));

export default router;