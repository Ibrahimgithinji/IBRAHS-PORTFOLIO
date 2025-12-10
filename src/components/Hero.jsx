import React, { useEffect, useState, useRef } from 'react'
import './Hero.css'

// Configuration object for easy modification
const ROLE_CONFIG = {
  roles: [
    'Software Developer',
    'Designer',
    'AI Enthusiast',
    'Machine Learning Expert',
    'Backend Developer',
    'Frontend Developer'
  ],
  animationDuration: {
    fadeIn: 600,    // milliseconds
    hold: 2500,     // milliseconds
    fadeOut: 600    // milliseconds
  },
  startDelay: 1200  // milliseconds before first role appears
}

// Role Rotation Component
const RoleRotation = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(-1) // Start with no role visible
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef(null)
  const animationTimeoutRef = useRef(null)

  const clearAllTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
  }

  const startRoleRotation = () => {
    const { roles, animationDuration } = ROLE_CONFIG
    const totalCycleTime = animationDuration.fadeIn + animationDuration.hold + animationDuration.fadeOut

    const showNextRole = () => {
      setCurrentRoleIndex((prevIndex) => {
        const nextIndex = prevIndex === roles.length - 1 ? 0 : prevIndex + 1
        console.log(`Role rotation: ${roles[prevIndex]} → ${roles[nextIndex]}`)
        return nextIndex
      })
      
      setIsAnimating(true)
      
      // Set animation complete after fadeIn duration
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, animationDuration.fadeIn)

      // Schedule next role change after full cycle
      timeoutRef.current = setTimeout(showNextRole, totalCycleTime)
    }

    // Start with first role after initial delay
    console.log('Starting role rotation with delay:', animationDuration.fadeIn, 'ms')
    timeoutRef.current = setTimeout(showNextRole, animationDuration.fadeIn)
  }

  useEffect(() => {
    // Start animation after delay
    const startTimer = setTimeout(() => {
      setIsVisible(true)
      startRoleRotation()
    }, ROLE_CONFIG.startDelay)

    return () => {
      clearTimeout(startTimer)
      clearAllTimers()
    }
  }, [])

  const { roles, animationDuration } = ROLE_CONFIG

  return (
    <div className="role-rotation">
      <div className="role-container">
        {roles.map((role, index) => (
          <span
            key={index}
            className={`role-item ${
              index === currentRoleIndex ? 'active' : ''
            } ${isVisible ? 'visible' : ''} ${
              isAnimating ? 'animating' : ''
            }`}
            style={{
              '--fade-duration': `${animationDuration.fadeIn}ms`,
              '--hold-duration': `${animationDuration.hold}ms`
            }}
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  )
}


const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="container">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-name">Ibrahim Githinji</span>
            </h1>
            <RoleRotation />
            <p className="hero-description">
              Crafting intuitive digital experiences with clean code and thoughtful design. 
              I specialize in React, JavaScript, and creating responsive, high-performance web applications.
            </p>
            
            <div className="hero-buttons">
              <a 
                href="https://github.com/Ibrahimgithinji" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="icon-github"></i>
                View GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/ibrahim-githinji-6933652a6/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <i className="icon-linkedin"></i>
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="profile-placeholder">
              <div className="profile-image">
                <span>IG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  )
}

export default Hero