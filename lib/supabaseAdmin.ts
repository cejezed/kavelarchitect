import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Note: This client should ONLY be used in server-side API routes
// It uses the SERVICE_ROLE_KEY which has admin privileges (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-service-role-key';

if (typeof window === 'undefined' && (!supabaseUrl || !supabaseServiceKey)) {
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    }
}

// Only create the real client server-side; on client the key is unavailable
export const supabaseAdmin: SupabaseClient =
    typeof window === 'undefined'
        ? createClient(supabaseUrl || fallbackUrl, supabaseServiceKey || fallbackKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })
        : (null as unknown as SupabaseClient);
