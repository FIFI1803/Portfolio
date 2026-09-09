import { useEffect, useRef, useState } from 'react'
import { profile } from './content'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'SAP', href: '#sap' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

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
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6 md:px-10 lg:px-14">
        <a href="#top" className="font-display text-[22px] text-ink">Filip Galach</a>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href}
               className="text-[15px] text-ink-2 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href={profile.cv} download
             className="border border-ink px-4 py-2 text-[14px] text-ink transition-colors hover:bg-ink hover:text-paper">
            CV
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="text-[15px] text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-rule bg-paper md:hidden">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}
             className="block border-b border-rule px-6 py-4 text-ink-2">
            {l.label}
          </a>
        ))}
        <a href={profile.cv} download className="block px-6 py-4 text-ink">Download CV</a>
      </div>
    </header>
  )
}

export default Navigation
