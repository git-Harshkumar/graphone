import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { PaginationParams, FundingRoundCreateSchema } from '../types/index.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { supabasePublicClient, supabaseAdminClient } from '../config/supabase.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { companyId } = req.query;
  const pagination = PaginationParams.parse(req.query);

  let query = supabasePublicClient
    .from('funding_rounds')
    .select('*, company:companies(*), lead_investor:investors(*)')
    .order('date', { ascending: false });

  if (companyId) query = query.eq('company_id', companyId);

  const limit = pagination.limit || 20;
  if (pagination.cursor) {
    try {
      const decoded = Buffer.from(pagination.cursor, 'base64').toString();
      const [id, date] = decoded.split(':');
      query = query.or(`date.lt.${date},and(date.eq.${date},id.lt.${id})`);
    } catch {}
  }
  query = query.limit(limit + 1);

  const { data, error } = await query;
  if (error) throw error;

  const hasMore = (data?.length || 0) > limit;
  const items = hasMore ? data!.slice(0, limit) : data || [];
  const nextCursor = hasMore && items.length > 0
    ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].date}`).toString('base64')
    : null;

  paginatedResponse(res, items, nextCursor, hasMore);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = FundingRoundCreateSchema.parse(req.body);
  const { data: round, error } = await supabaseAdminClient
    .from('funding_rounds')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  successResponse(res, round, {}, 201);
}));

export default router;