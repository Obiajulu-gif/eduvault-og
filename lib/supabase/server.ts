import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getClientEnv, getServerEnv } from "@/lib/env";

export function getSupabaseServiceClient() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();

  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
