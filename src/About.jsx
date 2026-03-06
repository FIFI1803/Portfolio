import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const About = () => {
    const root = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top 75%',
                    once: true,
                }
            })

            tl.from('.about-image', { opacity: 0, x: -60, duration: 1.0, ease: 'power3.out' }, 0)
                .from('.about-label', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, 0.2)
                .from('.about-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0.3)
                .from('.about-body', { opacity: 0, y: 25, duration: 0.6, ease: 'power2.out', stagger: 0.15 }, 0.5)
                .from('.about-cta > *', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 0.8)
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} id="about" className="bg-obsidian px-6 md:px-16 py-16 md:min-h-screen flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                <div className="about-image w-full lg:w-2/5 shrink-0">
                    <img src="/HeroImage.png" alt="about" className="w-full h-64 sm:h-80 lg:h-[500px] object-cover rounded-3xl" />
                </div>

                <div className="flex flex-col gap-6">
                    <p className="about-label text-ember text-sm font-syne font-medium tracking-widest uppercase">About Me</p>
                    <h2 className="about-heading font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-heading leading-tight">
                        Passionate about building<br className="hidden sm:block" />great software
                    </h2>
                    <p className="about-body text-body text-base font-dm leading-relaxed">
                        I'm a Software Developer based in Dublin, Ireland with a passion for building clean, user-friendly web applications.
                        I enjoy turning complex problems into simple, elegant solutions. When I'm not coding I'm probably learning
                        something new, exploring new technologies, or enjoying the outdoors.
                    </p>
                    <p className="about-body text-body text-base font-dm leading-relaxed">
                        Currently open to new opportunities — whether it's a full-time role, freelance project, or just a great conversation
                        about tech.
                    </p>
                    <div className="about-cta flex flex-wrap gap-4 mt-2">
                        <a href="#contact" className="px-6 py-3 bg-ember text-obsidian font-syne font-semibold rounded-full hover:bg-ember-dim transition-colors text-sm">
                            Get in touch
                        </a>
                        <a href="#projects" className="px-6 py-3 border border-brand-border text-body font-syne font-medium rounded-full hover:border-ember hover:text-ember transition-colors text-sm">
                            View my work
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
