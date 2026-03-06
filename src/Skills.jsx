import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const skills = [
    { name: 'React', icon: '⚛️', accent: true },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'TypeScript', icon: '🔷', accent: true },
    { name: 'Node.js', icon: '🟩', accent: true },
    { name: 'Python', icon: '🐍' },
    { name: 'HTML & CSS', icon: '🌐' },
    { name: 'Tailwind', icon: '💨' },
    { name: 'Git', icon: '🔀' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'REST APIs', icon: '🔌' },
]

const languages = [
    { name: 'English', level: 100 },
    { name: 'Polish', level: 100 },
]

const education = [
    { title: 'BSc Computer Science', subtitle: 'University of Lorem Ipsum · 2021 – 2025' },
    { title: 'AWS Cloud Practitioner', subtitle: 'Amazon Web Services · 2024' },
]

const Skills = () => {
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

            tl.from('.skills-heading',    { opacity: 0, y: 40,  duration: 0.8, ease: 'power3.out' }, 0)
              .from('.skill-chip',         { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.5)', stagger: 0.05 }, 0.3)
              .from('.edu-item',           { opacity: 0, x: -30, duration: 0.5, ease: 'power2.out', stagger: 0.15 }, 0.4)
              .from('.lang-label',         { opacity: 0, y: 15,  duration: 0.4, ease: 'power2.out', stagger: 0.15 }, 0.5)

            gsap.utils.toArray('.lang-bar').forEach((bar, i) => {
                const target = bar.dataset.level
                gsap.fromTo(bar,
                    { width: '0%' },
                    {
                        width: `${target}%`,
                        duration: 1.2,
                        ease: 'power2.out',
                        delay: 0.7 + i * 0.2,
                        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true }
                    }
                )
            })
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} id="skills" className="bg-obsidian px-6 md:px-16 py-16 md:min-h-screen flex flex-col justify-center">
            <p className="skills-heading text-ember text-sm font-syne font-medium tracking-widest uppercase mb-3">What I know</p>
            <h2 className="skills-heading font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-heading mb-12 md:mb-16">Skills & Background</h2>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                <div className="flex-1 flex flex-col gap-12">
                    <div>
                        <h3 className="text-muted text-sm font-syne uppercase tracking-widest mb-6">Technologies</h3>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill) => (
                                <div
                                    key={skill.name}
                                    className={`skill-chip flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                                        skill.accent
                                            ? 'bg-[rgba(255,92,43,0.08)] text-ember border border-[rgba(255,92,43,0.2)] hover:bg-[rgba(255,92,43,0.14)]'
                                            : 'bg-surface2 text-subtle border border-brand-border hover:bg-surface hover:text-body'
                                    }`}
                                >
                                    <span>{skill.icon}</span>
                                    <span className="font-dm">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-muted text-sm font-syne uppercase tracking-widest mb-6">Education & Certifications</h3>
                        <div className="flex flex-col gap-4">
                            {education.map((item) => (
                                <div key={item.title} className="edu-item flex items-start gap-3">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-ember shrink-0"></span>
                                    <div>
                                        <p className="text-heading font-dm font-medium">{item.title}</p>
                                        <p className="text-muted text-sm font-dm">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-72 shrink-0">
                    <h3 className="text-muted text-sm font-syne uppercase tracking-widest mb-6">Languages</h3>
                    <div className="flex flex-col gap-6">
                        {languages.map((lang) => (
                            <div key={lang.name} className="lang-label">
                                <div className="flex justify-between mb-2">
                                    <span className="text-heading text-sm font-dm font-medium">{lang.name}</span>
                                    <span className="text-muted text-sm font-dm">{lang.level}%</span>
                                </div>
                                <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                                    <div
                                        className="lang-bar h-full bg-ember rounded-full"
                                        data-level={lang.level}
                                        style={{ width: 0 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills
