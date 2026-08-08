/**
 * Pulls CMS content out of Supabase at build time into src/data/content.json.
 *
 * The site imports that snapshot directly, so the shipped HTML contains real
 * experience, projects and skills instead of an empty div waiting on three
 * client-side round-trips. Crawlers and social scrapers see the content, and
 * first paint costs zero requests.
 *
 * Run it whenever content changes:
 *   npm run sync:content
 *
 * The snapshot is committed, so builds are reproducible and a Supabase outage
 * at build time cannot empty the site. Missing credentials are a warning, not
 * an error — the previous snapshot simply stays in place.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'src/data/content.json')

// Table -> column it should be ordered by.
const TABLES = {
    projects: 'sort_order',
    skills: 'sort_order',
    education: 'sort_order',
    experience: 'sort_order',
}

const empty = () => ({
    generatedAt: null,
    ...Object.fromEntries(Object.keys(TABLES).map(t => [t, []])),
})

const readExisting = () => {
    if (!existsSync(OUT)) return empty()
    try {
        return JSON.parse(readFileSync(OUT, 'utf8'))
    } catch {
        return empty()
    }
}

const write = (content) => {
    writeFileSync(OUT, JSON.stringify(content, null, 2) + '\n')
}

const counts = (content) =>
    Object.keys(TABLES).map(t => `${content[t]?.length ?? 0} ${t}`).join(', ')

const main = async () => {
    const env = loadEnv('production', root, '')
    const url = env.VITE_SUPABASE_URL
    const anonKey = env.VITE_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
        const existing = readExisting()
        console.warn(
            '[content] No Supabase credentials found — keeping the existing snapshot ' +
            `(${counts(existing)}).\n` +
            '[content] Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to refresh it.'
        )
        // Make sure the file exists so imports resolve on a fresh clone.
        if (!existsSync(OUT)) write(existing)
        return
    }

    const supabase = createClient(url, anonKey)

    const results = await Promise.all(
        Object.entries(TABLES).map(async ([table, orderBy]) => {
            const { data, error } = await supabase.from(table).select('*').order(orderBy)
            if (error) throw new Error(`${table}: ${error.message}`)
            return [table, data ?? []]
        })
    )

    const content = {
        generatedAt: new Date().toISOString(),
        ...Object.fromEntries(results),
    }

    write(content)
    console.log(`[content] Snapshot written: ${counts(content)}.`)
}

main().catch((err) => {
    // A failed refresh must not ship an empty site: keep the committed
    // snapshot and fail loudly so CI surfaces the problem.
    console.error(`[content] Failed to refresh snapshot — ${err.message}`)
    console.error('[content] The committed snapshot is unchanged.')
    process.exit(1)
})
