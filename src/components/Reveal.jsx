import { useEffect, useRef, useState } from 'react'

const FALLBACK_MS = 2500

/** True when this browser can't (or shouldn't) animate a reveal. */
const revealDisabled = () =>
  typeof IntersectionObserver === 'undefined' ||
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/**
 * Reveals children once they enter the viewport.
 *
 * Three layered guarantees, so no single failure can blank the page (spec 3.5):
 *   1. The hidden state is applied here in JS — CSS never hides on its own.
 *   2. No IntersectionObserver, or reduced motion, starts visible.
 *   3. A 2.5s timer reveals regardless, cleared when the observer fires.
 *
 * This is the only component permitted to hide content.
 */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null)
  // Computed lazily rather than set in the effect, so the unsupported and
  // reduced-motion paths never render a hidden frame at all.
  const [shown, setShown] = useState(revealDisabled)

  useEffect(() => {
    const node = ref.current
    if (!node || revealDisabled()) return

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
    <div
      ref={ref}
      data-reveal={shown ? 'in' : 'out'}
      style={delay && !shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  )
}

export default Reveal
