/**
 * Enhanced Projects Component
 * Comprehensive implementation with robust error handling, caching,
 * retry logic, and responsive design for GitHub repositories.
 */

import React, { useState } from 'react'
import ProjectCard from './ProjectCard'
import FeaturedProjects from './FeaturedProjects'
import GitHubErrorBoundary from './GitHubErrorBoundary'
import useGitHubRepositories from '../hooks/useGitHubRepositories'
import { githubApi } from '../services/githubApi'
import './Projects.css'
import './GitHubErrorBoundary.css'

const EnhancedProjects = () => {
  const [username] = useState('Ibrahimgithinji')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('updated')
  const [showDebug, setShowDebug] = useState(false)
  
  // Enhanced GitHub repositories hook with comprehensive options
  const {
    repositories,
    error,
    loading,
    retryCount,
    lastFetch,
    cacheStats,
    isEmpty,
    hasData,
    canRetry,
    retry,
    refresh,
    clearCache,
    testApi,
    apiHealth
  } = useGitHubRepositories(username, {
    sort: sortBy,
    per_page: 12,
    includeForks: false,
    includePrivate: false,
    autoRefresh: false,
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000
    }
  })

  // Featured projects data
  const featuredProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tech: ["React", "Node.js", "MongoDB", "Express"],
      githubUrl: "https://github.com/Ibrahimgithinji",
      liveUrl: "https://example.com",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      tech: ["React", "Firebase", "Material-UI", "Redux"],
      githubUrl: "https://github.com/Ibrahimgithinji",
      liveUrl: "https://example.com",
      featured: true
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics using multiple APIs.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      tech: ["React", "JavaScript", "API Integration", "Chart.js"],
      githubUrl: "https://github.com/Ibrahimgithinji",
      liveUrl: "https://example.com",
      featured: true
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website showcasing projects and skills with smooth animations and optimized performance.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tech: ["React", "CSS3", "JavaScript", "Vite"],
      githubUrl: "https://github.com/Ibrahimgithinji",
      liveUrl: "https://example.com",
      featured: true
    }
  ]

  // Enhanced API test function
  const handleTestAPI = async () => {
    try {
      console.log('🧪 Testing GitHub API connectivity...')
      const health = await testApi()
      
      if (health.status === 'healthy') {
        alert(`✅ API Test Successful!\n\nLatency: ${health.latency}ms\nRate Limit Remaining: ${health.rateLimitRemaining}\nTimestamp: ${health.timestamp}`)
      } else {
        alert(`❌ API Test Failed!\n\nError: ${health.error}\nRate Limit Remaining: ${health.rateLimitRemaining}\nTimestamp: ${health.timestamp}`)
      }
    } catch (error) {
      console.error('❌ API Test Error:', error)
      alert(`❌ API Test Failed: ${error.userMessage}`)
    }
  }

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  // Format last fetch time
  const formatLastFetch = (timestamp) => {
    if (!timestamp) return 'Never'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return date.toLocaleDateString()
  }

  // Render repository grid
  const renderRepositoryGrid = () => {
    if (repositories.length === 0) {
      return (
        <div className="no-repos">
          <p>No repositories found.</p>
          <p className="no-repos-hint">
            This might be because the user has no public repositories or they are all forks.
          </p>
        </div>
      )
    }

    return (
      <div className={`repositories-grid ${viewMode}`}>
        {repositories.map(repo => (
          <ProjectCard key={repo.id} repo={repo} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  // Render debug information
  const renderDebugInfo = () => {
    if (!showDebug) return null

    return (
      <div className="debug-panel">
        <h4>🔧 Debug Information</h4>
        <div className="debug-grid">
          <div className="debug-section">
            <h5>API Status</h5>
            <p><strong>Rate Limit Remaining:</strong> {apiHealth.rateLimitRemaining}</p>
            <p><strong>Is Rate Limited:</strong> {apiHealth.isRateLimited ? 'Yes' : 'No'}</p>
            <p><strong>Reset Time:</strong> {new Date(apiHealth.rateLimitReset).toLocaleString()}</p>
          </div>
          
          <div className="debug-section">
            <h5>Cache Info</h5>
            <p><strong>Cache Size:</strong> {cacheStats?.size || 0}</p>
            <p><strong>Last Fetch:</strong> {formatLastFetch(lastFetch)}</p>
            <p><strong>Retry Count:</strong> {retryCount}</p>
          </div>
          
          <div className="debug-section">
            <h5>Network</h5>
            <p><strong>Online:</strong> {navigator.onLine ? '🟢 Yes' : '🔴 No'}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.split(' ')[0]}</p>
            <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
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
          <FeaturedProjects projects={featuredProjects} />
        </div>

        {/* GitHub Repositories Section */}
        <div className="github-projects-section slide-up">
          <div className="github-section-header">
            <div className="title-controls">
              <h3 className="subsection-title">GitHub Repositories</h3>
              {hasData && (
                <span className="repo-count">
                  {repositories.length} repository{repositories.length !== 1 ? 'ies' : ''}
                </span>
              )}
            </div>
            
            <div className="github-controls">
              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="List view"
                >
                  ☰
                </button>
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
                disabled={loading}
              >
                <option value="updated">Recently Updated</option>
                <option value="stars">Most Stars</option>
                <option value="forks">Most Forks</option>
                <option value="created">Newest First</option>
                <option value="size">Largest First</option>
              </select>

              {/* Control Buttons */}
              <button 
                onClick={handleTestAPI}
                className="btn btn-secondary btn-small"
                title="Test GitHub API connectivity"
                disabled={loading}
              >
                🔧 Test API
              </button>
              
              <button 
                onClick={refresh}
                className="btn btn-secondary btn-small"
                title="Refresh repositories"
                disabled={loading}
              >
                {loading ? '⏳' : '🔄'} Refresh
              </button>
              
              <button 
                onClick={retry}
                className="btn btn-primary btn-small"
                disabled={loading || !canRetry}
                title="Retry loading repositories"
              >
                {loading ? '⏳' : '🔄'} Retry
              </button>
            </div>
          </div>

          {/* Error Boundary Wrapper */}
          <GitHubErrorBoundary onRetry={retry}>
            {/* Loading State */}
            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading repositories...</p>
                <p className="loading-hint">
                  {retryCount > 0 ? `Retry attempt ${retryCount}/3` : 'Fetching from GitHub API'}
                </p>
                {apiHealth.isRateLimited && (
                  <p className="rate-limit-warning">
                    ⚠️ Rate limited. Reset in {Math.ceil(apiHealth.timeUntilReset / 60000)} minutes.
                  </p>
                )}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="error enhanced-error">
                <div className="error-header">
                  <h4>⚠️ Unable to Load GitHub Repositories</h4>
                  <span className={`error-type ${error.type}`}>
                    {error.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="error-message">{error.userMessage}</p>
                
                {error.retryAfter && (
                  <p className="error-retry-after">
                    ℹ️ Rate limit resets in approximately {Math.ceil(error.retryAfter / 60)} minutes
                  </p>
                )}
                
                <div className="error-actions">
                  {canRetry && (
                    <button 
                      onClick={retry}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Retrying...' : 'Try Again'}
                    </button>
                  )}
                  
                  <button 
                    onClick={refresh}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    🔄 Force Refresh
                  </button>
                  
                  <button 
                    onClick={handleTestAPI}
                    className="btn btn-secondary"
                  >
                    🔧 Test API
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {!loading && !error && renderRepositoryGrid()}
          </GitHubErrorBoundary>

          {/* Debug Panel Toggle */}
          <div className="debug-toggle">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="btn btn-secondary btn-small"
            >
              {showDebug ? '🔒 Hide Debug' : '🔓 Show Debug'}
            </button>
          </div>

          {/* Debug Information */}
          {renderDebugInfo()}
        </div>
      </div>
    </section>
  )
}

export default EnhancedProjects