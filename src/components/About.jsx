import React from 'react'
import './About.css'

const About = () => {
  const skills = [
    'React & Redux',
    'JavaScript',
    'HTML5 & CSS3',
    'SASS & Tailwind CSS',
    'Next.js',
    'Node.js & Express.js',
    'Python & Django',
    'PostgreSQL & MongoDB',
    'RESTful APIs & GraphQL',
    'Firebase & MySQL',
    'Git & GitHub',
    'Docker & CI/CD',
    'AWS'
  ]

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="fade-in">
          <h2 className="section-title">Building Seamless Digital Experiences, End-to-End</h2>
          <p className="section-subtitle">
            Full-Stack Software Developer & Designer
          </p>
        </div>
        
        <div className="about-content slide-up">
          <div className="about-image">
            <div className="profile-card">
              <div className="profile-photo">
                <span>IG</span>
              </div>
              <div className="profile-info">
                <h3>Ibrahim Githinji</h3>
                <p>Full-Stack Software Developer & Designer</p>
              </div>
            </div>
          </div>
          
          <div className="about-text">
            <div className="about-description">
              <p>
                I'm a Full-Stack Software Developer with expertise across both front-end and back-end development.
                I specialize in creating responsive, scalable, and intuitive digital products using modern technologies such as:
              </p>
              <p>
                <strong>Front-End:</strong> React, Redux, JavaScript, HTML5, CSS3, SASS, Tailwind CSS, Next.js
              </p>
              <p>
                <strong>Back-End:</strong> Node.js, Express.js, Python, Django, RESTful APIs, GraphQL
              </p>
              <p>
                <strong>Databases & Storage:</strong> PostgreSQL, MongoDB, MySQL, Firebase
              </p>
              <p>
                <strong>DevOps & Tools:</strong> Git, GitHub, Docker, CI/CD pipelines, AWS
              </p>
              <p>
                My work blends technical depth with a designer's eye for detail. I focus on crafting interfaces that feel natural,
                performant, and user-centric—while ensuring the underlying architecture is secure, efficient, and scalable.
              </p>
              <p>
                I'm passionate about understanding how systems work, from UI interactions down to server logic and deployment workflows.
                In today's job market, full-stack developers are expected to deliver across the entire product lifecycle—designing clean UI/UX,
                writing reliable APIs, managing databases, and integrating modern tooling. I embrace that challenge by continuously learning,
                building, and refining systems that balance functionality, performance, and great user experience.
              </p>
              <p>
                My goal is simple: turn ideas into polished, production-ready experiences that people love to use.
              </p>
            </div>
            
            <div className="skills-section">
              <h3>Technical Expertise</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="experience-highlights">
              <h3>What I Do</h3>
              <ul className="highlights-list">
                <li>
                  <strong>Full-Stack Development:</strong> Building complete web applications from responsive front-end interfaces to robust back-end APIs and databases
                </li>
                <li>
                  <strong>UI/UX Design:</strong> Creating intuitive user interfaces with focus on user experience and visual design
                </li>
                <li>
                  <strong>System Architecture:</strong> Designing scalable, secure, and efficient system architectures
                </li>
                <li>
                  <strong>DevOps & Deployment:</strong> Implementing CI/CD pipelines, containerization, and cloud deployment strategies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About