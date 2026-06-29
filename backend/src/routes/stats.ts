import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse } from '../utils/response.js';
import { statsService, searchService, feedService } from '../services/database.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const data = await statsService.getPlatformStats();
  successResponse(res, data);
}));

router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const q = req.query.q as string;
  const limit = parseInt(req.query.limit as string) || 10;
  const data = await searchService.search(q, limit);
  successResponse(res, data);
}));

router.get('/feed', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const data = await feedService.getFeed(limit);
  successResponse(res, data);
}));

export default router;