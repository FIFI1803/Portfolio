import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { supabase } from './lib/supabase'

const Projects = () => {
    const root = useRef(null)
    const [projects, setProjects] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
            setProjects(data || [])
            setLoaded(true)
        })
    }, [])

    useEffect(() => {
        if (!loaded) return

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: { trigger: root.current, start: 'top 85%', once: true }
            })
            .from('.projects-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', immediateRender: false }, 0)
            .from('.project-card',     { opacity: 0, y: 40, duration: 0.6, ease: 'power2.out', stagger: 0.1, immediateRender: false }, 0.25)
        }, root)

        // 3D tilt — fine-pointer only
        if (!window.matchMedia('(pointer: coarse)').matches) {
            const wrappers = root.current?.querySelectorAll('.tilt-wrapper') ?? []
            const handlers = []

            wrappers.forEach((wrapper) => {
                const onMove = (e) => {
                    const r = wrapper.getBoundingClientRect()
                    const x = (e.clientX - r.left)  / r.width  - 0.5
                    const y = (e.clientY - r.top)   / r.height - 0.5
                    gsap.to(wrapper, { rotateX: -y * 8, rotateY: x * 8, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' })
                }
                const onLeave = () => {
                    gsap.to(wrapper, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
                }
                wrapper.addEventListener('mousemove', onMove)
                wrapper.addEventListener('mouseleave', onLeave)
                handlers.push({ wrapper, onMove, onLeave })
            })

            return () => {
                ctx.revert()
                handlers.forEach(({ wrapper, onMove, onLeave }) => {
                    wrapper.removeEventListener('mousemove', onMove)
                    wrapper.removeEventListener('mouseleave', onLeave)
                })
            }
        }

        return () => ctx.revert()
    }, [loaded])

    return (
        <section ref={root} id="projects" className="relative z-[6] px-6 md:px-8 py-20 md:min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full flex flex-col">

            <p className="projects-heading text-ember text-sm font-syne font-medium tracking-widest uppercase mb-3">What I've built</p>
            <h2 className="projects-heading font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-heading mb-12 lg:mb-16">My Work</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {projects.map((project) => (
                    <div key={project.id} className="tilt-wrapper project-card" style={{ willChange: 'transform' }}>
                        <div className="group flex flex-col h-full bg-surface border border-brand-border rounded-2xl overflow-hidden hover:border-[rgba(0,212,170,0.35)] transition-colors duration-300">

                            {/* Screenshot */}
                            <div className="relative w-full aspect-video bg-surface2 flex items-center justify-center border-b border-brand-border overflow-hidden">
                                {project.image_url
                                    ? <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    : (
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center">
                                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-muted text-xs font-dm">Screenshot coming soon</span>
                                        </div>
                                    )
                                }
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 p-5 gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-syne text-base font-bold text-heading">{project.name}</h3>
                                    <a href={project.link} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-1 text-muted font-dm text-xs hover:text-ember transition-colors">
                                        View
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                                <p className="text-body text-sm font-dm leading-relaxed flex-1">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-obsidian text-muted font-dm text-xs rounded-full border border-brand-border">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    )
}

export default Projects
