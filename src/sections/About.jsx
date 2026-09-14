import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useSite } from '../lib/useContent'
import { site as localSite } from '../content'

/* Body copy is one text field; blank lines separate paragraphs. */
const paragraphs = (text) => String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

const About = () => {
  const site = useSite(localSite)

  return (
    <Section id="about" index="Background" title="About Me">
      <div className="grid grid-cols-12 gap-x-5 gap-y-14">
        <Reveal className="col-span-12 md:col-span-10 md:col-start-3 lg:col-span-8 lg:col-start-3">
          <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ink">
            {site.about_statement}
          </p>
        </Reveal>

        <Reveal delay={80} className="col-span-12 md:col-span-4 md:col-start-3 lg:col-span-3 lg:col-start-3">
          <figure className="grayscale">
            <picture>
              <source
                type="image/avif"
                srcSet="/img/portrait-about-640.avif 640w, /img/portrait-about-1280.avif 1280w"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
              />
              <source
                type="image/webp"
                srcSet="/img/portrait-about-640.webp 640w, /img/portrait-about-1280.webp 1280w"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
              />
              <img
                src="/img/portrait-about-1280.jpg"
                alt="Filip Galach"
                width="1280"
                height="853"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full border border-rule object-cover object-top"
              />
            </picture>
          </figure>
        </Reveal>

        <Reveal delay={120} className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
          <div className="measure space-y-5 text-[16px] leading-[1.6] text-ink">
            {paragraphs(site.about_body).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export default About
