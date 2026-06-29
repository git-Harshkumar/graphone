# GraphOne Frontend

AI Economy Intelligence Platform - Frontend Application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS only
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Data Fetching**: SWR
- **State Management**: Zustand
- **Font**: Inter (via next/font)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   ├── page.tsx           # Home page (AI Companies)
│   │   ├── companies/
│   │   │   └── [slug]/page.tsx    # Company detail page
│   │   ├── investors/
│   │   │   ├── page.tsx           # Investors discovery
│   │   │   └── [slug]/page.tsx    # Investor profile
│   │   ├── products/page.tsx      # AI Products page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Avatar.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/               # Home page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── TrendingCompanies.tsx
│   │   │   ├── FastestGrowing.tsx
│   │   │   ├── EmergingStartups.tsx
│   │   │   ├── BrowseByCategory.tsx
│   │   │   ├── BreakoutLists.tsx
│   │   │   ├── BannerStrips.tsx
│   │   │   ├── CuratedCollections.tsx
│   │   │   ├── NewOnGraphOne.tsx
│   │   │   └── NewsletterSignup.tsx
│   │   ├── investors/          # Investors page sections
│   │   │   ├── InvestorsHero.tsx
│   │   │   ├── TrendingInvestors.tsx
│   │   │   ├── InvestorCollections.tsx
│   │   │   ├── BrowseByInvestorType.tsx
│   │   │   ├── MostActiveInvestors.tsx
│   │   │   ├── InvestorsBackingWinners.tsx
│   │   │   ├── CapitalThemes.tsx
│   │   │   └── CapitalFlowCTA.tsx
│   │   ├── products/           # Products page sections
│   │   │   ├── ProductsHero.tsx
│   │   │   ├── ProductTabs.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductSidebar.tsx
│   │   └── charts/             # Chart components
│   │       ├── DonutChart.tsx
│   │       └── BarChart.tsx
│   ├── hooks/
│   │   └── useApi.ts           # SWR hooks for API
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
├── public/                     # Static assets
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3001` | Backend API base URL |

## Pages

### 1. Home (`/`) - AI Companies
- Hero with search + category filters
- Trending AI Companies (dark gradient cards with rank badges)
- Fastest Growing (horizontal scroll cards)
- Emerging Startups (mixed card sizes)
- Browse by Category (icon grid)
- Breakout/Recently Funded/Startups to Watch (3 columns)
- AI Unicorns / Frontier Labs / Open Source (banner strips)
- Curated Collections (dark image cards)
- New on GraphOne (filterable grid with sort)
- Newsletter signup footer

### 2. Company Detail (`/companies/[slug]`)
- Header: logo, name, verified badge, tagline, meta row
- Tab navigation: Overview / Timeline / Funding / Ownership / Investors / Leadership / Products / More
- Timeline (horizontal milestone track)
- Funding table + Ownership donut chart
- Investors (3-column: Seed/Series/Growth)
- Founders & Leadership (avatar cards)
- Products (icon grid)
-icon grid)
- Competitor Landscape
- AI Ecosystem Graph
- News, Jobs, Research, Patents, Alumni, Collections, Similar

### 3. Investors Discovery (`/investors`)
- Hero with floating investor logos + search
- Trending Investors (gradient cards)
- Investor Collections (image cards)
- Browse by Investor Type (pill grid)
- Most Active Investors (4-column with mini logos)
- Investors Backing Winners (OpenAI/Anthropic/Perplexity backer lists)
- Capital Themes
- Capital Flow CTA banner

### 4. Investor Profile (`/investors/[slug]`)
- Header: logo, verified badge, name, tagline, location, type tags
- Stat strip: Deals (90d), Lead Investments, Most Active Stage, Top Focus
- Investment Thesis + Portfolio Concentration (donut)
- Recent Investments
- Investment Velocity (bar chart), Capital Flow, Stage Evolution
- Portfolio Winners, Follow-On Strength, Outcome Breakdown
- Network Strength, Co-Investor Network, AI Market Influence, Exit Intelligence
- Research & Mentions, Related Investors

### 5. AI Products (`/products`)
- Sidebar nav (Home, AI Startups, AI Products, Investors, Jobs, News)
- Hero with animated floating logos
- Collection of the Week, Product of the Day
- Tab filters (All, Chat, Code, Agents, Image, Video, Voice, Productivity)
- Most Popular / Newest toggle
- Product list rows (icon, name, description, tags, likes, comments)
- Sponsored banner
- Stay Ahead newsletter signup sidebar

## Design System

### Colors
- **Primary**: Pink/Red (#E91E63 family)
- **Dark**: Slate scale for dark cards
- **Semantic**: Green (success), Yellow (warning), Red (danger), Blue (info)

### Components
- **Cards**: `card` (white), `card-dark` (gradient dark), `outlined` (bordered)
- **Buttons**: `primary`, `secondary`, `ghost`, `outline`
- **Badges**: `primary`, `success`, `warning`, `danger`, `dark`, `outline`
- **Inputs**: Consistent styling with focus states

### Animations
- `float`: Gentle floating animation
- `pulse-slow`: Slow pulse for background elements
- `slide-up`: Entry animation
- `fade-in`: Fade entrance

### Typography
- **Font**: Inter (via next/font)
- **Section Labels**: Uppercase, tracking-wider, with colored dot prefix

## API Integration

All data fetching uses SWR hooks in `src/hooks/useApi.ts`:
- Automatic caching and revalidation
- Deduplication of requests
- Optimistic updates
- Error boundaries

API client in `src/lib/api.ts` handles:
- Base URL configuration
- Request/response formatting
- Error handling

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., Railway/Render URL)
3. Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build Commands
```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Features Implemented

- ✅ Responsive design (mobile-first)
- ✅ Dark mode support (via class strategy)
- ✅ Keyboard shortcut (`/`) to focus search
- ✅ Typeahead search in header
- ✅ Cursor-based pagination
- ✅ Animated hero sections (Framer Motion)
- ✅ Interactive charts (Recharts)
- ✅ Tab navigation with animations
- ✅ Toast notifications ready
- ✅ SEO metadata (Open Graph, Twitter Cards)
- ✅ Accessibility (ARIA labels, semantic HTML)

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT