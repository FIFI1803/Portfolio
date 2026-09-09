import Reveal from '../components/Reveal'
import { profile } from '../content'

const Hero = () => (
  <div id="top" className="w-full bg-paper">
    <div className="mx-auto grid max-w-[1240px] gap-14 px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:px-14">
      <div>
        <Reveal>
          <h1 className="display text-[clamp(2.5rem,7.5vw,6.5rem)]">
            I build the internal tools
            <br />
            that SAP runs on.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="measure mt-8 text-[17px] text-ink-2">
            Software developer on the Software Asset Management team at SAP
            Ireland, working in SAP UI5, JavaScript and OData. Currently leading
            front-end development of the Publisher 360 Dashboard.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="meta mt-8">
            {profile.role} · {profile.employer} {profile.team} · {profile.location} · since {profile.since}
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#work"
               className="bg-ink px-6 py-3 text-[15px] text-paper transition-opacity hover:opacity-85">
              See the work
            </a>
            <a href={profile.cv} download
               className="border border-rule px-6 py-3 text-[15px] text-ink transition-colors hover:border-ink">
              Download CV
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={160} className="lg:pb-2">
        <picture>
          <source type="image/avif" srcSet="/img/portrait-hero-640.avif" />
          <source type="image/webp" srcSet="/img/portrait-hero-640.webp" />
          <img
            src="/img/portrait-hero-640.jpg"
            alt="Filip Galach"
            width="784"
            height="1332"
            loading="eager"
            decoding="async"
            className="w-full object-cover"
          />
        </picture>
      </Reveal>
    </div>
  </div>
)

export default Hero
