import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { supabase } from './lib/supabase'

const Skills = () => {
    const root = useRef(null)
    const [skills, setSkills] = useState([])
    const [education, setEducation] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        Promise.all([
            supabase.from('skills').select('*').order('sort_order'),
            supabase.from('education').select('*').order('sort_order'),
        ]).then(([{ data: s }, { data: e }]) => {
            setSkills(s || [])
            setEducation(e || [])
            setLoaded(true)
        })
    }, [])

    useEffect(() => {
        if (!loaded) return

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: root.current, start: 'top 75%', once: true }
            })

            tl.from('.skills-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', immediateRender: false }, 0)
              .from('.skill-chip',     { opacity: 0, scale: 0.85, duration: 0.4, ease: 'back.out(1.4)', stagger: 0.04, immediateRender: false }, 0.3)
              .from('.cert-badge',     { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.12, immediateRender: false }, 0.5)
              .from('.edu-item',       { opacity: 0, x: 20, duration: 0.5, ease: 'power2.out', stagger: 0.12, immediateRender: false }, 0.3)
              .from('.lang-label',     { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out', stagger: 0.12, immediateRender: false }, 0.5)

            gsap.utils.toArray('.lang-bar').forEach((bar, i) => {
                gsap.fromTo(bar,
                    { width: '0%' },
                    {
                        width: `${bar.dataset.level}%`,
                        duration: 1.2,
                        ease: 'power2.out',
                        delay: 0.6 + i * 0.2,
                        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true }
                    }
                )
            })
        }, root)

        return () => ctx.revert()
    }, [loaded])

    const certs  = education.filter(e => e.type === 'certification')
    const eduItems = education.filter(e => e.type === 'education')

    const languages = [
        { name: 'English', label: 'Native', level: 100 },
        { name: 'Polish',  label: 'Native', level: 100 },
    ]

    return (
        <section ref={root} id="skills" className="relative z-[6] mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 py-24 md:min-h-screen md:px-10 lg:px-16 lg:py-32">

            <p className="skills-heading mb-8 text-[11px] font-mono uppercase tracking-[0.14em] text-ember">02 / Capabilities</p>
            <h2 className="skills-heading mb-14 max-w-3xl font-syne text-4xl font-semibold tracking-[-0.045em] text-heading sm:text-5xl lg:mb-20 lg:text-6xl">Skills & Background</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

                {/* Left: Technologies + Cert badges */}
                <div className="lg:col-span-3 flex flex-col gap-10">

                    <div>
                        <h3 className="text-subtle text-[10px] font-mono uppercase tracking-[0.14em] mb-6">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className={`skill-chip flex items-center gap-2 rounded-[3px] border px-3.5 py-2 text-xs font-dm transition-colors cursor-default ${
                                        skill.accent
                                            ? 'bg-ember/8 text-ice border-ember/30 hover:bg-ember/12'
                                            : 'bg-surface2 text-subtle border-brand-border hover:text-body'
                                    }`}
                                >
                                    {skill.icon_name && (
                                        <img
                                            src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                                            alt={skill.name}
                                            className="w-4 h-4 shrink-0"
                                            onError={e => { e.target.style.display = 'none' }}
                                        />
                                    )}
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Cert badges — only shown when there are certifications */}
                    {certs.length > 0 && (
                        <div>
                            <h3 className="text-subtle text-[10px] font-mono uppercase tracking-[0.14em] mb-6">Certifications</h3>
                            <div className="flex flex-wrap gap-4">
                                {certs.map((cert) => {
                                    const Tag = cert.verify_url ? 'a' : 'div'
                                    return (
                                        <Tag
                                            key={cert.id}
                                            {...(cert.verify_url ? { href: cert.verify_url, target: '_blank', rel: 'noreferrer' } : {})}
                                            className="cert-badge group relative flex w-44 flex-col items-center gap-4 overflow-hidden border border-brand-border bg-surface p-5 text-center transition-colors duration-300 hover:border-subtle hover:bg-surface2"
                                        >
                                            {/* Badge icon */}
                                            {cert.icon_url
                                                ? (
                                                    <img
                                                        src={cert.icon_url}
                                                        alt={cert.title}
                                                        className="w-20 h-20 object-contain"
                                                        onError={e => { e.target.style.display = 'none' }}
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-ember/10 border border-ember/20 flex items-center justify-center">
                                                        <svg className="w-10 h-10 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                    </div>
                                                )
                                            }

                                            {/* Text */}
                                            <div className="flex flex-col gap-1">
                                                <p className="text-heading text-xs font-syne font-semibold leading-snug">{cert.title}</p>
                                                <p className="text-muted text-[11px] font-dm">{cert.subtitle}</p>
                                                <p className="text-muted/60 text-[11px] font-dm">{cert.period}</p>
                                            </div>

                                            {/* Verify link label */}
                                            {cert.verify_url && (
                                                <span className="text-[9px] font-mono uppercase tracking-wider text-ember/70 group-hover:text-ember transition-colors flex items-center gap-1">
                                                    Verify ↗
                                                </span>
                                            )}
                                        </Tag>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Education + Languages */}
                <div className="lg:col-span-2 flex flex-col gap-10">

                    <div>
                        <h3 className="text-subtle text-[10px] font-mono uppercase tracking-[0.14em] mb-6">Education</h3>
                        <div className="flex flex-col gap-5">
                            {eduItems.map((item) => (
                                <div key={item.id} className="edu-item flex items-start gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-ember shrink-0" />
                                    <div>
                                        <p className="text-heading font-dm font-medium text-sm">{item.title}</p>
                                        <p className="text-muted text-xs font-dm mt-0.5">{item.subtitle} · {item.period}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-subtle text-[10px] font-mono uppercase tracking-[0.14em] mb-6">Languages</h3>
                        <div className="flex flex-col gap-4">
                            {languages.map((lang) => (
                                <div key={lang.name} className="lang-label">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-heading text-sm font-dm font-medium">{lang.name}</span>
                                        <span className="text-muted text-xs font-dm">{lang.label}</span>
                                    </div>
                                    <div className="h-px bg-surface2 overflow-hidden">
                                        <div className="lang-bar h-full bg-ember" data-level={lang.level} style={{ width: 0 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills
