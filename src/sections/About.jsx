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
        <section ref={root} id="about" className="relative z-[6] px-6 md:px-8 py-16 md:min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full flex flex-col">

            {/* Label */}
            <p className="about-label text-ember text-sm font-syne font-medium tracking-widest uppercase mb-4">About Me</p>

            {/* Main grid */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                {/* Left: heading + stats + body + cta */}
                <div className="flex flex-col gap-8 w-full lg:max-w-xl">
                    <h2 className="about-heading font-syne text-4xl sm:text-5xl lg:text-6xl font-bold text-heading leading-[1.0]">
                        Building enterprise software{' '}
                        <span className="text-ember">from Dublin</span>
                    </h2>

                    {/* Stats row */}
                    <div className="flex gap-8 sm:gap-12">
                        {stats.map((s) => (
                            <div key={s.label} className="about-stat flex flex-col gap-1">
                                <span
                                    className="about-stat-num font-syne text-3xl sm:text-4xl font-bold text-ember"
                                    data-target={s.num}
                                    data-suffix={s.suffix}
                                >
                                    0{s.suffix}
                                </span>
                                <span className="text-muted text-xs font-dm uppercase tracking-wider">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Body text */}
                    <div className="flex flex-col gap-4">
                        <p className="about-body text-body text-base font-dm leading-relaxed">
                            I'm Filip — a Software Developer at SAP Ireland on the Software Asset Management team. I build internal Fiori applications using SAP UI5, JavaScript, and OData, currently leading front-end development for the Publisher 360 Dashboard. Across three major projects, I've shipped features ranging from a 79-case UAT plan for a Forecasting app to a custom Variable Management system that replaced rigid static filters with a flexible, user-driven solution.
                        </p>
                        <p className="about-body text-body text-base font-dm leading-relaxed">
                            I'm currently completing a Level 6 ICT Apprenticeship (2024–2026), balancing academic study with daily enterprise development. Before the pivot to tech, I spent two years as a Duty Manager at SSP leading a team of 10 — a leadership background I now bring to my code. I made the switch through self-study and IBM SkillsBuild certifications.
                        </p>
                        <p className="about-body text-body text-base font-dm leading-relaxed">
                            Outside the office, I run a Proxmox homelab and build side projects with React and Tailwind. When I'm not at the terminal, you'll find me at the gym or out for a run.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="about-cta flex flex-wrap gap-4">
                        <a href="#contact" className="px-6 py-3 bg-ember text-obsidian font-syne font-semibold rounded-full hover:bg-ember-dim transition-colors text-sm">
                            Get in touch
                        </a>
                        <a href="#projects" className="px-6 py-3 border border-brand-border text-body font-syne font-medium rounded-full hover:border-ember hover:text-ember transition-colors text-sm">
                            See my projects
                        </a>
                    </div>
                </div>

                {/* Right: image */}
                <div className="about-image w-full max-w-sm mx-auto lg:mx-0 lg:w-[320px] xl:w-[380px] shrink-0">
                    <div className="relative">
                        {/* Decorative ember border frame */}
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-ember rounded-tl-2xl" />
                        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-ember rounded-br-2xl" />
                        <div className="relative rounded-2xl overflow-hidden">
                            <img
                                src="/JPEG image.png"
                                alt="Filip Galach"
                                className="w-full aspect-[3/4] object-cover object-top grayscale"
                            />
                            {/* Subtle ember tint overlay matching Hero */}
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}

export default About
