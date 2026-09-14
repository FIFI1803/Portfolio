import Section from '../components/Section'
import Reveal from '../components/Reveal'
import ProjectRow from '../components/ProjectRow'
import { useContent } from '../lib/useContent'
import { projects as localProjects } from '../content'

const Work = () => {
  const projects = useContent('projects', localProjects).filter(p => p.featured !== false)
  return (
  <Section id="work" index={`${projects.length} projects`} title="Selected Work">
    <div>
      {projects.map((project, i) => (
        <Reveal key={project.id}>
          <ProjectRow project={project} index={i} total={projects.length} />
        </Reveal>
      ))}
    </div>
  </Section>
  )
}

export default Work
