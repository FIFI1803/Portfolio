import { useState } from 'react'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'
import { profile } from '../content'

const FIELD =
  'w-full border border-noir-rule bg-noir-2 px-4 py-3 text-[16px] text-noir-ink placeholder:text-noir-ink-3'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

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

  const details = [
    ['Email', `mailto:${profile.email}`, profile.email],
    ['LinkedIn', profile.linkedin, 'in/filip-galach'],
    ['GitHub', profile.github, 'FIFI1803'],
    ['CV', profile.cv, 'Download PDF'],
  ]

  return (
    <Section id="contact" ground="dark">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-noir-ink">
            Get in touch
          </h2>
          <p className="measure mt-6 text-[17px] text-noir-ink-2">
            Open to conversations about front-end and full-stack work,
            especially in enterprise contexts. I read everything that comes in.
          </p>

          <ul className="mt-10 space-y-3">
            {details.map(([label, href, text]) => (
              <li key={label} className="grid grid-cols-[110px_1fr] gap-4">
                <span className="meta text-noir-ink-3">{label}</span>
                <a href={href}
                   className="border-b border-noir-rule pb-0.5 text-[16px] text-noir-ink transition-colors hover:border-noir-ink">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="name" className="meta text-noir-ink-3">Name</label>
              <input id="name" required value={form.name} onChange={set('name')}
                     className={`${FIELD} mt-2`} />
            </div>
            <div>
              <label htmlFor="email" className="meta text-noir-ink-3">Email</label>
              <input id="email" type="email" required value={form.email} onChange={set('email')}
                     className={`${FIELD} mt-2`} />
            </div>
            <div>
              <label htmlFor="message" className="meta text-noir-ink-3">Message</label>
              <textarea id="message" required rows={6} value={form.message} onChange={set('message')}
                        className={`${FIELD} mt-2 resize-y`} />
            </div>

            <button type="submit" disabled={status === 'sending'}
                    className="bg-noir-ink px-6 py-3 text-[15px] text-noir transition-opacity hover:opacity-85 disabled:opacity-50">
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            <p aria-live="polite" className="meta">
              {status === 'sent' && 'Thanks — I’ll come back to you.'}
              {status === 'error' && `Something went wrong. Email me directly at ${profile.email}.`}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

export default Contact
