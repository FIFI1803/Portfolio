import Navigation from './Navigation'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Sap from './sections/Sap'
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
      <Sap />
      <About />
      <Stack />
      <Contact />
    </main>
    <Footer />
  </div>
)

export default App
