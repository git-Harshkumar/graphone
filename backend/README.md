# GraphOne Backend

AI Economy Intelligence Platform - Backend API

## Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Caching**: node-cache (in-memory)
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet, CORS

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration (env, Supabase client)
│   ├── middleware/     # Auth, rate limiting, error handling
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic (database, cache)
│   ├── types/          # TypeScript types & Zod schemas
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── scripts/
│   ├── seed.ts         # Database seeding script
│   └── push-schema.ts  # Schema deployment script
├── supabase/
│   └── schema.sql      # Database schema
├── .env.example        # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Run the schema from `supabase/schema.sql` in the Supabase SQL Editor
   - Enable required extensions: `uuid-ossp`, `pg_trgm`

4. **Seed database** (optional):
   ```bash
   npm run db:seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`.

## API Endpoints

All responses follow the format: `{ data, meta?, error? }`

### Companies
- `GET /api/companies` - List companies with filters
- `GET /api/companies/trending` - Top 10 trending companies
- `GET /api/companies/:slug` - Company profile
- `GET /api/companies/:slug/funding` - Funding history
- `GET /api/companies/:slug/products` - Company products
- `GET /api/companies/:slug/graph` - 1-hop ecosystem graph
- `POST /api/companies` - Create company (requires API key)

### Investors
- `GET /api/investors` - List investors with filters
- `GET /api/investors/most-active` - Most active investors (90 days)
- `GET /api/investors/:slug` - Investor profile
- `GET /api/investors/:slug/investments` - Portfolio investments
- `GET /api/investors/:slug/co-investors` - Frequent co-investors
- `POST /api/investors` - Create investor (requires API key)

### Founders
- `GET /api/founders/:slug` - Founder profile
- `POST /api/founders` - Create founder (requires API key)

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Product details
- `POST /api/products` - Create product (requires API key)

### News
- `GET /api/news` - List news with filters
- `GET /api/news/trending` - Trending news (24h)
- `POST /api/news` - Create news (requires API key)

### Search & Utility
- `GET /api/search?q=` - Cross-entity search
- `GET /api/stats` - Platform aggregates
- `GET /api/feed` - Ranked activity feed

## Authentication

Write operations (POST) require the `X-API-Key` header:
```
X-API-Key: your-api-key
```

## Rate Limiting

- 100 requests per minute per IP
- Health endpoint (`/health`) is excluded

## Trending Score Formula

The trending score is a computed field combining four normalized signals:

```
Trending Score = 0.30 × Funding Recency + 0.25 × Employee Growth + 0.25 × News Mentions + 0.20 × Product Upvotes
```

### Component Details

| Component | Weight | Normalization | Rationale |
|-----------|--------|---------------|-----------|
| **Funding Recency** | 30% | `max(0, 1 - days_since_last_round / 365)` | Recent funding indicates investor confidence and growth capital |
| **Employee Growth** | 25% | `min(1, employee_count / 1000)` | Headcount growth correlates with traction and scaling |
| **News Mentions** | 25% | `min(1, mentions_90d / 50)` | Media coverage reflects market mindshare and momentum |
| **Product Upvotes** | 20% | `min(1, total_upvotes / 10000)` | Community engagement signals product-market fit |

### Design Reasoning

1. **Funding Recency (30%)** - Highest weight because fresh capital directly enables growth. The 365-day decay means a round from 6 months ago still contributes ~50%.

2. **Employee Growth (25%)** - Hard metric that's difficult to game. Normalized to 1000 employees (typical late-stage startup).

3. **News Mentions (25%)** - Captures mindshare and market buzz. 90-day window keeps it current. 50 mentions = max score.

4. **Product Upvotes (20%)** - Community validation. Product Hunt-style signals. 10K upvotes = max score.

### Implementation

- Computed via materialized view `company_trending_scores`
- Refreshed periodically via `refresh_trending_scores()` function
- Cached for 5 minutes via `node-cache`

## Caching Strategy

| Data | TTL | Invalidation |
|------|-----|--------------|
| Trending companies | 5 min | On company create |
| Platform stats | 5 min | On any create |
| Investor activity | 5 min | On funding round create |
| Company graph | 5 min | On relation changes |
| Trending news | 5 min | On news create |

## Pagination

All list endpoints use cursor-based pagination:
- Query params: `cursor` (base64 encoded), `limit` (max 100)
- Response includes: `data[]`, `nextCursor`, `hasMore`, `total`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `API_KEY` | Yes | API key for write operations |
| `CORS_ORIGIN` | No | Frontend origin for CORS |

## Deployment

### Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm start`

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## What Would You Build Next (2 More Days)?

If I had 2 more days, I would prioritize:

1. **Real-time Updates** - WebSocket server for live trending scores, funding alerts, and feed updates
2. **Advanced Analytics API** - Cohort analysis, investor portfolio performance, sector trends over time
3. **Data Enrichment Pipeline** - Automated scraping from Crunchbase, PitchBook, Twitter, GitHub for fresh data
4. **GraphQL Endpoint** - Flexible querying for the complex ecosystem graph
5. **Export/Reporting** - PDF/CSV exports for company profiles, investor memos, market reports
6. **Webhook System** - Notify external systems on funding events, trending changes, new companies
7. **Multi-tenant API Keys** - Scoped keys for different customers/teams with usage analytics
8. **Audit Logging** - Track all data mutations for compliance and debugging

## License

MIT