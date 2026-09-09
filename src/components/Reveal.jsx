import { useEffect, useRef, useState } from 'react'

const FALLBACK_MS = 2500

/**
 * Reveals children once they enter the viewport.
 *
 * Three layered guarantees, so no single failure can blank the page (spec 3.5):
 *   1. The hidden state is applied here in JS — CSS never hides on its own.
 *   2. No IntersectionObserver, or reduced motion, means visible immediately.
 *   3. A 2.5s timer reveals regardless, cleared when the observer fires.
 *
 * This is the only component permitted to hide content.
 */
const Reveal = ({ children, as: Tag = 'div', delay = 0, className = '' }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!node || typeof IntersectionObserver === 'undefined' || reduced) {
      setShown(true)
      return
    }

    const timer = setTimeout(() => setShown(true), FALLBACK_MS)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        clearTimeout(timer)
        setShown(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(node)

    return () => { clearTimeout(timer); io.disconnect() }
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'in' : 'out'}
      style={delay && !shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}

export default Reveal
