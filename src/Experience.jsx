import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const experiences = [
    {
        role: 'SAP iXp Intern',
        company: 'SAP',
        period: 'December 2024 – Present',
        location: 'Remote, Poland',
        bullets: [
            'Developed and maintained internal web tools using React and TypeScript',
            'Collaborated with cross-functional teams in an agile environment',
            'Contributed to code reviews and improved documentation across the codebase',
        ],
    },
    {
        role: 'Freelance Web Developer',
        company: 'Self-employed',
        period: 'June 2023 – November 2024',
        location: 'Poland',
        bullets: [
            'Built responsive websites and web apps for small businesses',
            'Delivered projects end-to-end from design to deployment',
            'Worked closely with clients to translate requirements into working products',
        ],
    },
]

const Experience = () => {
    const root = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top 70%',
                    once: true,
                }
            })
            .from('.exp-heading',  { opacity: 0, y: 40,  duration: 0.8, ease: 'power3.out' }, 0)
            .from('.exp-card',     { opacity: 0, y: 60,  duration: 0.7, ease: 'power3.out', stagger: 0.2 }, 0.3)
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} id="experience" className="bg-obsidian px-6 md:px-16 py-16 md:min-h-screen flex flex-col justify-center">
            <p className="exp-heading text-ember text-sm font-syne font-medium tracking-widest uppercase mb-3">Where I've worked</p>
            <h2 className="exp-heading font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-heading mb-12 md:mb-16">Experience</h2>

            <div className="flex flex-col gap-6">
                {experiences.map((exp, i) => (
                    <div key={i} className="exp-card relative flex flex-col sm:flex-row gap-4 sm:gap-10 p-6 md:p-8 bg-surface border border-brand-border rounded-2xl hover:bg-surface2 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember to-transparent opacity-40" />
                        <div className="sm:w-48 shrink-0 flex sm:flex-col gap-2 sm:gap-1 sm:pt-1">
                            <span className="text-ember text-sm font-syne font-medium">{exp.period}</span>
                            <span className="text-muted text-sm font-dm hidden sm:block">{exp.location}</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-heading font-syne text-lg md:text-xl font-semibold">{exp.role}</h3>
                                <p className="text-subtle text-sm font-dm mt-1">{exp.company}</p>
                            </div>
                            <ul className="flex flex-col gap-2">
                                {exp.bullets.map((b, j) => (
                                    <li key={j} className="flex items-start gap-3 text-body text-sm font-dm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ember shrink-0"></span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Experience
