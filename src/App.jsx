import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Marquee from './components/Marquee'
import Cursor from './components/Cursor'
import { useReducedMotion } from './hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// Scramble a text element through random chars before resolving
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const scramble = (el) => {
    const original = el.textContent
    const total = 24
    let frame = 0
    // setTimeout instead of rAF — rAF pauses when tab is hidden, leaving text stuck
    const tick = () => {
        el.textContent = original
            .split('')
            .map((ch, i) => {
                if (ch === ' ' || ch === '&') return ch
                if (frame / total > i / original.length * 0.85) return ch
                return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        frame++
        if (frame <= total) setTimeout(tick, 16)
        else el.textContent = original
    }
    tick()
}

const App = () => {
    const glowRef = useRef(null)
    const reducedMotion = useReducedMotion()

    // Global motion kill-switch.
    //
    // Every section builds its own GSAP timeline, so rather than thread a flag
    // through all of them, run the global timeline fast enough that tweens
    // resolve to their end state within a frame. Sections keep their final
    // layout; nothing visibly moves. Phase 4 replaces this with per-animation
    // gsap.matchMedia() once the motion pass rebuilds them properly.
    useEffect(() => {
        gsap.globalTimeline.timeScale(reducedMotion ? 1000 : 1)
    }, [reducedMotion])

    // Ambient glow that drifts with scroll — purely decorative, so it is
    // skipped outright rather than sped up when motion is reduced.
    useEffect(() => {
        if (reducedMotion) return
        const glow = glowRef.current

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2.5,
            },
        })
        scrollTl
            .to(glow, { '--gx': '30%', '--gy': '55%', ease: 'none', duration: 1 })  // About
            .to(glow, { '--gx': '68%', '--gy': '65%', ease: 'none', duration: 1 })  // Skills
            .to(glow, { '--gx': '70%', '--gy': '35%', ease: 'none', duration: 1 })  // Experience
            .to(glow, { '--gx': '42%', '--gy': '28%', ease: 'none', duration: 1 })  // Projects
            .to(glow, { '--gx': '55%', '--gy': '68%', ease: 'none', duration: 1 })  // Contact

        const floatX = gsap.to(glow, { x: 40, duration: 6,   ease: 'sine.inOut', repeat: -1, yoyo: true })
        const floatY = gsap.to(glow, { y: 30, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true })

        return () => { scrollTl.kill(); floatX.kill(); floatY.kill() }
    }, [reducedMotion])

    // Scramble-in on section headings
    useEffect(() => {
        if (reducedMotion) return

        const headings = document.querySelectorAll('section h2')
        const triggers = []
        const timers = []

        headings.forEach((el) => {
            // Skip headings that contain child elements (spans, br, etc.)
            // — setting textContent on those would destroy them
            if (el.children.length > 0) return

            const st = ScrollTrigger.create({
                trigger: el,
                start: 'top 82%',
                once: true,
                onEnter: () => timers.push(setTimeout(() => scramble(el), 250)),
            })
            triggers.push(st)
        })

        return () => {
            triggers.forEach((t) => t.kill())
            timers.forEach(clearTimeout)
        }
    }, [reducedMotion])

    return (
        <>
            <Cursor />
            <a
                href="#about"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[400] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ember focus:text-obsidian focus:font-syne focus:font-semibold focus:text-sm"
            >
                Skip to content
            </a>
            <div className="flex flex-col bg-obsidian overflow-x-clip">
                {/* Floating ember glow */}
                <div
                    ref={glowRef}
                    aria-hidden="true"
                    className="fixed inset-0 z-[5] pointer-events-none"
                    style={{
                        '--gx': '75%',
                        '--gy': '20%',
                        background: 'radial-gradient(ellipse 48% 48% at var(--gx) var(--gy), rgba(255,92,43,0.11) 0%, transparent 68%)',
                    }}
                />

                <Navigation />
                <main>
                    <Hero />
                    <Marquee />
                    <About />
                    <Marquee reverse />
                    <Skills />
                    <Marquee />
                    <Experience />
                    <Marquee reverse />
                    <Projects />
                    <Marquee />
                    <Contact />
                </main>
            </div>
        </>
    )
}

export default App
