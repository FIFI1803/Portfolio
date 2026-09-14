import { useState } from 'react'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { notes as localNotes } from '../content'

/** 2026-09-09 → 09.09.26 */
const fmtDate = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-')
  return y && m && d ? `${d}.${m}.${y.slice(2)}` : iso
}

const ROW =
  'group grid w-full grid-cols-12 items-baseline gap-x-5 py-5 text-left outline-offset-[-2px] md:py-6'
const TITLE =
  'col-span-11 mt-1 text-[clamp(1.25rem,2.2vw,1.875rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.24,1)] group-hover:translate-x-2 md:col-span-9 md:mt-0'

/**
 * A note with a `url` is a link. Without one it's a draft: the row expands
 * to show its summary in place.
 */
const Notes = () => {
  const notes = useContent('notes', localNotes, (q) => q.order('date', { ascending: false }))
  const [openId, setOpenId] = useState(null)

  return (
    <Section id="notes" index="Notes / drafts" title="Notes">
      <Reveal>
        <ul className="border-t border-rule">
          {notes.map((note) => {
            const open = openId === note.id
            const panelId = `note-${note.id}`
            return (
              <li key={note.id} className="border-b border-rule">
                {note.url ? (
                  <a href={note.url} target="_blank" rel="noreferrer" className={ROW}>
                    <span className="meta tabular col-span-12 text-ink-2 md:col-span-2">{fmtDate(note.date)}</span>
                    <span className={TITLE}>{note.title}</span>
                    <span className="arrow col-span-1 text-right text-[1.25rem] text-ink-2" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? null : note.id)}
                      className={ROW}
                    >
                      <span className="meta tabular col-span-12 text-ink-2 md:col-span-2">{fmtDate(note.date)}</span>
                      <span className={TITLE}>{note.title}</span>
                      <span className="arrow col-span-1 text-right text-[1.25rem] text-ink-2" aria-hidden="true">
                        {open ? '↑' : '↓'}
                      </span>
                    </button>
                    <div id={panelId} hidden={!open} className="grid grid-cols-12 gap-x-5 pb-6">
                      <p className="measure col-span-12 text-[15px] leading-[1.55] text-ink-2 md:col-span-8 md:col-start-3">
                        {note.summary}
                      </p>
                      <p className="meta col-span-12 mt-3 text-ink-2 md:col-span-8 md:col-start-3">Draft</p>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>
    </Section>
  )
}

export default Notes
