import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { supabase } from '../lib/supabase'

const Contact = () => {
    const root = useRef(null)
    const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', subject: '', message: '' })
    const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top 70%',
                    once: true,
                }
            })
            .from('.contact-heading',   { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', immediateRender: false }, 0)
            .from('.contact-sub',       { opacity: 0, y: 25, duration: 0.6, ease: 'power2.out', immediateRender: false }, 0.3)
            .from('.contact-link',      { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.1, immediateRender: false }, 0.4)
            .from('.contact-field',     { opacity: 0, y: 25, duration: 0.5, ease: 'power2.out', stagger: 0.07, immediateRender: false }, 0.5)
            .from('.contact-submit',    { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', immediateRender: false }, 0.9)
            .from('.contact-footer',    { opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, 1.0)
        }, root)

        return () => ctx.revert()
    }, [])

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()

        if (!supabase) {
            setStatus('error')
            return
        }

        setStatus('sending')
        const { error } = await supabase.from('contact_messages').insert({
            name:    form.name.trim(),
            email:   form.email.trim(),
            company: form.company.trim() || null,
            budget:  form.budget || null,
            subject: form.subject.trim() || null,
            message: form.message.trim(),
        })
        if (error) {
            setStatus('error')
        } else {
            setStatus('sent')
            setForm({ name: '', email: '', company: '', budget: '', subject: '', message: '' })
        }
    }

    return (
        <section ref={root} id="contact" className="relative z-[6] px-6 md:px-8 py-16 md:min-h-screen flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full flex flex-col">

            {/* Editorial heading */}
            <p className="contact-heading text-ember text-sm font-syne font-medium tracking-widest uppercase mb-4">Let's talk</p>
            <h2 className="contact-heading font-syne text-4xl sm:text-5xl lg:text-7xl font-bold text-heading leading-[1.0] mb-4 max-w-3xl">
                Got a project<br />in mind?
            </h2>
            <p className="contact-sub text-body font-dm text-base mb-10 max-w-xl">
                Whether you have a project in mind, a job opportunity, or just want to say hi — my inbox is always open.
            </p>

            {/* Horizontal contact links */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 md:mb-16">
                <a href="mailto:filipgalach@gmail.com" className="contact-link flex items-center gap-3 px-5 py-3 bg-surface border border-brand-border rounded-full hover:border-[rgba(255,92,43,0.4)] hover:bg-surface2 transition-colors group w-fit">
                    <div className="w-7 h-7 bg-ember rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-subtle text-sm font-dm group-hover:text-heading transition-colors">filipgalach@gmail.com</span>
                </a>

                <a href="https://www.linkedin.com/in/filip-galach-682904309/" target="_blank" rel="noreferrer" className="contact-link flex items-center gap-3 px-5 py-3 bg-surface border border-brand-border rounded-full hover:border-[rgba(255,92,43,0.4)] hover:bg-surface2 transition-colors group w-fit">
                    <div className="w-7 h-7 bg-ember rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-obsidian" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </div>
                    <span className="text-subtle text-sm font-dm group-hover:text-heading transition-colors">linkedin.com/in/filip-galach</span>
                </a>

                <a href="https://github.com/FIFI1803" target="_blank" rel="noreferrer" className="contact-link flex items-center gap-3 px-5 py-3 bg-surface border border-brand-border rounded-full hover:border-[rgba(255,92,43,0.4)] hover:bg-surface2 transition-colors group w-fit">
                    <div className="w-7 h-7 bg-ember rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-obsidian" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                    </div>
                    <span className="text-subtle text-sm font-dm group-hover:text-heading transition-colors">github.com/FIFI1803</span>
                </a>
            </div>

            {/* Form */}
            {status === 'sent' ? (
                <div className="contact-field max-w-2xl px-8 py-10 bg-surface border border-ember/30 rounded-2xl flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ember/10 border border-ember/30 flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="font-syne text-lg font-semibold text-heading">Message sent!</p>
                    <p className="text-body text-sm font-dm">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                    <button onClick={() => setStatus(null)} className="mt-2 text-ember text-sm font-dm hover:text-ember-dim transition-colors">
                        Send another →
                    </button>
                </div>
            ) : (
                <form onSubmit={submit} className="flex flex-col gap-4 max-w-2xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Your name *"
                            value={form.name}
                            onChange={f('name')}
                            required
                            className="contact-field flex-1 px-5 py-4 bg-surface text-heading placeholder-muted font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm"
                        />
                        <input
                            type="email"
                            placeholder="Your email *"
                            value={form.email}
                            onChange={f('email')}
                            required
                            className="contact-field flex-1 px-5 py-4 bg-surface text-heading placeholder-muted font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Company / Organisation"
                            value={form.company}
                            onChange={f('company')}
                            className="contact-field flex-1 px-5 py-4 bg-surface text-heading placeholder-muted font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm"
                        />
                        <select
                            value={form.budget}
                            onChange={f('budget')}
                            className="contact-field flex-1 px-5 py-4 bg-surface text-heading font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm appearance-none"
                        >
                            <option value="">Budget range (optional)</option>
                            <option value="< €1k">Under €1k</option>
                            <option value="€1k – €5k">€1k – €5k</option>
                            <option value="€5k – €15k">€5k – €15k</option>
                            <option value="€15k – €30k">€15k – €30k</option>
                            <option value="€30k+">€30k+</option>
                            <option value="Let's discuss">Let's discuss</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={f('subject')}
                        className="contact-field px-5 py-4 bg-surface text-heading placeholder-muted font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm"
                    />
                    <textarea
                        rows={5}
                        placeholder="Tell me about your project or idea... *"
                        value={form.message}
                        onChange={f('message')}
                        required
                        className="contact-field px-5 py-4 bg-surface text-heading placeholder-muted font-dm rounded-2xl border border-brand-border focus:outline-none focus:border-ember transition-colors text-sm resize-none"
                    />
                    {status === 'error' && (
                        <p role="alert" className="text-red-400 text-sm font-dm">
                            Something went wrong sending that. Please email me directly at{' '}
                            <a href="mailto:filipgalach@gmail.com" className="underline hover:text-ember">filipgalach@gmail.com</a>.
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="contact-submit self-start px-8 py-3 bg-ember text-obsidian font-syne font-semibold rounded-full hover:bg-ember-dim transition-colors text-sm disabled:opacity-50"
                    >
                        {status === 'sending' ? 'Sending…' : 'Send message →'}
                    </button>
                </form>
            )}

            <div className="contact-footer mt-16 md:mt-24 pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-muted text-sm font-dm">© 2026 Filip Galach. All rights reserved.</p>
                <p className="text-muted text-sm font-dm">Built with React & Tailwind CSS</p>
            </div>
            </div>
        </section>
    )
}

export default Contact
