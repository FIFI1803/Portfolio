import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Navigation from './Navigation'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Contact from './Contact'
import Marquee from './Marquee'
import Cursor from './Cursor'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'contact']
const NAV_HEIGHT = 80

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

    // Glow scroll animation
    useEffect(() => {
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
    }, [])

    // Scroll snap assist — snaps to nearest section boundary when user pauses near one
    useEffect(() => {
        // Skip on touch/mobile — native momentum scroll feels better there
        if (window.matchMedia('(pointer: coarse)').matches) return

        let timer = null
        let snapping = false

        const getNearestSnap = () => {
            const viewH = window.innerHeight
            const scrollY = window.scrollY
            const threshold = viewH * 0.28 // snap zone: within 28% of viewport height from a boundary

            let best = null
            let bestDist = Infinity

            SECTION_IDS.forEach((id) => {
                const el = document.getElementById(id)
                if (!el) return
                const target = Math.max(0, el.offsetTop - NAV_HEIGHT)
                const dist = Math.abs(scrollY - target)
                if (dist < bestDist) { bestDist = dist; best = target }
            })

            // Only act if we're within the threshold AND not already there
            if (best !== null && bestDist < threshold && bestDist > 8) return best
            return null
        }

        const onScrollEnd = () => {
            if (snapping) return
            const target = getNearestSnap()
            if (target === null) return
            snapping = true
            gsap.to(window, {
                scrollTo: { y: target, autoKill: true },
                duration: 0.65,
                ease: 'power3.inOut',
                onComplete: () => { snapping = false },
                onInterrupt: () => { snapping = false },
            })
        }

        const onScroll = () => {
            if (snapping) return
            clearTimeout(timer)
            timer = setTimeout(onScrollEnd, 160)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer) }
    }, [])

    // Global scramble on all section h2 headings
    useEffect(() => {
        const headings = document.querySelectorAll('section h2')
        const triggers = []

        headings.forEach((el) => {
            // Skip headings that contain child elements (spans, br, etc.)
            // — setting textContent on those would destroy them
            if (el.children.length > 0) return

            const st = ScrollTrigger.create({
                trigger: el,
                start: 'top 82%',
                once: true,
                onEnter: () => setTimeout(() => scramble(el), 250),
            })
            triggers.push(st)
        })

        return () => triggers.forEach((t) => t.kill())
    }, [])

    return (
        <>
            <Cursor />
            <div className="flex flex-col bg-obsidian overflow-x-clip">
                {/* Floating ember glow */}
                <div
                    ref={glowRef}
                    className="fixed inset-0 z-[5] pointer-events-none"
                    style={{
                        '--gx': '75%',
                        '--gy': '20%',
                        background: 'radial-gradient(ellipse 48% 48% at var(--gx) var(--gy), rgba(255,92,43,0.11) 0%, transparent 68%)',
                    }}
                />

                <Navigation />
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
            </div>
        </>
    )
}

export default App
