import Reveal from '../components/Reveal'
import { profile } from '../content'

const Hero = () => (
  <div id="top" className="w-full bg-paper">
    <div className="mx-auto max-w-[1240px] px-6 pb-28 pt-20 md:px-10 md:pb-36 md:pt-28 lg:px-14 lg:pb-44 lg:pt-32">
      <Reveal>
        <p className="meta text-ink-3">Available for select opportunities</p>
        <p className="meta text-ink-3">Software Developer / Dublin</p>
      </Reveal>

      <Reveal delay={80}>
        {/* Owns the fold now that the portrait is gone, so it runs full width. */}
        <h1 className="display mt-8 text-[clamp(3.25rem,13vw,11rem)] text-ink">
          Filip Galach
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-14 grid gap-10 border-t border-rule pt-10 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <p className="measure text-[19px] leading-[1.6] text-ink-2">
              Building thoughtful enterprise products and modern web experiences
              with clarity, reliability, and purpose.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#work"
                 className="bg-ink px-6 py-3 text-[15px] text-paper transition-opacity hover:opacity-85">
                View work
              </a>
              <a href={profile.cv} download
                 className="border border-rule px-6 py-3 text-[15px] text-ink transition-colors hover:border-ink">
                Download CV
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 lg:grid-cols-1 lg:gap-y-5">
            {[
              ['Currently', `${profile.employer} ${profile.team}`],
              ['Based', profile.location],
              ['Since', profile.since],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="meta text-ink-3">{label}</dt>
                <dd className="mt-1 text-[15px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  </div>
)

export default Hero
