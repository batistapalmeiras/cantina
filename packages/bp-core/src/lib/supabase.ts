// Libs
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
    }

    supabaseInstance = createClient(url, key);
  }

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    return Reflect.get(getSupabase(), prop);
  },
});
