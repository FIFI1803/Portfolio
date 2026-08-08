import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const prefersReduced = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(QUERY).matches

/**
 * Tracks the visitor's reduced-motion preference, including later changes.
 *
 * Returns false during server render and first paint so hydration matches the
 * prerendered markup; the effect corrects it immediately after mount.
 */
export const useReducedMotion = () => {
    const [reduced, setReduced] = useState(false)

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return

        const mq = window.matchMedia(QUERY)
        const update = () => setReduced(mq.matches)
        update()

        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    return reduced
}

export { prefersReduced }
