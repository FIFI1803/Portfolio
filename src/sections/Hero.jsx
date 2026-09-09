import Reveal from '../components/Reveal'
import { profile } from '../content'

const Hero = () => (
  <div id="top" className="w-full bg-paper">
    <div className="mx-auto grid max-w-[1240px] gap-14 px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:px-14">
      <div>
        <Reveal>
          <p className="meta">Available for select opportunities</p>
          <p className="meta mt-2">Software Developer / Dublin</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="display mt-6 text-[clamp(3rem,9vw,7.5rem)]">
            Filip Galach
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="measure mt-8 border-t border-rule pt-8 text-[17px] text-ink-2">
            Building thoughtful enterprise products and modern web experiences
            with clarity, reliability, and purpose.
          </p>
        </Reveal>

        <Reveal delay={220}>
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
        </Reveal>
      </div>

      <Reveal delay={140} className="lg:pb-2">
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
