import Navigation from './Navigation'
import Hero from './sections/Hero'
import Work from './sections/Work'
import About from './sections/About'
import Background from './sections/Background'
import Now from './sections/Now'
import Notes from './sections/Notes'
import Contact from './sections/Contact'
import Footer from './components/Footer'

const App = () => (
  <div className="min-h-screen bg-paper text-ink">
    <a href="#main"
       className="meta sr-only bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">
      Skip to content
    </a>
    <Navigation />
    <main id="main">
      <Hero />
      <Work />
      <About />
      <Background />
      <Now />
      <Notes />
      <Contact />
    </main>
    <Footer />
  </div>
)

export default App
