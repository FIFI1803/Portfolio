import { useState } from 'react'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'
import { useSite } from '../lib/useContent'
import { site as localSite } from '../content'

const FIELD =
  'w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-[16px] text-ink placeholder:text-ink-2 focus:border-ink focus-visible:outline-none'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const site = useSite(localSite)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        company: null,
        budget: null,
        subject: null,
      })
      if (error) throw error
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="w-full border-t border-rule px-gutter">
      <div className="mx-auto max-w-[1600px] py-20 md:py-28 lg:py-36">
        <Reveal>
          <h2 className="display text-[clamp(3rem,9vw,8.5rem)] text-ink">
            Have something<br />worth building?
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <a href={`mailto:${site.email}`}
             className="group mt-12 inline-flex max-w-full items-baseline gap-3 text-[clamp(1.25rem,3.4vw,3.25rem)] font-medium tracking-[-0.03em] text-ink md:mt-16">
            <span className="link break-all decoration-rule underline-offset-[0.15em] group-hover:decoration-ink">{site.email}</span>
            <span className="arrow text-[0.6em] text-accent" aria-hidden="true">↗</span>
          </a>
        </Reveal>

        <div className="mt-20 grid grid-cols-12 gap-x-5 gap-y-14 border-t border-rule pt-10 md:mt-28">
          <Reveal className="col-span-12 md:col-span-4 lg:col-span-3 lg:col-start-3">
            <ul className="space-y-4">
              {[
                ['GitHub', site.github, String(site.github || '').replace(/^https?:\/\//, '')],
                ['LinkedIn', site.linkedin, String(site.linkedin || '').replace(/^https?:\/\//, '')],
                ['CV', site.cv_url, 'Download PDF'],
              ].map(([label, href, text]) => (
                <li key={label}>
                  <p className="meta text-ink-2">{label}</p>
                  <a href={href} {...(label === 'CV' ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
                     className="link mt-1 inline-block text-[15px] text-ink decoration-rule hover:decoration-ink">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80} className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-7">
            <p className="meta text-ink-2">Or leave a message here</p>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input id="name" required autoComplete="name" placeholder="Name"
                       value={form.name} onChange={set('name')} className={FIELD} />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" type="email" required autoComplete="email" placeholder="Email"
                       value={form.email} onChange={set('email')} className={FIELD} />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" required rows={4} placeholder="What are you building?"
                          value={form.message} onChange={set('message')} className={`${FIELD} resize-y`} />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button type="submit" disabled={status === 'sending'}
                        className="group inline-flex items-center gap-2 bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-accent disabled:opacity-50 disabled:hover:bg-ink">
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <span className="arrow" aria-hidden="true">→</span>
                </button>
                <p aria-live="polite" className="meta text-ink-2">
                  {status === 'sent' && 'Sent. I’ll come back to you.'}
                  {status === 'error' && `Something went wrong — email me directly at ${site.email}.`}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
