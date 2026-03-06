import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Cursor = () => {
    const dotRef  = useRef(null)
    const ringRef = useRef(null)

    useEffect(() => {
        // Only on fine-pointer devices (mouse / trackpad)
        if (window.matchMedia('(pointer: coarse)').matches) return

        const dot  = dotRef.current
        const ring = ringRef.current

        // Start hidden — reveal on first move
        gsap.set([dot, ring], { autoAlpha: 0, xPercent: -50, yPercent: -50 })
        document.documentElement.style.cursor = 'none'

        const xDot  = gsap.quickTo(dot,  'x', { duration: 0.06 })
        const yDot  = gsap.quickTo(dot,  'y', { duration: 0.06 })
        const xRing = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' })
        const yRing = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' })

        let revealed = false

        const onMove = (e) => {
            if (!revealed) {
                gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
                revealed = true
            }
            xDot(e.clientX);  yDot(e.clientY)
            xRing(e.clientX); yRing(e.clientY)
        }

        const onEnter = () => {
            gsap.to(ring, { scale: 1.7, borderColor: 'rgba(255,92,43,0.9)', duration: 0.3, ease: 'power2.out' })
            gsap.to(dot,  { scale: 0,   duration: 0.25 })
        }
        const onLeave = () => {
            gsap.to(ring, { scale: 1,   borderColor: 'rgba(255,92,43,0.45)', duration: 0.4, ease: 'power2.out' })
            gsap.to(dot,  { scale: 1,   duration: 0.3 })
        }

        window.addEventListener('mousemove', onMove)

        // Attach hover to all interactive elements that exist now and after DOM updates
        const attach = () => {
            document.querySelectorAll('a, button').forEach(el => {
                if (el._cursorBound) return
                el._cursorBound = true
                el.style.cursor = 'none'
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mouseleave', onLeave)
            })
        }
        attach()
        const observer = new MutationObserver(attach)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            document.documentElement.style.cursor = ''
            window.removeEventListener('mousemove', onMove)
            observer.disconnect()
            document.querySelectorAll('a, button').forEach(el => {
                el._cursorBound = false
                el.style.cursor = ''
                el.removeEventListener('mouseenter', onEnter)
                el.removeEventListener('mouseleave', onLeave)
            })
        }
    }, [])

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[300] pointer-events-none"
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5C2B' }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 z-[300] pointer-events-none"
                style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid rgba(255,92,43,0.45)' }}
            />
        </>
    )
}

export default Cursor
