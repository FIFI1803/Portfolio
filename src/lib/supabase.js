import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Whether the deploy has Supabase credentials.
 *
 * Site content ships as a static snapshot (src/data/content.json), so the
 * public page renders fine without them — only the contact form, the admin
 * panel, and the empty-snapshot fallback fetch actually need a client.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
    console.warn(
        '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
        'Static content still renders; the contact form and /admin are disabled. ' +
        'Copy .env.example to .env to enable them.'
    )
}

// Null rather than a half-built client: createClient throws on undefined
// credentials, which would take the whole page down instead of just the
// features that need it. Call sites guard on this being null.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
