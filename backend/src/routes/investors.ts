import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { InvestorFilters, PaginationParams, InvestorCreateSchema } from '../types/index.js';
import { investorService } from '../services/database.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = InvestorFilters.parse(req.query);
  const pagination = PaginationParams.parse(req.query);

  const { data, nextCursor, hasMore, total } = await investorService.list(filters, pagination);
  paginatedResponse(res, data, nextCursor, hasMore, total);
}));

router.get('/most-active', asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(parseInt(req.query.days as string) || 90, 365);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const data = await investorService.getMostActive(days, limit);
  successResponse(res, data);
}));

router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await investorService.getBySlug(slug);
  if (!data) {
    return errorResponse(res, 'NOT_FOUND', 'Investor not found', 404);
  }
  successResponse(res, data);
}));

router.get('/:slug/investments', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const pagination = PaginationParams.parse(req.query);

  const investor = await investorService.getBySlug(slug);
  if (!investor) {
    return errorResponse(res, 'NOT_FOUND', 'Investor not found', 404);
  }

  const { data, nextCursor, hasMore } = await investorService.getPortfolio(investor.id, pagination);
  paginatedResponse(res, data, nextCursor, hasMore);
}));

router.get('/:slug/co-investors', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  const investor = await investorService.getBySlug(slug);
  if (!investor) {
    return errorResponse(res, 'NOT_FOUND', 'Investor not found', 404);
  }

  const data = await investorService.getCoInvestors(investor.id, limit);
  successResponse(res, data);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = InvestorCreateSchema.parse(req.body);
  const { supabaseAdminClient } = await import('../config/supabase.js');
  const { data: investor, error } = await supabaseAdminClient
    .from('investors')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  successResponse(res, investor, {}, 201);
}));

export default router;