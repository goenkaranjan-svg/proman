/**
 * Browser Supabase client for Client Components.
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *
 * For Server Components, Route Handlers, or Server Actions, use:
 *   import { createClient, getSession } from '@/lib/supabase/server'
 */
export { createClient } from './supabase/client';
