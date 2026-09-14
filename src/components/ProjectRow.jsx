import ProjectVisual from './ProjectVisual'

const pad = (n) => String(n).padStart(2, '0')

/**
 * One editorial case-study row. The whole row is the hover target: text
 * shifts right, the visual scales, the arrow nudges. When the project has a
 * link the row is that link; otherwise it's a plain article.
 */
const ProjectRow = ({ project, index, total }) => {
  const Wrapper = project.link ? 'a' : 'div'
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noreferrer', 'aria-label': `${project.name} — open project` }
    : {}

  return (
    <article className="border-t border-rule">
      <Wrapper
        {...wrapperProps}
        className="group grid grid-cols-12 gap-x-5 gap-y-8 py-10 outline-offset-[-2px] md:py-14 lg:py-16"
      >
        <div className="meta tabular col-span-12 flex justify-between text-ink-2 md:col-span-2 md:row-start-1 md:block">
          <p>{pad(index + 1)} / {pad(total)}</p>
          {project.year && <p className="md:mt-1">{project.year}</p>}
        </div>

        <div className="col-span-12 transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.24,1)] group-hover:translate-x-2 md:col-span-6 md:col-start-3 md:row-span-2 md:row-start-1 lg:col-span-6 lg:col-start-3">
          <h3 className="display flex items-start gap-3 text-[clamp(2.5rem,5.6vw,5rem)] text-ink">
            <span>{project.name}</span>
            <span className="arrow mt-[0.18em] text-[0.42em] font-medium text-ink-2" aria-hidden="true">↗</span>
          </h3>
          {project.kind && <p className="mt-3 text-[15px] text-ink-2">{project.kind}</p>}
          <p className="measure mt-6 text-[16px] leading-[1.55] text-ink md:mt-8">
            {project.description}
          </p>
          <p className="meta mt-8 text-ink-2">{(project.tags || []).join('  ·  ')}</p>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1">
          <div className="aspect-[4/3] w-full overflow-hidden border border-rule">
            <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.24,1)] group-hover:scale-[1.03]">
              <ProjectVisual project={project} />
            </div>
          </div>
        </div>
      </Wrapper>
    </article>
  )
}

export default ProjectRow
