import Section from '../components/Section'
import Reveal from '../components/Reveal'

const About = () => (
  <Section id="about" ground="light" className="border-t border-rule">
    <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <Reveal>
        <picture>
          <source
            type="image/avif"
            srcSet="/img/portrait-about-640.avif 640w, /img/portrait-about-1280.avif 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/portrait-about-640.webp 640w, /img/portrait-about-1280.webp 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <img
            src="/img/portrait-about-1280.jpg"
            alt="Filip Galach"
            width="1280"
            height="853"
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </picture>
      </Reveal>

      <div>
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">About</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="measure mt-8 space-y-5 text-[17px] text-ink-2">
            <p>
              I'm 22, based in Dublin, and two years into an ICT Associate
              Professional apprenticeship at DDLETB Tallaght — a Level 6
              programme that puts me in college and at SAP at the same time.
            </p>
            <p>
              Before this I spent two years as a Duty Manager at SSP, running
              shifts and a team of ten. I moved into software through self-study
              and IBM SkillsBuild certifications, and the management job turned
              out to be better preparation than I expected — most of the work is
              still communication.
            </p>
            <p>
              Outside the office I run a Proxmox homelab on Docker, Portainer and
              Tailscale, which is where most of what I know about networking and
              containers actually came from.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </Section>
)

export default About
