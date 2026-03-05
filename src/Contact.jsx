import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Contact = () => {
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
            .from('.contact-heading',   { opacity: 0, y: 40,  duration: 0.8, ease: 'power3.out' }, 0)
            .from('.contact-link',      { opacity: 0, x: -40, duration: 0.6, ease: 'power3.out', stagger: 0.12 }, 0.3)
            .from('.contact-field',     { opacity: 0, y: 30,  duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 0.4)
            .from('.contact-submit',    { opacity: 0, y: 20,  duration: 0.5, ease: 'power2.out' }, 0.9)
            .from('.contact-footer',    { opacity: 0,         duration: 0.6, ease: 'power2.out' }, 1.0)
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={root} id="contact" className="bg-gray-950 px-6 md:px-16 py-16 md:min-h-screen flex flex-col justify-center">
            <p className="contact-heading text-yellow-400 text-sm font-medium tracking-widest uppercase mb-3">Let's talk</p>
            <h2 className="contact-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Get in touch</h2>
            <p className="contact-heading text-gray-400 text-base mb-12 md:mb-16 max-w-xl">
                Whether you have a project in mind, a job opportunity, or just want to say hi — my inbox is always open.
            </p>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Contact links */}
                <div className="flex flex-col gap-4 w-full lg:w-72 shrink-0">
                    <a href="mailto:filip.galach@gmail.com" className="contact-link flex items-center gap-4 p-5 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors group">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-gray-500 text-xs uppercase tracking-widest">Email</p>
                            <p className="text-white text-sm group-hover:text-yellow-400 transition-colors truncate">filip.galach@gmail.com</p>
                        </div>
                    </a>

                    <a href="https://linkedin.com/in/filip-galach" target="_blank" rel="noreferrer" className="contact-link flex items-center gap-4 p-5 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors group">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-gray-500 text-xs uppercase tracking-widest">LinkedIn</p>
                            <p className="text-white text-sm group-hover:text-yellow-400 transition-colors truncate">linkedin.com/in/filip-galach</p>
                        </div>
                    </a>

                    <a href="https://github.com/filipgalach" target="_blank" rel="noreferrer" className="contact-link flex items-center gap-4 p-5 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors group">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-gray-500 text-xs uppercase tracking-widest">GitHub</p>
                            <p className="text-white text-sm group-hover:text-yellow-400 transition-colors truncate">github.com/filipgalach</p>
                        </div>
                    </a>
                </div>

                {/* Form */}
                <form className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="text"  placeholder="Your name"  className="contact-field flex-1 px-5 py-4 bg-gray-900 text-white placeholder-gray-500 rounded-2xl border border-gray-800 focus:outline-none focus:border-yellow-400 transition-colors text-sm" />
                        <input type="email" placeholder="Your email" className="contact-field flex-1 px-5 py-4 bg-gray-900 text-white placeholder-gray-500 rounded-2xl border border-gray-800 focus:outline-none focus:border-yellow-400 transition-colors text-sm" />
                    </div>
                    <input type="text" placeholder="Subject" className="contact-field px-5 py-4 bg-gray-900 text-white placeholder-gray-500 rounded-2xl border border-gray-800 focus:outline-none focus:border-yellow-400 transition-colors text-sm" />
                    <textarea rows={6} placeholder="Your message..." className="contact-field px-5 py-4 bg-gray-900 text-white placeholder-gray-500 rounded-2xl border border-gray-800 focus:outline-none focus:border-yellow-400 transition-colors text-sm resize-none" />
                    <button type="submit" className="contact-submit self-start px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transition-colors text-sm">
                        Send message →
                    </button>
                </form>
            </div>

            <div className="contact-footer mt-16 md:mt-24 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-gray-600 text-sm">© 2025 Filip Galach. All rights reserved.</p>
                <p className="text-gray-600 text-sm">Built with React & Tailwind CSS</p>
            </div>
        </section>
    )
}

export default Contact
