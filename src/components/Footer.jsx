import React, { useEffect, useRef, useState } from 'react'
import './Footer.css'

const Footer = () => {
  const footerRef = useRef(null)
  const taglineRef = useRef(null)
  const socialRef = useRef(null)
  const copyrightRef = useRef(null)
  const gradientLineRef = useRef(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const [showShimmer, setShowShimmer] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Trigger shimmer effect after gradient line becomes visible
          setTimeout(() => {
            setShowShimmer(true)
            // Remove shimmer effect after 2 seconds
            setTimeout(() => {
              setShowShimmer(false)
            }, 2000)
          }, 500)
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className={`footer ${isVisible ? 'visible' : ''}`}
      ref={footerRef}
      role="contentinfo"
    >
      {/* Animated Gradient Accent Line */}
      <div 
        className={`footer-gradient-line ${showShimmer ? 'shimmer' : ''}`}
        ref={gradientLineRef}
        aria-hidden="true"
      ></div>
      
      <div className="container">
        <div className="footer-grid">
          {/* Section 1: Tagline */}
          <div className="footer-tagline" ref={taglineRef}>
            <h2 className="tagline-text">Connect with me</h2>
          </div>
          
          {/* Section 2: Social Icons */}
          <div className="footer-social" ref={socialRef}>
            <div className="social-icons">
              <a 
                href="https://github.com/Ibrahimgithinji" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="Visit my GitHub profile"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" role="img" aria-label="GitHub icon">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="social-text">GitHub</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/ibrahim-githinji-6933652a6/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="Visit my LinkedIn profile"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" role="img" aria-label="LinkedIn icon">
                  <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="social-text">LinkedIn</span>
              </a>
              
              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link email-link"
                aria-label="Send me an email via Gmail"
                title="Send me an email"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" role="img" aria-label="Email icon">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="social-text">Email</span>
              </a>
            </div>
          </div>
          
          {/* Section 3: Copyright */}
          <div className="footer-copyright" ref={copyrightRef}>
            <p className="copyright-text">
              © {currentYear} Ibrahim Githinji — Software Developer
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer