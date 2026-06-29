import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { CompanyFilters, PaginationParams, CompanyCreateSchema } from '../types/index.js';
import { companyService } from '../services/database.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = CompanyFilters.parse(req.query);
  const pagination = PaginationParams.parse(req.query);

  const { data, nextCursor, hasMore, total } = await companyService.list(filters, pagination);
  paginatedResponse(res, data, nextCursor, hasMore, total);
}));

router.get('/trending', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const data = await companyService.getTrending(limit);
  successResponse(res, data);
}));

router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await companyService.getBySlug(slug);
  if (!data) {
    return errorResponse(res, 'NOT_FOUND', 'Company not found', 404);
  }
  successResponse(res, data);
}));

router.get('/:slug/funding', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = await companyService.getBySlug(slug);
  if (!company) {
    return errorResponse(res, 'NOT_FOUND', 'Company not found', 404);
  }
  const pagination = PaginationParams.parse(req.query);
  const { data, nextCursor, hasMore } = await companyService.getFunding(company.id, pagination);
  paginatedResponse(res, data, nextCursor, hasMore);
}));

router.get('/:slug/products', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = await companyService.getBySlug(slug);
  if (!company) {
    return errorResponse(res, 'NOT_FOUND', 'Company not found', 404);
  }
  const data = await companyService.getProducts(company.id);
  successResponse(res, data);
}));

router.get('/:slug/graph', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await companyService.getGraph(slug);
  if (!data.company) {
    return errorResponse(res, 'NOT_FOUND', 'Company not found', 404);
  }
  successResponse(res, data);
}));

router.post('/', apiKeyAuth, asyncHandler(async (req: Request, res: Response) => {
  const data = CompanyCreateSchema.parse(req.body);
  const company = await companyService.create(data);
  successResponse(res, company, {}, 201);
}));

export default router;