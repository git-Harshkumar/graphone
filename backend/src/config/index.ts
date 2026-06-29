import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  apiKey: process.env.API_KEY || 'dev-api-key-change-in-production',

  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};

export const validateConfig = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};