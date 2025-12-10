import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="fade-in">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </div>
        
        <div className="contact-content slide-up">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              I'm always interested in hearing about new opportunities, 
              interesting projects, and potential collaborations. 
              Feel free to reach out!
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div className="method-content">
                  <h4>Email</h4>
                  <p>ibragithy@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">📱</div>
                <div className="method-content">
                  <h4>Phone</h4>
                  <p>+254114411392</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">📍</div>
                <div className="method-content">
                  <h4>Location</h4>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <h4>Follow Me</h4>
              <div className="social-buttons">
                <a 
                  href="https://github.com/Ibrahimgithinji" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn github"
                >
                  <span className="social-icon">🐙</span>
                  GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/ibrahim-githinji-6933652a6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn linkedin"
                >
                  <span className="social-icon">💼</span>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="submit-message success">
                  Thank you for your message! I'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="submit-message error">
                  Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact