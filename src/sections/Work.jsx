import Section from '../components/Section'
import Reveal from '../components/Reveal'
import CaseRow from '../components/CaseRow'
import { useContent } from '../lib/useContent'
import { projects as localProjects } from '../content'

const Work = () => {
  const projects = useContent('projects', localProjects)

  return (
    <Section id="work" ground="dark">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-noir-ink">
          Selected work
        </h2>
        <p className="measure mt-6 text-[17px] text-noir-ink-2">
          Three things I built end to end, and what each one was actually for.
        </p>
      </Reveal>

      <div className="mt-20 space-y-24">
        {projects.map((project, i) => (
          <Reveal key={project.id}>
            <CaseRow project={project} index={i} flip={i % 2 === 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export default Work
