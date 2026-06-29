import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { FounderCreateSchema } from '../types/index.js';
import { founderService } from '../services/database.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await founderService.getBySlug(slug);
  if (!data) {
    return errorResponse(res, 'NOT_FOUND', 'Founder not found', 404);
  }
  successResponse(res, data);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = FounderCreateSchema.parse(req.body);
  const { supabaseAdminClient } = await import('../config/supabase.js');
  const { data: founder, error } = await supabaseAdminClient
    .from('founders')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  successResponse(res, founder, {}, 201);
}));

export default router;