import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { PaginationParams, ProductCreateSchema } from '../types/index.js';
import { productService } from '../services/database.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    category: req.query.category as string | undefined,
    sort: req.query.sort as string | undefined,
  };
  const pagination = PaginationParams.parse(req.query);

  const { data, nextCursor, hasMore, total } = await productService.list(filters, pagination);
  paginatedResponse(res, data, nextCursor, hasMore, total);
}));

router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await productService.getBySlug(slug);
  if (!data) {
    return errorResponse(res, 'NOT_FOUND', 'Product not found', 404);
  }
  successResponse(res, data);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = ProductCreateSchema.parse(req.body);
  const { supabaseAdminClient } = await import('../config/supabase.js');
  const { data: product, error } = await supabaseAdminClient
    .from('products')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  successResponse(res, product, {}, 201);
}));

export default router;