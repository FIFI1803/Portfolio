import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Local-first content.
 *
 * The compiled-in `fallback` renders immediately and is only ever replaced by
 * a non-empty remote result. A paused, slow or erroring Supabase is therefore
 * invisible to the visitor — see spec section 5 (finding F2, where a paused
 * project left Skills, Experience and Projects as empty labelled voids).
 */
export const useContent = (table, fallback) => {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    let cancelled = false

    supabase
      .from(table)
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled || error) return
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {
        // Offline, paused project, DNS failure — keep the local content.
      })

    return () => { cancelled = true }
  }, [table])

  return items
}
