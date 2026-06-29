import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let supabaseAdmin: SupabaseClient | null = null;
let supabasePublic: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
};

export const getSupabasePublic = (): SupabaseClient => {
  if (!supabasePublic) {
    supabasePublic = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return supabasePublic;
};

export const supabaseAdminClient = getSupabaseAdmin();
export const supabasePublicClient = getSupabasePublic();