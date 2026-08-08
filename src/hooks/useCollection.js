import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import content from '../data/content.json'

/**
 * Reads a CMS collection, preferring the build-time snapshot.
 *
 * The snapshot (src/data/content.json, refreshed by `npm run sync:content`) is
 * the primary source: it is present in the first paint and in the prerendered
 * HTML, so there is nothing to wait for and nothing for a crawler to miss.
 *
 * The client fetch only runs when the snapshot is empty for this table, which
 * happens on a fresh clone that has never synced. That keeps the site working
 * in that state instead of rendering blank sections.
 *
 * @returns {{ rows: object[], status: 'ready'|'loading'|'error' }}
 */
export const useCollection = (table, orderBy = 'sort_order') => {
    const snapshot = content[table] ?? []
    const hasSnapshot = snapshot.length > 0

    const [rows, setRows] = useState(snapshot)
    // Resolved up front rather than in the effect — a synchronous setState
    // inside an effect cascades an extra render.
    const [status, setStatus] = useState(
        hasSnapshot ? 'ready' : supabase ? 'loading' : 'error'
    )

    useEffect(() => {
        if (hasSnapshot || !supabase) return

        let cancelled = false

        supabase
            .from(table)
            .select('*')
            .order(orderBy)
            .then(({ data, error }) => {
                if (cancelled) return
                if (error) {
                    console.error(`[content] Could not load "${table}":`, error.message)
                    setStatus('error')
                    return
                }
                setRows(data ?? [])
                setStatus('ready')
            })

        return () => { cancelled = true }
    }, [table, orderBy, hasSnapshot])

    return { rows, status }
}
