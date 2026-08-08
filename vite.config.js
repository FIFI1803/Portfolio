import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveSiteUrl } from './scripts/site.mjs'

/**
 * Replaces %VITE_SITE_URL% in index.html.
 *
 * Vite only substitutes env placeholders that are actually defined, so an
 * unset variable would ship the literal token into the meta tags. This applies
 * the resolved value (or its fallback) instead.
 */
const siteUrl = (url) => ({
    name: 'inject-site-url',
    transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replaceAll('%VITE_SITE_URL%', url),
    },
})

export default defineConfig(({ mode }) => ({
    plugins: [react(), tailwindcss(), siteUrl(resolveSiteUrl(mode, process.cwd()))],
}))
