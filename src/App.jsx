import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  useEffect(() => {
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up')
    animatedElements.forEach(el => observer.observe(el))

    return () => {
      animatedElements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App