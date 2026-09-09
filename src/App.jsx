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
        <div className="site-shell flex flex-col bg-obsidian overflow-x-clip">
            <Navigation />
            <main>
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Contact />
            </main>
        </div>
    )
}

export default App
