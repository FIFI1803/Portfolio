const CaseRow = ({ project, index, flip = false }) => (
  <article className="grid gap-10 border-t border-noir-rule pt-14 lg:grid-cols-2 lg:gap-16">
    <div className={flip ? 'lg:order-2' : ''}>
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={`${project.name} interface`}
          loading="lazy"
          decoding="async"
          className="w-full border border-noir-rule bg-noir-2 object-cover"
        />
      ) : (
        /* Designed typographic state, not a placeholder — no screenshot needed. */
        <div className="flex aspect-[4/3] flex-col justify-between border border-noir-rule bg-noir-2 p-8">
          <span className="meta text-noir-ink-3">{String(index + 1).padStart(2, '0')}</span>
          <span className="display text-[clamp(1.75rem,4vw,3rem)] text-noir-ink">
            {project.name}
          </span>
          <span className="meta text-noir-ink-3">{(project.tags || []).join('  ·  ')}</span>
        </div>
      )}
    </div>

    <div className={flip ? 'lg:order-1' : ''}>
      <p className="meta text-noir-ink-3">{String(index + 1).padStart(2, '0')}</p>

      <h3 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-noir-ink">
        {project.name}
      </h3>

      <p className="measure mt-6 text-[17px] text-noir-ink-2">{project.description}</p>

      <p className="meta mt-8 text-noir-ink-3">{(project.tags || []).join('  ·  ')}</p>

      {project.link && project.link !== '#' && (
        <a href={project.link} target="_blank" rel="noreferrer"
           className="mt-6 inline-block border-b border-noir-ink-3 pb-1 text-[15px] text-noir-ink transition-colors hover:border-noir-ink">
          Visit {project.name}
        </a>
      )}
    </div>
  </article>
)

export default CaseRow
