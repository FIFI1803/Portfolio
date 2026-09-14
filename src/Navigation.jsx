import { useEffect, useRef, useState } from 'react'
import { useSite } from './lib/useContent'
import { site as localSite } from './content'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Now', href: '#now' },
  { label: 'Notes', href: '#notes' },
]

const Navigation = () => {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const site = useSite(localSite)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper px-gutter">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1600px] items-center justify-between">
        <a href="#top" className="display text-[17px] tracking-[-0.02em] text-ink">
          FG<span className="text-accent">.</span>
        </a>

        <ul className="meta hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link decoration-transparent text-ink hover:decoration-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="meta hidden text-ink-2 md:block">{site.location_short}</p>

        <button
          ref={toggleRef}
          type="button"
          className="meta -mr-2 px-2 py-3 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="-mx-gutter border-t border-rule bg-paper md:hidden">
        <ul>
          {links.map((l) => (
            <li key={l.href} className="border-b border-rule">
              <a href={l.href} onClick={() => setOpen(false)}
                 className="display block px-gutter py-5 text-[2.25rem] text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="meta px-gutter py-5 text-ink-2">{site.location_short}</p>
      </div>
    </header>
  )
}

export default Navigation
