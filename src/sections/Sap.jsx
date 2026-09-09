import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { experience as localExperience } from '../content'

const Sap = () => {
  const roles = useContent('experience', localExperience)
  const sap = roles.find(r => r.id === 'sap') ?? roles[0]
  const rest = roles.filter(r => r !== sap)

  return (
    <Section id="sap" ground="light">
      <Reveal>
        <p className="meta">{sap.period} · {sap.location}</p>
        <h2 className="display mt-4 text-[clamp(2.25rem,6vw,4.5rem)]">At SAP</h2>
        <p className="measure mt-6 text-[17px] text-ink-2">
          {sap.role} on the {sap.team} team, building internal Fiori
          applications used across the business.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {sap.highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 80}>
            <div className="border-t border-rule pt-6">
              <h3 className="display text-[26px]">{h.title}</h3>
              <p className="mt-3 text-[16px] text-ink-2">{h.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <ul className="mt-16 space-y-3 border-t border-rule pt-8">
          {sap.detail.map(d => (
            <li key={d} className="meta measure text-ink-3">{d}</li>
          ))}
        </ul>
      </Reveal>

      {rest.map(role => (
        <Reveal key={role.id}>
          <div className="mt-16 border-t border-rule pt-8">
            <p className="meta">{role.period} · {role.location}</p>
            <h3 className="display mt-2 text-[26px]">{role.role} — {role.company}</h3>
            <ul className="mt-4 space-y-2">
              {role.detail.map(d => (
                <li key={d} className="measure text-[16px] text-ink-2">{d}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </Section>
  )
}

export default Sap
