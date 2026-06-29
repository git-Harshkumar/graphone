-- GraphOne Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Clean up existing tables and views if they exist
DROP MATERIALIZED VIEW IF EXISTS company_trending_scores CASCADE;
DROP TABLE IF EXISTS news_articles CASCADE;
DROP TABLE IF EXISTS company_views CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS founders CASCADE;
DROP TABLE IF EXISTS funding_rounds CASCADE;
DROP TABLE IF EXISTS investors CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- ============================================
-- COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    funding_total BIGINT DEFAULT 0,
    employee_count INT,
    founded_year INT,
    hq_city TEXT,
    hq_country TEXT,
    logo_url TEXT,
    website TEXT,
    stage TEXT,
    is_unicorn BOOLEAN DEFAULT FALSE,
    valuation BIGINT,
    growth_score DECIMAL(5,2) DEFAULT 0,
    last_scraped_at TIMESTAMPTZ,
    data_confidence_score DECIMAL(5,2) DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_stage ON companies(stage);
CREATE INDEX idx_companies_country ON companies(hq_country);
CREATE INDEX idx_companies_trending ON companies(growth_score DESC, funding_total DESC);
CREATE INDEX idx_companies_search ON companies USING GIN (name gin_trgm_ops, description gin_trgm_ops);

-- ============================================
-- INVESTORS TABLE
-- ============================================
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('VC', 'Angel', 'Corporate')),
    bio TEXT,
    aum BIGINT,
    portfolio_count INT DEFAULT 0,
    stage_focus TEXT[],
    sector_focus TEXT[],
    location TEXT,
    logo_url TEXT,
    avg_check_size BIGINT,
    fund_number INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_investors_slug ON investors(slug);
CREATE INDEX idx_investors_type ON investors(type);
CREATE INDEX idx_investors_stage_focus ON investors USING GIN (stage_focus);
CREATE INDEX idx_investors_sector_focus ON investors USING GIN (sector_focus);

-- ============================================
-- FUNDING ROUNDS TABLE
-- ============================================
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    round_type TEXT NOT NULL,
    amount BIGINT NOT NULL,
    currency TEXT DEFAULT 'USD',
    date DATE NOT NULL,
    lead_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
    co_investors UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (company_id, date, round_type)
);

CREATE INDEX idx_funding_rounds_company ON funding_rounds(company_id);
CREATE INDEX idx_funding_rounds_date ON funding_rounds(date DESC);
CREATE INDEX idx_funding_rounds_lead_investor ON funding_rounds(lead_investor_id);

-- ============================================
-- FOUNDERS TABLE
-- ============================================
CREATE TABLE founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    bio TEXT,
    twitter TEXT,
    linkedin TEXT,
    location TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_founders_slug ON founders(slug);
CREATE INDEX idx_founders_company ON founders(company_id);
CREATE INDEX idx_founders_search ON founders USING GIN (name gin_trgm_ops);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    launch_date DATE,
    upvotes INT DEFAULT 0,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (company_id, name)
);

CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_upvotes ON products(upvotes DESC);
CREATE INDEX idx_products_search ON products USING GIN (name gin_trgm_ops, description gin_trgm_ops);

-- ============================================
-- NEWS ARTICLES TABLE
-- ============================================
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    published_at TIMESTAMPTZ NOT NULL,
    source TEXT,
    tag TEXT,
    related_company_ids UUID[],
    summary TEXT,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_tag ON news_articles(tag);
CREATE INDEX idx_news_companies ON news_articles USING GIN (related_company_ids);
CREATE INDEX idx_news_search ON news_articles USING GIN (title gin_trgm_ops, summary gin_trgm_ops);

-- ============================================
-- COMPANY VIEWS (for trending calculation)
-- ============================================
CREATE TABLE company_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash TEXT
);

CREATE INDEX idx_company_views_company ON company_views(company_id);
CREATE INDEX idx_company_views_time ON company_views(viewed_at DESC);

-- ============================================
-- COMPUTED VIEWS / MATERIALIZED VIEWS
-- ============================================

CREATE MATERIALIZED VIEW company_trending_scores AS
SELECT
    c.*,
    -- Trending Score Formula:
    -- 0.3 * normalized_funding_recency + 0.25 * normalized_employee_growth +
    -- 0.25 * normalized_news_mentions + 0.2 * normalized_product_upvotes
    (
        0.30 * COALESCE(fr.recency_score, 0) +
        0.25 * COALESCE(eg.growth_score, 0) +
        0.25 * COALESCE(nm.mentions_score, 0) +
        0.20 * COALESCE(pu.upvotes_score, 0)
    ) AS trending_score
FROM companies c
LEFT JOIN (
    SELECT
        company_id,
        CASE
            WHEN max_date IS NULL THEN 0
            ELSE GREATEST(0, 1 - EXTRACT(DAY FROM (NOW() - max_date)) / 365.0)
        END AS recency_score
    FROM (
        SELECT company_id, MAX(date) as max_date
        FROM funding_rounds
        GROUP BY company_id
    ) fr
) fr ON c.id = fr.company_id
LEFT JOIN (
    SELECT
        id AS company_id,
        LEAST(1.0, (employee_count::DECIMAL / 1000.0)) AS growth_score
    FROM companies
    WHERE employee_count IS NOT NULL
) eg ON c.id = eg.company_id
LEFT JOIN (
    SELECT
        unnest(related_company_ids) AS company_id,
        COUNT(*) AS mentions,
        LEAST(1.0, COUNT(*)::DECIMAL / 50.0) AS mentions_score
    FROM news_articles
    WHERE published_at > NOW() - INTERVAL '90 days'
    GROUP BY unnest(related_company_ids)
) nm ON c.id = nm.company_id
LEFT JOIN (
    SELECT
        company_id,
        LEAST(1.0, SUM(upvotes)::DECIMAL / 10000.0) AS upvotes_score
    FROM products
    GROUP BY company_id
) pu ON c.id = pu.company_id;

CREATE UNIQUE INDEX idx_trending_scores_id ON company_trending_scores(id);
CREATE INDEX idx_trending_scores_score ON company_trending_scores(trending_score DESC);

-- Investor activity materialized view (last 90 days)
CREATE MATERIALIZED VIEW investor_activity_90d AS
SELECT
    i.id,
    i.slug,
    i.name,
    i.logo_url,
    i.type,
    COUNT(fr.id) AS deal_count,
    COUNT(fr.id) FILTER (WHERE fr.lead_investor_id = i.id) AS lead_count,
    SUM(fr.amount) AS total_deployed
FROM investors i
LEFT JOIN funding_rounds fr ON fr.lead_investor_id = i.id OR i.id = ANY(fr.co_investors)
WHERE fr.date > (CURRENT_DATE - INTERVAL '90 days')
GROUP BY i.id, i.slug, i.name, i.logo_url, i.type
ORDER BY deal_count DESC;

CREATE UNIQUE INDEX idx_investor_activity_90d_id ON investor_activity_90d(id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_views ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON investors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON funding_rounds FOR SELECT USING (true);
CREATE POLICY "Public read access" ON founders FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (true);

-- Authenticated write policies (will be enforced at API level via API key)
CREATE POLICY "Authenticated write" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON investors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON funding_rounds FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON founders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write" ON news_articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Refresh trending scores
CREATE OR REPLACE FUNCTION refresh_trending_scores()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY company_trending_scores;
    REFRESH MATERIALIZED VIEW CONCURRENTLY investor_activity_90d;
END;
$$;

-- Get company with relations
CREATE OR REPLACE FUNCTION get_company_with_relations(p_slug TEXT)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'company', to_jsonb(c),
        'funding', (
            SELECT jsonb_agg(to_jsonb(fr) ORDER BY fr.date DESC)
            FROM funding_rounds fr
            WHERE fr.company_id = c.id
        ),
        'products', (
            SELECT jsonb_agg(to_jsonb(p) ORDER BY p.upvotes DESC)
            FROM products p
            WHERE p.company_id = c.id
        ),
        'founders', (
            SELECT jsonb_agg(to_jsonb(f))
            FROM founders f
            WHERE f.company_id = c.id
        ),
        'investors', (
            SELECT jsonb_agg(DISTINCT jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'slug', i.slug,
                'logo_url', i.logo_url,
                'type', i.type
            ))
            FROM funding_rounds fr
            JOIN investors i ON i.id = fr.lead_investor_id OR i.id = ANY(fr.co_investors)
            WHERE fr.company_id = c.id
        )
    ) INTO result
    FROM companies c
    WHERE c.slug = p_slug;

    RETURN result;
END;
$$;