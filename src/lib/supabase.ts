import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Browser Client
 * Use this for client-side operations (uploads, fetching public data)
 */
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server Client
 * Use this for server-side operations requiring elevated permissions (service role).
 * NEVER import this in client components.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
