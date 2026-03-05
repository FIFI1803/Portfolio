import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const projects = [
    {
        name: 'Project Alpha',
        description: 'A full-stack web application for managing tasks and team collaboration in real time. Built with a focus on performance and a clean user experience.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        image: null,
        link: '#',
    },
    {
        name: 'Portfolio Site',
        description: 'This portfolio — designed and built from scratch using React and Tailwind CSS. Focused on clean typography, smooth interactions, and a strong visual identity.',
        tags: ['React', 'Tailwind CSS'],
        image: null,
        link: '#',
    },
    {
        name: 'Project Beta',
        description: 'A REST API service for e-commerce data processing with JWT authentication, rate limiting, and Dockerised deployment for easy scaling.',
        tags: ['Python', 'FastAPI', 'Docker'],
        image: null,
        link: '#',
    },
]

const Projects = () => {
    const containerRef = useRef(null)
    const stickyRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const activeIndexRef = useRef(0)

    // Scroll → activeIndex
    useEffect(() => {
        const handleScroll = () => {
            const el = containerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const scrolled = -rect.top
            const index = Math.min(
                projects.length - 1,
                Math.max(0, Math.floor(scrolled / window.innerHeight))
            )
            if (index !== activeIndexRef.current) {
                activeIndexRef.current = index
                setActiveIndex(index)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // GSAP transition whenever activeIndex changes
    useEffect(() => {
        const cards = gsap.utils.toArray('.project-card')
        cards.forEach((card, i) => {
            if (i === activeIndex) {
                gsap.fromTo(card,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', pointerEvents: 'auto' }
                )
            } else {
                gsap.to(card, {
                    opacity: 0,
                    y: i < activeIndex ? -50 : 50,
                    duration: 0.5,
                    ease: 'power2.in',
                    pointerEvents: 'none'
                })
            }
        })
    }, [activeIndex])

    // Header entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
            })
            .from('.projects-header', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
        })
        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={containerRef}
            id="projects"
            style={{ height: `${projects.length * 100}vh` }}
            className="relative"
        >
            <div ref={stickyRef} className="sticky top-0 h-screen bg-gray-900 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="projects-header px-6 md:px-16 pt-12 md:pt-16 shrink-0">
                    <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase mb-1">What I've built</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">My Work</h2>
                        <div className="flex gap-2 pb-1">
                            {projects.map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-full transition-all duration-500 ${
                                        i === activeIndex ? 'w-6 h-2 bg-yellow-400' : 'w-2 h-2 bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="relative flex-1 px-6 md:px-16 py-8 md:py-10">
                    {projects.map((project, i) => (
                        <div
                            key={project.name}
                            className="project-card absolute inset-x-6 md:inset-x-16 inset-y-8 md:inset-y-10"
                            style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' }}
                        >
                            <div className="flex flex-col lg:flex-row gap-8 h-full">
                                {/* Info */}
                                <div className="flex flex-col justify-center gap-5 w-full lg:w-2/5">
                                    <span className="text-gray-600 text-sm font-mono">
                                        {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{project.name}</h3>
                                    <p className="text-gray-400 text-base leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <a
                                        href={project.link}
                                        className="self-start px-6 py-3 border border-gray-600 text-gray-300 text-sm font-medium rounded-full hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                                    >
                                        Check it out →
                                    </a>
                                </div>

                                {/* Image */}
                                <div className="flex-1 bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-48 lg:min-h-0">
                                    {project.image
                                        ? <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                                        : <span className="text-gray-600 text-sm">Project Screenshot</span>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Projects
