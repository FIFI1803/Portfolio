import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const stats = [
    { num: 3, suffix: '+', label: 'Years experience' },
    { num: 5, suffix: '+', label: 'Projects shipped' },
    { num: 2, suffix: '', label: 'Languages spoken' },
]

const About = () => {
    const root = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top 70%',
                    once: true,
                }
            })

            tl.from('.about-label', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', immediateRender: false }, 0)
                .from('.about-heading', { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', immediateRender: false }, 0.1)
                .from('.about-stat', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', stagger: 0.1, immediateRender: false }, 0.3)
                .from('.about-body', { opacity: 0, y: 25, duration: 0.6, ease: 'power2.out', stagger: 0.12, immediateRender: false }, 0.5)
                .from('.about-cta > *', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.1, immediateRender: false }, 0.8)
                .from('.about-image', { opacity: 0, x: 40, duration: 1.0, ease: 'power3.out', immediateRender: false }, 0.2)

            // Count-up for stats
            gsap.utils.toArray('.about-stat-num').forEach((el) => {
                const target = +el.dataset.target
                const suffix = el.dataset.suffix || ''
                const obj = { val: 0 }
                gsap.to(obj, {
                    val: target,
                    duration: 1.6,
                    ease: 'power2.out',
                    delay: 0.5,
                    onUpdate: () => { el.textContent = Math.ceil(obj.val) + suffix },
                    scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
                })
            })
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} id="about" className="relative z-[6] mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 py-24 md:min-h-screen md:px-10 lg:px-16 lg:py-32">

            {/* Label */}
            <p className="about-label mb-8 text-[11px] font-mono uppercase tracking-[0.14em] text-ember">01 / About</p>

            {/* Main grid */}
            <div className="flex flex-col gap-14 lg:flex-row lg:gap-24 lg:items-start">

                {/* Left: heading + stats + body + cta */}
                <div className="flex w-full flex-col gap-9 lg:max-w-3xl">
                    <h2 className="about-heading max-w-2xl font-syne text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-heading sm:text-5xl lg:text-6xl">
                        Building enterprise software{' '}
                        <span className="text-ember">from Dublin</span>
                    </h2>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 border-y border-brand-border">
                        {stats.map((s) => (
                            <div key={s.label} className="about-stat flex flex-col gap-2 border-r border-brand-border px-3 py-5 first:pl-0 last:border-r-0 sm:px-8 sm:py-6 sm:first:pl-0">
                                <span
                                    className="about-stat-num font-syne text-3xl font-semibold tracking-[-0.04em] text-heading sm:text-4xl"
                                    data-target={s.num}
                                    data-suffix={s.suffix}
                                >
                                    0{s.suffix}
                                </span>
                                <span className="text-muted text-[10px] font-mono uppercase tracking-[0.08em] leading-relaxed">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Body text */}
                    <div className="flex flex-col gap-4">
                        <p className="about-body text-body text-[15px] font-dm leading-7">
                            I'm Filip — a Software Developer at SAP Ireland on the Software Asset Management team. I build internal Fiori applications using SAP UI5, JavaScript, and OData, currently leading front-end development for the Publisher 360 Dashboard. Across three major projects, I've shipped features ranging from a 79-case UAT plan for a Forecasting app to a custom Variable Management system that replaced rigid static filters with a flexible, user-driven solution.
                        </p>
                        <p className="about-body text-body text-[15px] font-dm leading-7">
                            I'm currently completing a Level 6 ICT Apprenticeship (2024–2026), balancing academic study with daily enterprise development. Before the pivot to tech, I spent two years as a Duty Manager at SSP leading a team of 10 — a leadership background I now bring to my code. I made the switch through self-study and IBM SkillsBuild certifications.
                        </p>
                        <p className="about-body text-body text-[15px] font-dm leading-7">
                            Outside the office, I run a Proxmox homelab and build side projects with React and Tailwind. When I'm not at the terminal, you'll find me at the gym or out for a run.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="about-cta flex flex-wrap gap-4">
                        <a href="#contact" className="rounded-[3px] bg-heading px-6 py-3 text-xs font-syne font-semibold uppercase tracking-[0.06em] text-obsidian transition-colors hover:bg-ember">
                            Get in touch
                        </a>
                        <a href="#projects" className="rounded-[3px] border border-brand-border px-6 py-3 text-xs font-syne font-medium uppercase tracking-[0.06em] text-body transition-colors hover:border-subtle hover:text-heading">
                            See my projects
                        </a>
                    </div>
                </div>

                {/* Right: image */}
                <div className="about-image w-full max-w-sm mx-auto lg:mx-0 lg:mt-20 lg:w-[320px] xl:w-[380px] shrink-0">
                    <div className="relative border border-brand-border bg-surface p-2">
                        <div className="relative overflow-hidden">
                            <img
                                src="/JPEG image.png"
                                alt="Filip Galach"
                                className="w-full aspect-[3/4] object-cover object-top grayscale contrast-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                        <div className="flex items-center justify-between px-1 pb-1 pt-3 text-[9px] font-mono uppercase tracking-[0.12em] text-muted">
                            <span>Portrait / 2026</span>
                            <span>Dublin, IE</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
