import React from 'react'
import './ProjectCard.css'

const ProjectCard = ({ repo }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateDescription = (description, maxLength = 120) => {
    if (!description) return 'No description available.'
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
          >
            {repo.name}
          </a>
        </h3>
        <div className="project-meta">
          {repo.language && (
            <span className="language-tag">
              <span className="language-dot"></span>
              {repo.language}
            </span>
          )}
          <span className="updated-date">
            Updated {formatDate(repo.updated_at)}
          </span>
        </div>
      </div>
      
      <p className="project-description">
        {truncateDescription(repo.description)}
      </p>
      
      <div className="project-topics">
        {repo.topics && repo.topics.slice(0, 3).map((topic, index) => (
          <span key={index} className="topic-tag">
            {topic}
          </span>
        ))}
        {repo.topics && repo.topics.length > 3 && (
          <span className="topic-count">+{repo.topics.length - 3} more</span>
        )}
      </div>
      
      <div className="project-footer">
        <div className="project-stats">
          {repo.stargazers_count > 0 && (
            <span className="stat">
              ⭐ {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="stat">
              🍴 {repo.forks_count}
            </span>
          )}
        </div>
        
        <div className="project-actions">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View Code
          </a>
          {repo.homepage && (
            <a 
              href={repo.homepage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard