import Navigation from './Navigation'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Experience from './sections/Experience'
import About from './sections/About'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import Footer from './components/Footer'

const App = () => (
  <div className="min-h-screen bg-paper">
    <Navigation />
    <main>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Stack />
      <Contact />
    </main>
    <Footer />
  </div>
)

export default App
