// Libs
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// Local
import type { Database } from './database.types';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
    }

    supabaseInstance = createClient<Database>(url, key);
  }

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get: (_, prop) => {
    return Reflect.get(getSupabase(), prop);
  },
});
