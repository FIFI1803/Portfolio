import { loadEnv } from 'vite'

/**
 * Production origin, shared by vite.config.js (meta tags) and
 * scripts/prerender.mjs (robots.txt, sitemap.xml) so the two cannot drift.
 *
 * Set VITE_SITE_URL once the real domain is live — canonical, Open Graph and
 * sitemap URLs must be absolute, so this fallback is only a safe default.
 */
export const DEFAULT_SITE_URL = 'https://filipgalach.com'

export const resolveSiteUrl = (mode, root) => {
    const env = loadEnv(mode, root, '')
    return (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
}
