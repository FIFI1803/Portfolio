import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { experience as localExperience } from '../content'

const Experience = () => {
  const roles = useContent('experience', localExperience)

  return (
    <Section id="experience" ground="light">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-ink">Where I&rsquo;ve worked</h2>
      </Reveal>

      <div className="mt-16 space-y-16">
        {roles.map((role) => (
          <Reveal key={role.id ?? role.role}>
            <div className="grid gap-6 border-t border-rule pt-8 lg:grid-cols-[280px_1fr] lg:gap-12">
              <div>
                <h3 className="display text-[26px] text-ink">{role.role}</h3>
                <p className="mt-2 text-[16px] text-ink-2">{role.company}</p>
                <p className="meta mt-2 text-ink-3">{role.period}</p>
                <p className="meta text-ink-3">{role.location}</p>
              </div>

              <ul className="space-y-4">
                {(role.bullets || []).map((b) => (
                  <li key={b} className="measure text-[16px] text-ink-2">{b}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export default Experience
