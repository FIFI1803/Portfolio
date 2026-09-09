import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { skills as localSkills, education as localEducation } from '../content'

/* Local rows carry a `group`; rows coming from Supabase don't, so they all
   collect under a single heading rather than disappearing. */
const groupSkills = (rows) => {
  const out = new Map()
  for (const row of rows) {
    const key = row.group || 'Technologies'
    if (!out.has(key)) out.set(key, [])
    out.get(key).push(row.name)
  }
  return [...out.entries()]
}

const Stack = () => {
  const skills = useContent('skills', localSkills)
  const education = useContent('education', localEducation)

  const groups = groupSkills(skills)
  const certs = education.filter(e => e.type === 'certification')
  const study = education.filter(e => e.type === 'education')

  return (
    <Section id="stack" ground="light" className="border-t border-rule">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-ink">Skills &amp; Background</h2>
      </Reveal>

      <div className="mt-14 space-y-8">
        {groups.map(([group, items], i) => (
          <Reveal key={group} delay={i * 60}>
            <div className="grid gap-3 border-t border-rule pt-5 md:grid-cols-[220px_1fr] md:gap-8">
              <p className="meta text-ink-3">{group}</p>
              <p className="text-[16px] text-ink-2">{items.join('  ·  ')}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <Reveal>
          <h3 className="display text-[30px] text-ink">Education</h3>
          <ul className="mt-6 space-y-6">
            {study.map(item => (
              <li key={item.id ?? item.title} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">{item.title}</p>
                <p className="meta mt-1 text-ink-3">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <h3 className="display text-[30px] text-ink">Certifications</h3>
          <ul className="mt-6 space-y-6">
            {certs.map(item => (
              <li key={item.id ?? item.title} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">
                  {item.verify_url ? (
                    <a href={item.verify_url} target="_blank" rel="noreferrer"
                       className="border-b border-rule pb-0.5 hover:border-ink">
                      {item.title}
                    </a>
                  ) : item.title}
                </p>
                <p className="meta mt-1 text-ink-3">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

export default Stack
