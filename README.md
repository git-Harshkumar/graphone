# GraphOne - AI Economy Intelligence Platform

A Bloomberg-style intelligence platform for tracking AI companies, investors, products, funding rounds, founders, and news.

## Monorepo Structure

```
graphone/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind
├── backend/           # Express.js + TypeScript + Supabase (PostgreSQL)
├── package.json       # Root workspace config
└── README.md          # This file
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS only
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Data Fetching**: SWR
- **State**: Zustand
- **Font**: Inter (via next/font)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Caching**: node-cache (in-memory)
- **Auth**: API Key (X-API-Key header)
- **Rate Limiting**: express-rate-limit (100 req/min/IP)

## Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier works)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repo-url>
cd graphone
npm install
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
```

**Required Supabase Setup:**
1. Create a new Supabase project
2. Run the SQL schema from `backend/supabase/schema.sql` in the Supabase SQL Editor
3. Enable extensions: `uuid-ossp`, `pg_trgm`
4. Get your project URL and keys from Settings > API

**Environment Variables:**
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY=dev-api-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### 3. Seed Database (Optional)
```bash
cd backend
npm run db:seed
```
This seeds 50+ real AI companies, 20+ investors, 100+ news articles.

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### 5. Run Development
```bash
# From root - runs both frontend and backend
npm run dev

# Or separately:
npm run dev:backend  # http://localhost:3001
npm run dev:frontend # http://localhost:3000
```

## API Endpoints

All responses: `{ data, meta?, error? }`

### Companies
- `GET /api/companies` - List with filters (category, stage, country, sort)
- `GET /api/companies/trending` - Top 10 by trending score
- `GET /api/companies/:slug` - Full profile
- `GET /api/companies/:slug/funding` - Funding history
- `GET /api/companies/:slug/products` - Products
- `GET /api/companies/:slug/graph` - 1-hop ecosystem graph
- `POST /api/companies` - Create (requires API key)

### Investors
- `GET /api/investors` - List with filters
- `GET /api/investors/most-active` - Ranked by deal count (90d)
- `GET /api/investors/:slug` - Profile + portfolio breakdown
- `GET /api/investors/:slug/investments` - Paginated portfolio
- `GET /api/investors/:slug/co-investors` - Frequent syndication partners
- `POST /api/investors` - Create (requires API key)

### Founders
- `GET /api/founders/:slug` - Profile
- `POST /api/founders` - Create (requires API key)

### Products
- `GET /api/products` - List with category filter, sort=popular/newest
- `GET /api/products/:slug` - Details
- `POST /api/products` - Create (requires API key)

### News
- `GET /api/news` - Paginated, tag filter
- `GET /api/news/trending` - Most read (24h)
- `POST /api/news` - Create (requires API key)

### Search & Utility
- `GET /api/search?q=` - Cross-entity search
- `GET /api/stats` - Platform aggregates (cached)
- `GET /api/feed` - Ranked activity feed

## Trending Score Formula

```
Trending Score = 0.30 × Funding Recency + 0.25 × Employee Growth + 0.25 × News Mentions + 0.20 × Product Upvotes
```

| Component | Weight | Normalization | Rationale |
|-----------|--------|---------------|-----------|
| **Funding Recency** | 30% | `max(0, 1 - days_since_last_round / 365)` | Fresh capital = growth capacity |
| **Employee Growth** | 25% | `min(1, employee_count / 1000)` | Headcount = traction proxy |
| **News Mentions** | 25% | `min(1, mentions_90d / 50)` | Mindshare & momentum |
| **Product Upvotes** | 20% | `min(1, total_upvotes / 10000)` | Community validation |

- Computed via materialized view `company_trending_scores`
- Refreshed periodically via `refresh_trending_scores()` function
- Cached for 5 minutes

## Authentication

Write operations require `X-API-Key` header:
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{...}'
```

Default dev key: `dev-api-key-change-in-production`

## Rate Limiting

- 100 requests/minute per IP
- Health endpoint excluded
- Returns 429 with `Retry-After` header

## Caching Strategy

| Data | TTL | Invalidation |
|------|-----|--------------|
| Trending companies | 5 min | On company create |
| Platform stats | 5 min | On any create |
| Investor activity | 5 min | On funding round create |
| Company graph | 5 min | On relation changes |
| Trending news | 5 min | On news create |

## Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set `NEXT_PUBLIC_API_URL` to backend URL
3. Deploy

### Backend → Railway/Render
1. Connect GitHub repo
2. Set all environment variables
3. Build: `npm run build`
4. Start: `npm start`
5. Ensure Supabase allows connections from hosting provider

### Docker
```dockerfile
# Frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# Backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## Project Commands

```bash
# Root
npm run dev              # Run both frontend & backend
npm run build            # Build all packages
npm run lint             # Lint all packages

# Backend
npm run dev              # Dev server with hot reload
npm run build            # TypeScript compile
npm run start            # Production server
npm run db:push          # Push schema to Supabase
npm run db:seed          # Seed database
npm run db:reset         # Push schema + seed

# Frontend
npm run dev              # Next.js dev server
npm run build            # Production build
npm run start            # Production server
npm run lint             # Next.js lint
```

## Data Sources (Seed Data)

The seed script includes real-world data for:
- **50+ AI Companies**: OpenAI, Anthropic, Perplexity, Mistral, Cursor, Midjourney, ElevenLabs, Runway, Hugging Face, Databricks, xAI, Cohere, Adept, Character.ai, Stability AI, Scale AI, Weights & Biases, LangChain, Pinecone, Synthesia, Replit, Glean, Sierra, Together AI, Lambda Labs, CoreWeave, Cerebras, Groq, Poolside, Magic, Codeium, Sourcegraph, Tabnine, MosaicML, Modular, Imbue, Contextual AI, Twelve Labs, Pika, HeyGen, Descript, Notion, Figma, Linear, Vercel, Supabase, Prisma, Temporal, Robust Intelligence, Arthur AI, Snorkel AI
- **20+ Investors**: Sequoia, a16z, Lightspeed, Khosla, Accel, General Catalyst, Coatue, Tiger Global, Greylock, Benchmark, Index, NVIDIA (NVentures), GV, M12, Salesforce Ventures, Elad Gil, Nat Friedman, Daniel Gross, SV Angel, Founders Fund, Thrive Capital
- **100+ Funding Rounds**: Real amounts, dates, lead investors
- **25+ News Articles**: Real headlines, sources, dates

## What's Next (Future Enhancements)

If I had 2 more days:

1. **Real-time Updates** - WebSocket server for live trending scores, funding alerts, feed updates
2. **Advanced Analytics API** - Cohort analysis, investor portfolio performance, sector trends over time
3. **Data Enrichment Pipeline** - Automated scraping from Crunchbase, PitchBook, Twitter, GitHub
4. **GraphQL Endpoint** - Flexible querying for complex ecosystem graphs
5. **Export/Reporting** - PDF/CSV exports for company profiles, investor memos, market reports
6. **Webhook System** - Notify external systems on funding events, trending changes, new companies
7. **Multi-tenant API Keys** - Scoped keys for different customers/teams with usage analytics
8. **Audit Logging** - Track all data mutations for compliance and debugging

## License

MIT