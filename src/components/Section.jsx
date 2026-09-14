/**
 * Full-width band with the page gutter and a 12-column grid inside.
 *
 * `index` + `title` render the editorial section header: a mono index on the
 * left, the display title spanning the rest. Children land on the same grid,
 * so each section places its own content with `col-span` / `col-start`.
 */
const Section = ({ id, index, title, className = '', children }) => (
  <section id={id} className={`w-full border-t border-rule px-gutter ${className}`}>
    <div className="mx-auto w-full max-w-[1600px] py-20 md:py-28 lg:py-36">
      {title && (
        <header className="mb-14 grid grid-cols-12 gap-x-5 md:mb-20 lg:mb-24">
          <p className="meta col-span-12 text-ink-2 md:col-span-2">{index}</p>
          <h2 className="display col-span-12 mt-3 text-[clamp(2.75rem,8vw,7.5rem)] text-ink md:col-span-10 md:mt-0">
            {title}
          </h2>
        </header>
      )}
      {children}
    </div>
  </section>
)

export default Section
