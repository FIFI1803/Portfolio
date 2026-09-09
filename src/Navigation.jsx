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
        <nav className="sticky top-0 z-50 border-b border-brand-border/80 bg-obsidian/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:h-[72px] md:px-10 lg:px-16">
                <a href="#home" onClick={() => handleLinkClick('#home')} className="hidden md:flex items-center gap-3 text-heading font-syne font-semibold text-sm tracking-tight">
                    <span className="flex h-7 w-7 items-center justify-center border border-brand-border bg-surface text-[10px] font-mono text-ember">FG</span>
                    Filip Galach
                </a>

                <div className="hidden md:flex items-center gap-7">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => handleLinkClick(link.href)}
                            className={`relative py-2 transition-colors text-xs font-mono uppercase tracking-[0.08em] ${
                                active === link.href
                                    ? 'text-heading after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-ember'
                                    : 'text-subtle hover:text-heading'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <a href="#home" onClick={() => handleLinkClick('#home')} className="md:hidden text-heading font-syne font-semibold text-sm">Filip Galach</a>

                <div className="flex items-center gap-3">
                    <a
                        href="/Filip_Galach_Resume.pdf"
                        download="Filip_Galach_CV.pdf"
                        className="px-4 py-2.5 md:px-5 md:py-3 bg-heading text-obsidian font-syne font-semibold rounded-[3px] hover:bg-ember transition-colors text-xs uppercase tracking-[0.06em]"
                    >
                        Download CV
                    </a>

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
            <div className={`md:hidden absolute top-full left-4 right-4 mt-2 bg-void border border-brand-border flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`px-6 py-3.5 border-b border-brand-border/60 text-xs font-mono uppercase tracking-[0.08em] transition-colors ${active === link.href ? 'text-ember' : 'text-subtle hover:text-heading'}`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    )
}

export default Navigation
