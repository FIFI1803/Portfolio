import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Hero = () => {
    const root = useRef(null)
    const imageRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.from('.hero-badge', { opacity: 0, x: -20, duration: 0.6 }, 0.3)
                .from('.hero-role', { opacity: 0, y: 30, duration: 0.7 }, 0.5)
                .from('.hero-name-line', { opacity: 0, y: 60, duration: 0.8, stagger: 0.12 }, 0.6)
                .from('.hero-contact > *', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, 1.0)
                .from('.hero-image', { opacity: 0, scale: 1.04, duration: 1.0 }, 0.4)
        }, root)

        const handleScroll = () => {
            const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.4))
            if (imageRef.current) imageRef.current.style.opacity = opacity
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            ctx.revert()
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div ref={root} id="home" className="relative min-h-screen w-full overflow-hidden">
            {/* Image pinned to right */}
            <div ref={imageRef} className="absolute inset-y-0 right-0 w-1/2 lg:w-2/5">
                <img
                    src="/HeroImage.png"
                    alt="Filip Galach"
                    className="hero-image w-full h-full object-contain object-top"
                />
            </div>

            {/* Text overlay */}
            <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-16 lg:px-24 max-w-2xl gap-6">
                <div className="hero-badge flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-subtle text-sm font-dm">Open to work</span>
                </div>

                <div>
                    <p className="hero-role text-ember text-lg md:text-xl font-syne font-medium mb-2">Software Developer</p>
                    <h1 className="font-syne text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-heading leading-tight">
                        <span className="hero-name-line block">Filip</span>
                        <span className="hero-name-line block">Galach</span>
                    </h1>
                </div>

                <div className="hero-contact flex flex-wrap gap-x-6 gap-y-3 mt-2">
                    <span className="flex items-center gap-2 text-subtle text-sm font-dm">
                        <svg className="w-4 h-4 shrink-0 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        filip.galach@gmail.com
                    </span>
                    <span className="flex items-center gap-2 text-subtle text-sm font-dm">
                        <svg className="w-4 h-4 shrink-0 text-ember" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        linkedin.com/in/filip-galach
                    </span>
                    <span className="flex items-center gap-2 text-subtle text-sm font-dm">
                        <svg className="w-4 h-4 shrink-0 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Dublin, Ireland
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Hero
