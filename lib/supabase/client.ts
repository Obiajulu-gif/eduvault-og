"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getClientEnv, isMockMode, isSupabaseConfigured } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function isSupabaseAuthEnabled() {
  return !isMockMode() && isSupabaseConfigured();
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseAuthEnabled()) return null;
  if (browserClient) return browserClient;

  const env = getClientEnv();
  browserClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return browserClient;
}
