import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Local-first content.
 *
 * `fallback` renders on the first paint and is replaced only by a non-empty
 * remote result, so a paused, slow or erroring Supabase is invisible to the
 * visitor. `build` shapes the query; default is ordered by sort_order.
 */
export const useContent = (table, fallback, build = (q) => q.order('sort_order')) => {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    let cancelled = false

    build(supabase.from(table).select('*'))
      .then(({ data, error }) => {
        if (cancelled || error) return
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {
        // Offline, paused project, DNS failure — keep the local content.
      })

    return () => { cancelled = true }
  }, [table]) // eslint-disable-line react-hooks/exhaustive-deps

  return items
}

/** The single `site` settings row, merged over the local profile. */
export const useSite = (fallback) => {
  const rows = useContent('site', [fallback], (q) => q.limit(1))
  return { ...fallback, ...rows[0] }
}
