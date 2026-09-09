import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { supabase } from './lib/supabase'

const Experience = () => {
    const root = useRef(null)
    const [experiences, setExperiences] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        supabase.from('experience').select('*').order('sort_order').then(({ data }) => {
            setExperiences(data || [])
            setLoaded(true)
        })
    }, [])

    useEffect(() => {
        if (!loaded) return

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: { trigger: root.current, start: 'top 75%', once: true }
            })
            .from('.exp-heading',       { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', immediateRender: false }, 0)
            .from('.exp-line',          { scaleY: 0, duration: 0.8, ease: 'power2.out', transformOrigin: 'top', immediateRender: false }, 0.3)
            .from('.exp-dot',           { opacity: 0, scale: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.3, immediateRender: false }, 0.5)
            .from('.exp-card',          { opacity: 0, x: 24, duration: 0.7, ease: 'power3.out', stagger: 0.2, immediateRender: false }, 0.5)
        }, root)

        return () => ctx.revert()
    }, [loaded])

    return (
        <section ref={root} id="experience" className="relative z-[6] mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 py-24 md:min-h-screen md:px-10 lg:px-16 lg:py-32">

            <p className="exp-heading mb-8 text-[11px] font-mono uppercase tracking-[0.14em] text-ember">03 / Experience</p>
            <h2 className="exp-heading mb-14 max-w-3xl font-syne text-4xl font-semibold tracking-[-0.045em] text-heading sm:text-5xl lg:mb-20 lg:text-6xl">Where I've worked</h2>

            <div className="relative max-w-4xl">
                <div className="exp-line absolute left-[11px] top-3 bottom-3 w-px bg-brand-border" />

                <div className="flex flex-col gap-8">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="flex gap-8 sm:gap-10">
                            <div className="exp-dot relative z-10 flex-shrink-0 w-6 flex justify-center pt-[22px]">
                                <div className="w-[7px] h-[7px] bg-ember ring-4 ring-obsidian" />
                            </div>

                            <div className="exp-card flex-1 relative overflow-hidden border border-brand-border bg-surface p-6 transition-colors duration-300 hover:border-subtle md:p-8">

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                                    <div className="flex items-start gap-3">
                                        {exp.logo_url
                                            ? (
                                                <div className="mt-0.5 w-10 h-10 shrink-0 bg-white/5 border border-brand-border flex items-center justify-center p-1.5 overflow-hidden">
                                                    <img src={exp.logo_url} alt={exp.company} className="w-full h-full object-contain" onError={e => { e.target.parentElement.style.display = 'none' }} />
                                                </div>
                                            ) : (
                                                <div className="mt-0.5 w-10 h-10 shrink-0 bg-surface2 border border-brand-border flex items-center justify-center">
                                                    <span className="text-subtle font-syne font-bold text-sm">{exp.company.charAt(0)}</span>
                                                </div>
                                            )
                                        }
                                        <div>
                                            <h3 className="text-heading font-syne text-lg md:text-xl font-semibold tracking-[-0.02em]">{exp.role}</h3>
                                            <p className="text-subtle text-sm font-dm mt-0.5">{exp.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-0.5 shrink-0 pl-[52px] sm:pl-0">
                                        <span className="text-ember text-[10px] font-mono uppercase tracking-[0.08em]">{exp.period}</span>
                                        <span className="text-muted text-xs font-dm">{exp.location}</span>
                                    </div>
                                </div>

                                <ul className="flex flex-col gap-2.5">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="flex items-start gap-3 text-body text-sm font-dm leading-relaxed">
                                            <span className="mt-2 w-1 h-1 rounded-full bg-ember/60 shrink-0" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience
