import React from 'react'
import './FeaturedProjects.css'

const FeaturedProjects = ({ projects }) => {
  return (
    <div className="featured-projects">
      {projects.map((project) => (
        <div key={project.id} className="featured-project-card">
          <div className="project-image">
            <img 
              src={project.image} 
              alt={project.title}
              loading="lazy"
            />
            <div className="project-overlay">
              <div className="project-actions">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View Code
                </a>
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
          
          <div className="project-content">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            
            <div className="project-tech">
              {project.tech.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedProjects