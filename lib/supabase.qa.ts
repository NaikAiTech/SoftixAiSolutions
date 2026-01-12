import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let qaAnonClient: SupabaseClient | null = null;

export function getSupabaseQAAnon(): SupabaseClient {
  if (qaAnonClient) return qaAnonClient;
  const url = process.env.SUPABASE_QA_URL;
  const key = process.env.SUPABASE_QA_ANON_KEY;
  if (!url || !key) throw new Error("Supabase QA not configured");
  qaAnonClient = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input: any, init?: any) => {
        const opts: any = { ...(init || {}), cache: 'no-store' };
        return fetch(input as any, opts);
      },
    },
  } as any);
  return qaAnonClient;
}
