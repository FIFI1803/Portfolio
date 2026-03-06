import { useState, useEffect } from 'react'

const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState('#home')

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const detectionPoint = scrollY + window.innerHeight * 0.4

            let current = links[0].href
            for (const { href } of links) {
                const el = document.getElementById(href.slice(1))
                if (el && el.offsetTop <= detectionPoint) {
                    current = href
                }
            }
            setActive(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = (href) => {
        setActive(href)
        setOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 px-6 md:px-16 py-4 md:py-6">
            <div className="flex items-center justify-between">
                {/* Desktop pill nav */}
                <div className="hidden md:flex px-2 py-2 backdrop-blur-md bg-white/5 border border-brand-border rounded-full items-center gap-2">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => handleLinkClick(link.href)}
                            className={`px-5 py-2 rounded-full transition-colors text-sm font-syne font-medium ${
                                active === link.href
                                    ? 'bg-white text-obsidian font-semibold'
                                    : 'text-subtle hover:text-heading'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Mobile: logo/name */}
                <span className="md:hidden text-heading font-syne font-semibold text-sm">Filip Galach</span>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 md:px-6 md:py-3 bg-ember text-obsidian font-syne font-semibold rounded-full hover:bg-ember-dim transition-colors text-sm">
                        Download CV
                    </button>

                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-heading transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-heading transition-all ${open ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-heading transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            <div className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl backdrop-blur-md bg-white/5 border border-brand-border flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`px-6 py-3.5 text-sm font-syne transition-colors ${active === link.href ? 'text-heading font-semibold' : 'text-subtle hover:text-heading'}`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    )
}

export default Navigation
