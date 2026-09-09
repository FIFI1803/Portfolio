import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { skills as localSkills, education as localEducation } from '../content'

const Stack = () => {
  const skills = useContent('skills', localSkills)
  const education = useContent('education', localEducation)

  const certs = education.filter(e => e.type === 'certification')
  const study = education.filter(e => e.type === 'education')

  return (
    <Section id="stack" ground="light" className="border-t border-rule">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">Stack</h2>
      </Reveal>

      <div className="mt-14 space-y-8">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={i * 60}>
            <div className="grid gap-3 border-t border-rule pt-5 md:grid-cols-[220px_1fr] md:gap-8">
              <p className="meta">{group.group}</p>
              <p className="text-[16px] text-ink-2">{group.items.join('  ·  ')}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <Reveal>
          <h3 className="display text-[30px]">Education</h3>
          <ul className="mt-6 space-y-6">
            {study.map(item => (
              <li key={item.id} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">{item.title}</p>
                <p className="meta mt-1">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <h3 className="display text-[30px]">Certifications</h3>
          <ul className="mt-6 space-y-6">
            {certs.map(item => (
              <li key={item.id} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">
                  {item.verify_url ? (
                    <a href={item.verify_url} target="_blank" rel="noreferrer"
                       className="border-b border-rule pb-0.5 hover:border-ink">
                      {item.title}
                    </a>
                  ) : item.title}
                </p>
                <p className="meta mt-1">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

export default Stack
