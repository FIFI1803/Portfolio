import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent, useSite } from '../lib/useContent'
import { now as localNow, NOW_COLUMNS, site as localSite } from '../content'

const Now = () => {
  const items = useContent('now_items', localNow)
  const site = useSite(localSite)

  return (
    <Section id="now" index={site.now_updated ? `Updated ${site.now_updated}` : 'Now'} title="Right Now">
      <div className="grid grid-cols-12 gap-x-5 gap-y-12">
        {NOW_COLUMNS.map(([category, label], i) => {
          const list = items.filter(n => n.category === category)
          if (list.length === 0) return null
          return (
            <Reveal key={category} delay={i * 70}
                    className={`col-span-12 md:col-span-4 lg:col-span-3 ${i === 0 ? 'lg:col-start-3' : ''}`}>
              <h3 className="meta border-t border-ink pt-3 text-ink">{label}</h3>
              <ul className="mt-6">
                {list.map((n) => (
                  <li key={n.id} className="border-b border-rule py-3 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-tight tracking-[-0.015em] text-ink">
                    {n.item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

export default Now
