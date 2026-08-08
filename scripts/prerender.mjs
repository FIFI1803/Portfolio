/**
 * Bakes the home page into dist/index.html after the client build.
 *
 * Without this the deployed HTML is an empty <div id="root">, so crawlers and
 * link scrapers see a page with no experience, projects or skills. Rendering
 * the tree once at build time puts the real content in the markup; the client
 * then hydrates it (see src/main.jsx).
 *
 * Runs as part of `npm run build`.
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import { resolveSiteUrl } from './site.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HTML = resolve(root, 'dist/index.html')
const SSR_DIR = resolve(root, 'dist-ssr')
const ROOT_DIV = '<div id="root"></div>'

/** robots.txt and sitemap.xml need the absolute origin, so they are emitted
 *  here rather than sitting in public/ with a hardcoded domain. */
const writeCrawlerFiles = (siteUrl) => {
    writeFileSync(resolve(root, 'dist/robots.txt'), [
        'User-agent: *',
        'Allow: /',
        // The admin panel is behind Supabase auth, but there is no reason to
        // spend crawl budget on it or surface it in results.
        'Disallow: /admin',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
    ].join('\n'))

    const today = new Date().toISOString().slice(0, 10)
    writeFileSync(resolve(root, 'dist/sitemap.xml'), [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        `    <loc>${siteUrl}/</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '</urlset>',
        '',
    ].join('\n'))
}

const main = async () => {
    if (!existsSync(HTML)) {
        throw new Error('dist/index.html is missing — run `vite build` first.')
    }

    // Compile the server entry so JSX and CSS imports resolve under Node.
    await build({
        root,
        logLevel: 'warn',
        build: {
            ssr: resolve(root, 'src/entry-server.jsx'),
            outDir: 'dist-ssr',
            emptyOutDir: true,
        },
    })

    const { render } = await import(pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href)
    const appHtml = render()

    const html = readFileSync(HTML, 'utf8')
    if (!html.includes(ROOT_DIV)) {
        throw new Error(`Could not find ${ROOT_DIV} in dist/index.html — prerender target changed.`)
    }

    writeFileSync(HTML, html.replace(ROOT_DIV, `<div id="root">${appHtml}</div>`))
    rmSync(SSR_DIR, { recursive: true, force: true })

    const siteUrl = resolveSiteUrl('production', root)
    writeCrawlerFiles(siteUrl)

    const kb = (Buffer.byteLength(appHtml) / 1024).toFixed(1)
    console.log(`[prerender] Baked ${kb} kB of markup into dist/index.html.`)
    console.log(`[prerender] Wrote robots.txt and sitemap.xml for ${siteUrl}.`)
}

main().catch((err) => {
    console.error(`[prerender] Failed — ${err.message}`)
    rmSync(SSR_DIR, { recursive: true, force: true })
    process.exit(1)
})
