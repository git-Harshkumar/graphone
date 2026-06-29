import { z } from 'zod';

export const CompanyCategory = z.enum([
  'AI Infrastructure',
  'Foundation Models',
  'AI Applications',
  'AI Chips & Hardware',
  'MLOps & Tools',
  'Data & Analytics',
  'Robotics & Automation',
  'Generative Media',
  'AI Research',
  'Enterprise AI',
  'Consumer AI',
  'Healthcare AI',
  'FinTech AI',
  'EdTech AI',
  'Legal/Compliance AI',
  'Cybersecurity AI',
  'AI Agents',
  'AI Coding',
  'AI Search',
  'AI Video',
  'AI Voice',
]);

export const CompanyStage = z.enum([
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Public',
  'Acquired',
]);

export const InvestorType = z.enum(['VC', 'Angel', 'Corporate', 'Family Office', 'Accelerator']);

export const FundingRoundType = z.enum([
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D',
  'Series E+',
  'Debt',
  'Grant',
  'Convertible Note',
  'SAFE',
  'IPO',
  'Secondary',
]);

export const NewsTag = z.enum([
  'Funding',
  'Launch',
  'Acquisition',
  'Partnership',
  'Research',
  'Hiring',
  'Regulation',
  'Market',
  'Product',
  'Leadership',
]);

export const SortOption = z.enum(['trending', 'funded', 'new', 'valuation', 'growth', 'funding', 'employees']);

export const PaginationParams = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export const CompanyFilters = z.object({
  category: CompanyCategory.optional(),
  stage: CompanyStage.optional(),
  country: z.string().optional(),
  sort: SortOption.optional(),
  search: z.string().optional(),
  minFunding: z.coerce.number().optional(),
  maxFunding: z.coerce.number().optional(),
  minEmployees: z.coerce.number().optional(),
  maxEmployees: z.coerce.number().optional(),
  isUnicorn: z.coerce.boolean().optional(),
});

export const InvestorFilters = z.object({
  type: InvestorType.optional(),
  stageFocus: z.string().optional(),
  sectorFocus: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  category: CompanyCategory.optional(),
  fundingTotal: z.number().nonnegative().default(0),
  employeeCount: z.number().int().nonnegative().optional(),
  foundedYear: z.number().int().min(1900).max(2030).optional(),
  hqCity: z.string().max(100).optional(),
  hqCountry: z.string().max(100).optional(),
  logoUrl: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  stage: CompanyStage.optional(),
  isUnicorn: z.boolean().default(false),
  valuation: z.number().nonnegative().optional(),
  growthScore: z.number().min(0).max(100).optional(),
  lastScrapedAt: z.string().datetime().optional().nullable(),
  dataConfidenceScore: z.number().min(0).max(100).default(50),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const InvestorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  type: InvestorType,
  bio: z.string().max(5000).optional(),
  aum: z.number().nonnegative().optional(),
  portfolioCount: z.number().int().nonnegative().default(0),
  stageFocus: z.array(CompanyStage).default([]),
  sectorFocus: z.array(z.string()).default([]),
  location: z.string().max(200).optional(),
  logoUrl: z.string().url().optional().nullable(),
  avgCheckSize: z.number().nonnegative().optional(),
  fundNumber: z.number().int().positive().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const FundingRoundSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  roundType: FundingRoundType,
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  date: z.string().datetime(),
  leadInvestorId: z.string().uuid().optional().nullable(),
  coInvestors: z.array(z.string().uuid()).default([]),
  valuation: z.number().nonnegative().optional(),
  sourceUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime().optional(),
});

export const FounderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().max(200).optional(),
  companyId: z.string().uuid(),
  bio: z.string().max(5000).optional(),
  twitter: z.string().max(100).optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  location: z.string().max(200).optional(),
  photoUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().max(100).optional(),
  launchDate: z.string().datetime().optional().nullable(),
  upvotes: z.number().int().nonnegative().default(0),
  websiteUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const NewsArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500),
  url: z.string().url(),
  publishedAt: z.string().datetime(),
  source: z.string().max(200),
  tag: NewsTag,
  relatedCompanyIds: z.array(z.string().uuid()).default([]),
  summary: z.string().max(5000).optional(),
  createdAt: z.string().datetime().optional(),
});

export const CompanyCreateSchema = CompanySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastScrapedAt: true,
});

export const InvestorCreateSchema = InvestorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const FundingRoundCreateSchema = FundingRoundSchema.omit({
  id: true,
  createdAt: true,
});

export const FounderCreateSchema = FounderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const NewsArticleCreateSchema = NewsArticleSchema.omit({
  id: true,
  createdAt: true,
});

export type Company = z.infer<typeof CompanySchema>;
export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyFilters = z.infer<typeof CompanyFilters>;
export type Investor = z.infer<typeof InvestorSchema>;
export type InvestorCreate = z.infer<typeof InvestorCreateSchema>;
export type InvestorFilters = z.infer<typeof InvestorFilters>;
export type FundingRound = z.infer<typeof FundingRoundSchema>;
export type FundingRoundCreate = z.infer<typeof FundingRoundCreateSchema>;
export type Founder = z.infer<typeof FounderSchema>;
export type FounderCreate = z.infer<typeof FounderCreateSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type NewsArticleCreate = z.infer<typeof NewsArticleCreateSchema>;
export type PaginationParams = z.infer<typeof PaginationParams>;
export type SortOption = z.infer<typeof SortOption>;