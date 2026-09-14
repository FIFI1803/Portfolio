import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import {
  experience as localExperience,
  education as localEducation,
  skills as localSkills,
} from '../content'

/* Rows from Supabase carry a `group`; anything without one lands in Other. */
const groupSkills = (rows) => {
  const out = new Map()
  for (const row of rows) {
    const key = row.group || 'Other'
    if (!out.has(key)) out.set(key, [])
    out.get(key).push(row)
  }
  return [...out.entries()]
}

/**
 * The CV, set like the rest of the page: experience as editorial rows,
 * education and certifications as a dated list, skills as grouped text.
 * No bars, no logos, no percentages.
 */
const Background = () => {
  const roles = useContent('experience', localExperience)
  const education = useContent('education', localEducation)
  const skills = useContent('skills', localSkills)

  const study = education.filter(e => e.type === 'education')
  const certs = education.filter(e => e.type === 'certification')
  const groups = groupSkills(skills)

  return (
    <Section id="background" index="Experience / CV" title="Background">
      {/* Experience */}
      <div>
        {roles.map((role) => (
          <Reveal key={role.id ?? role.role}>
            <article className="grid grid-cols-12 gap-x-5 gap-y-6 border-t border-rule py-10 md:py-12">
              <div className="meta col-span-12 text-ink-2 md:col-span-2">
                <p>{role.period}</p>
                {role.location && <p className="mt-1">{role.location}</p>}
              </div>

              <div className="col-span-12 md:col-span-4 md:col-start-3 lg:col-span-3">
                <h3 className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink">
                  {role.role}
                </h3>
                <p className="mt-2 text-[15px] text-ink-2">{role.company}</p>
              </div>

              <ul className="col-span-12 space-y-3 md:col-span-6 md:col-start-7">
                {(role.bullets || []).map((b) => (
                  <li key={b} className="measure border-l border-rule pl-4 text-[15px] leading-[1.55] text-ink">
                    {b}
                  </li>
                ))}
              </ul>

            </article>
          </Reveal>
        ))}
      </div>

      {/* Education + certifications */}
      <div className="mt-20 grid grid-cols-12 gap-x-5 gap-y-14 border-t border-rule pt-10 md:mt-28">
        <Reveal className="col-span-12 md:col-span-5 md:col-start-3 lg:col-span-4 lg:col-start-3">
          <h3 className="meta text-ink">Education</h3>
          <ul className="mt-6">
            {study.map((item) => (
              <li key={item.id ?? item.title} className="border-b border-rule py-4">
                <p className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-ink">{item.title}</p>
                <p className="meta mt-2 text-ink-2">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80} className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8">
          <h3 className="meta text-ink">Certifications</h3>
          <ul className="mt-6">
            {certs.map((item) => (
              <li key={item.id ?? item.title} className="border-b border-rule py-4">
                <p className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-ink">
                  {item.verify_url ? (
                    <a href={item.verify_url} target="_blank" rel="noreferrer"
                       className="link decoration-rule hover:decoration-ink">
                      {item.title}
                    </a>
                  ) : item.title}
                </p>
                <p className="meta mt-2 text-ink-2">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Skills */}
      <div className="mt-20 border-t border-rule pt-10 md:mt-28">
        {groups.map(([group, rows], i) => (
          <Reveal key={group} delay={i * 50}>
            <div className="grid grid-cols-12 gap-x-5 gap-y-2 border-b border-rule py-5">
              <p className="meta col-span-12 text-ink-2 md:col-span-2">{group}</p>
              <p className="col-span-12 text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.5] tracking-[-0.01em] text-ink md:col-span-9 md:col-start-3">
                {rows.map((s, j) => (
                  <span key={s.id ?? s.name}>
                    <span className={s.accent ? 'font-medium' : ''}>{s.name}</span>
                    {j < rows.length - 1 && <span className="text-ink-2"> · </span>}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export default Background
