import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './Navigation'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Contact from './Contact'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  return (
    <div className="flex flex-col bg-obsidian">
      <div className="relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255,92,43,0.10) 0%, transparent 70%)' }}
        />
        <Navigation />
        <Hero />
      </div>
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </div>
  )
}

export default App
