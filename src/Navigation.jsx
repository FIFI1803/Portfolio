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
            {open && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 flex flex-col py-4">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    )
}

export default Navigation
