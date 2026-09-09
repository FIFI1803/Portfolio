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
          <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-ink">
            Building enterprise software from Dublin
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="measure mt-8 space-y-5 text-[17px] text-ink-2">
            <p>
              I&rsquo;m Filip — a Software Developer at SAP Ireland on the Software
              Asset Management team. I build internal Fiori applications using SAP
              UI5, JavaScript, and OData, currently leading front-end development
              for the Publisher 360 Dashboard. Across three major projects,
              I&rsquo;ve shipped features ranging from a 79-case UAT plan for a
              Forecasting app to a custom Variable Management system that replaced
              rigid static filters with a flexible, user-driven solution.
            </p>
            <p>
              I&rsquo;m currently completing a Level 6 ICT Apprenticeship
              (2024–2026), balancing academic study with daily enterprise
              development. Before the pivot to tech, I spent two years as a Duty
              Manager at SSP leading a team of 10 — a leadership background I now
              bring to my code. I made the switch through self-study and IBM
              SkillsBuild certifications.
            </p>
            <p>
              Outside the office, I run a Proxmox homelab and build side projects
              with React and Tailwind. When I&rsquo;m not at the terminal,
              you&rsquo;ll find me at the gym or out for a run.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </Section>
)

export default About
