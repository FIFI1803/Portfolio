import React from 'react'
import Navigation from './Navigation'
import Hero from './Hero'

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <Hero />
    </div>
  )
}

export default App
