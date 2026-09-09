import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Hero = () => {
    const root = useRef(null)
    const imageRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.from('.hero-badge',      { opacity: 0, x: -20, duration: 0.6 }, 0.3)
              .from('.hero-role',       { opacity: 0, y: 30,  duration: 0.7 }, 0.5)
              .from('.hero-name-line',  { opacity: 0, y: 60,  duration: 0.8, stagger: 0.12 }, 0.6)
              .from('.hero-contact > *',{ opacity: 0, y: 20,  duration: 0.5, stagger: 0.1 }, 1.0)
              .from('.hero-image',      { opacity: 0, scale: 1.04, duration: 1.0 }, 0.4)
              .from('.hero-scroll',     { opacity: 0, y: 10, duration: 0.5 }, 1.4)
        }, root)

        const handleScroll = () => {
            const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.5))
            if (imageRef.current) imageRef.current.style.opacity = opacity
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            ctx.revert()
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div ref={root} id="home" className="relative min-h-[calc(100svh-4rem)] w-full overflow-hidden md:min-h-[calc(100svh-4.5rem)]">

            {/* Image — full width on mobile (faded), side panel on desktop */}
            <div ref={imageRef} className="absolute inset-y-0 right-0 w-full md:w-[48%] lg:w-[43%] z-[2]">
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/10 md:from-obsidian md:via-obsidian/20 md:to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-10" />
                <img
                    src="/HeroImage.png"
                    alt="Filip Galach"
                    className="hero-image w-full h-full object-cover object-top opacity-55 md:object-contain md:opacity-100"
                />
            </div>

            {/* Text content */}
            <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] items-end px-6 pb-14 pt-24 md:min-h-[calc(100svh-4.5rem)] md:px-10 md:pb-16 lg:px-16">
                <div className="flex max-w-4xl flex-col gap-7">

                    <div className="hero-badge flex items-center gap-3 w-fit font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Available for select opportunities
                    </div>

                    <div>
                        <p className="hero-role mb-4 text-ember text-xs md:text-sm font-mono tracking-[0.14em] uppercase">Software Developer / Dublin</p>
                        <h1 className="font-syne text-[clamp(4rem,12vw,10rem)] font-semibold tracking-[-0.07em] text-heading" style={{ lineHeight: '0.78' }}>
                            <span className="hero-name-line block">Filip</span>
                            <span className="hero-name-line block">Galach</span>
                        </h1>
                    </div>

                    <div className="hero-contact flex flex-col items-start gap-6 border-t border-brand-border pt-5 sm:flex-row sm:items-center sm:gap-8">
                        <p className="max-w-md text-sm leading-relaxed text-body md:text-base">
                            Building thoughtful enterprise products and modern web experiences with clarity, reliability, and purpose.
                        </p>
                        <div className="flex shrink-0 items-center gap-5 font-mono text-[11px] uppercase tracking-[0.08em]">
                            <a href="#projects" className="text-heading transition-colors hover:text-ember">View work ↘</a>
                            <a href="mailto:filipgalach@gmail.com" className="text-subtle transition-colors hover:text-heading">Email me ↗</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-scroll absolute bottom-5 right-6 z-20 hidden items-center gap-3 text-[10px] font-mono uppercase tracking-[0.16em] text-muted md:flex md:right-10 lg:right-16">
                Scroll to explore
                <span className="h-px w-10 bg-brand-border" />
            </div>
        </div>
    )
}

export default Hero
