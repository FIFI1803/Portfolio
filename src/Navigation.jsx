import { useState } from 'react'

const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState('#home')

    return (
        <nav className="sticky top-0 z-50 px-6 md:px-16 py-4 md:py-6">
            <div className="flex items-center justify-between">
                {/* Desktop pill nav */}
                <div className="hidden md:flex px-2 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full items-center gap-2">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setActive(link.href)}
                            className={`px-5 py-2 rounded-full transition-colors text-sm ${
                                active === link.href
                                    ? 'bg-white text-gray-900 font-medium'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Mobile: logo/name */}
                <span className="md:hidden text-white font-semibold text-sm">Filip Galach</span>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 md:px-6 md:py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transition-colors text-sm">
                        Download CV
                    </button>

                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            <div className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={() => { setOpen(false); setActive(link.href) }}
                        className={`px-6 py-3.5 text-sm transition-colors ${active === link.href ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    )
}

export default Navigation
