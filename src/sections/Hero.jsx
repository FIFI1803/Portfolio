import { useSite } from '../lib/useContent'
import { site as localSite } from '../content'

const Hero = () => {
  const site = useSite(localSite)
  const facts = [
    ['Role', site.role],
    ['Company', site.company],
    ['Focus', site.focus],
    ['Based', site.location],
  ]

  return (
  <div id="top" className="w-full px-gutter">
    <div className="mx-auto flex md:min-h-[calc(100svh-3.5rem)] max-w-[1600px] flex-col justify-between pb-10 pt-16 md:pb-14 md:pt-24 lg:pt-28">
      <div className="grid grid-cols-12 gap-x-5">
        <div className="meta col-span-12 flex flex-col justify-between text-ink-2 md:col-span-2">
          <p>Software Developer<br />Builder<br />Creative</p>
          {site.availability && (
            <p className="mt-6 hidden md:block">
              <span className="mr-2 inline-block h-2 w-2 bg-accent align-middle" aria-hidden="true" />
              {site.availability}
            </p>
          )}
        </div>

        <h1 className="display col-span-12 mt-10 text-[18vw] md:text-[clamp(4.5rem,16vw,15rem)] text-ink md:col-span-10 md:mt-0">
          <span className="rise"><span>Filip</span></span>
          <span className="rise" style={{ '--rise-delay': '90ms' }}>
            <span>Galach<span className="text-accent">.</span></span>
          </span>
        </h1>
      </div>

      <div className="mt-20 grid grid-cols-12 gap-x-5 gap-y-10 border-t border-rule pt-8 md:mt-28 lg:mt-36">
        <p className="col-span-12 max-w-[26em] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.35] tracking-[-0.01em] text-ink md:col-span-6 lg:col-span-5">
          {site.tagline}
        </p>

        <dl className="col-span-12 grid grid-cols-2 gap-x-5 gap-y-6 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7 lg:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="border-t border-rule pt-3">
              <dt className="meta text-ink-2">{label}</dt>
              <dd className="mt-1 text-[15px] leading-snug text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
  )
}

export default Hero
