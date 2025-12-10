import React, { useState, useEffect } from 'react'
import './Projects.css'

const Projects = () => {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [abortController, setAbortController] = useState(null)

  // AbortController cleanup function
  const cleanupRequest = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  // Enhanced error handling with exponential backoff
  const handleError = (error, isRetry = false) => {
    if (error.name === 'AbortError') {
      return // Don't handle aborted requests as errors
    }

    let errorMessage = 'Unable to fetch repositories. Please try again later.'
    let canRetry = true

    // Check for specific error types
    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
      errorMessage = 'Network connection error. Please check your internet connection and try again.'
    } else if (error.message.includes('403') || error.message.includes('rate limit')) {
      errorMessage = 'GitHub API rate limit exceeded. Please wait a few minutes before trying again.'
      canRetry = false
    } else if (error.message.includes('404')) {
      errorMessage = 'GitHub user not found. Please verify the username is correct.'
      canRetry = false
    }

    setError({ message: errorMessage, canRetry })
    
    // Exponential backoff for retries
    if (isRetry && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
      setTimeout(() => {
        fetchRepositories(retryCount + 1)
      }, delay)
    }
  }

  // Main repository fetching function
  const fetchRepositories = async (currentRetryCount = 0) => {
    // Cleanup any existing request
    cleanupRequest()
    
    // Create new AbortController for this request
    const controller = new AbortController()
    setAbortController(controller)

    try {
      setError(null)
      setLoading(currentRetryCount === 0) // Only show loading on initial fetch

      const username = 'Ibrahimgithinji'
      const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Ibrahim-Portfolio-Website'
        },
        signal: controller.signal
      })

      if (!response.ok) {
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
          if (rateLimitRemaining === '0') {
            throw new Error('403: Rate limit exceeded')
          }
        }
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Process and filter repositories
      const processedRepos = data
        .filter(repo => !repo.fork && !repo.private) // Only public, non-fork repos
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by updated_at desc
        .slice(0, 6) // Limit to 6 most recent
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || 'No description available',
          topics: repo.topics || [],
          html_url: repo.html_url,
          homepage: repo.homepage,
          updated_at: repo.updated_at,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count
        }))

      setRepositories(processedRepos)
      setRetryCount(0)
      
    } catch (error) {
      handleError(error, currentRetryCount > 0)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchRepositories()
    
    return () => {
      cleanupRequest()
    }
  }, [])

  // Retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchRepositories(retryCount + 1)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Truncate description text
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <div className="fade-in">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            A showcase of my recent work and GitHub repositories
          </p>
        </div>

        {/* Featured Projects */}
        <div className="featured-projects-section slide-up">
          <h3 className="subsection-title">Featured Projects</h3>
          <div className="featured-projects-grid">
            <div className="featured-project-card">
              <h4>E-Commerce Platform</h4>
              <p>Full-stack e-commerce solution with React, Node.js, and MongoDB. Features user authentication, product management, shopping cart, and payment integration.</p>
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">MongoDB</span>
              </div>
            </div>
            <div className="featured-project-card">
              <h4>Task Management App</h4>
              <p>Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.</p>
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">Firebase</span>
                <span className="tag">Material-UI</span>
              </div>
            </div>
            <div className="featured-project-card">
              <h4>Weather Dashboard</h4>
              <p>Beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics using multiple APIs.</p>
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">JavaScript</span>
                <span className="tag">API Integration</span>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Repositories */}
        <div className="github-projects-section slide-up">
          <h3 className="subsection-title">GitHub Repositories</h3>
          
          {loading && (
            <div className="repositories-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="repository-card skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-tags">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                  </div>
                  <div className="skeleton-footer"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error.message}</p>
              {error.canRetry && (
                <button 
                  onClick={handleRetry}
                  className="retry-button"
                  disabled={loading}
                >
                  {loading ? 'Retrying...' : 'Try Again'}
                </button>
              )}
            </div>
          )}

          {!loading && !error && repositories.length > 0 && (
            <div className="repositories-grid">
              {repositories.map(repo => (
                <div key={repo.id} className="repository-card">
                  <div className="repository-header">
                    <h4 className="repository-name">
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        {repo.name}
                      </a>
                    </h4>
                    {repo.language && (
                      <span className="language-badge">{repo.language}</span>
                    )}
                  </div>
                  
                  <p className="repository-description">
                    {truncateText(repo.description)}
                  </p>
                  
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="repository-topics">
                      {repo.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="repository-footer">
                    <div className="repo-stats">
                      <span className="stat">
                        ⭐ {repo.stargazers_count}
                      </span>
                      <span className="stat">
                        🍴 {repo.forks_count}
                      </span>
                    </div>
                    <div className="repo-links">
                      {repo.homepage && (
                        <a 
                          href={repo.homepage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="demo-link"
                        >
                          Live Demo
                        </a>
                      )}
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                      >
                        View Code
                      </a>
                    </div>
                  </div>
                  
                  <div className="repository-updated">
                    Updated {formatDate(repo.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && repositories.length === 0 && (
            <div className="no-repositories">
              <p>No repositories found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Projects