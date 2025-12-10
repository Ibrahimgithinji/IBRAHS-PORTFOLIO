/**
 * GitHub Repositories Error Boundary
 * Comprehensive error boundary specifically for GitHub API failures
 * with enhanced error reporting and recovery options.
 */

import React from 'react'
import { GitHubApiError } from '../services/githubApi'

class GitHubErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('GitHub Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
      timestamp: new Date().toISOString()
    })

    // Report error to external service if configured
    this.reportError(error, errorInfo)
  }

  reportError(error, errorInfo) {
    // This could be integrated with services like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorType: error.constructor.name
    }

    // Log to console for now (could be sent to external service)
    console.error('📊 Error Report:', errorReport)
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      showDetails: false
    }))

    // Trigger a reload of the component
    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  handleToggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }))
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const isGitHubError = error instanceof GitHubApiError
      
      // Different UI for GitHub API errors vs other errors
      if (isGitHubError) {
        return (
          <div className="github-error-boundary">
            <div className="error-container">
              <div className="error-header">
                <h3>🔌 GitHub API Connection Issue</h3>
                <span className={`error-badge ${error.type}`}>
                  {this.getErrorTypeLabel(error.type)}
                </span>
              </div>
              
              <div className="error-content">
                <p className="error-message">{error.message}</p>
                
                {error.retryAfter && (
                  <div className="retry-timer">
                    <p>⏰ Rate limit resets in: <strong>{this.formatRetryTime(error.retryAfter)}</strong></p>
                    <div className="timer-progress">
                      <div 
                        className="timer-bar" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="error-suggestions">
                  <h4>💡 Suggested Actions:</h4>
                  <ul>
                    {this.getSuggestions(error)}
                  </ul>
                </div>
              </div>
              
              <div className="error-actions">
                {error.type !== 'rate_limit' && (
                  <button 
                    onClick={this.handleRetry}
                    className="btn btn-primary"
                    disabled={this.state.retryCount >= 3}
                  >
                    {this.state.retryCount >= 3 ? '🔄 Max Retries Reached' : `🔄 Retry (${this.state.retryCount}/3)`}
                  </button>
                )}
                
                <button 
                  onClick={this.handleToggleDetails}
                  className="btn btn-secondary"
                >
                  {this.state.showDetails ? '📋 Hide Details' : '🔍 Show Details'}
                </button>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary"
                >
                  🔃 Reload Page
                </button>
              </div>
              
              {this.state.showDetails && this.renderErrorDetails()}
            </div>
          </div>
        )
      }

      // Fallback for non-GitHub errors
      return (
        <div className="github-error-boundary">
          <div className="error-container">
            <div className="error-header">
              <h3>⚠️ Unexpected Error</h3>
              <span className="error-badge">unknown</span>
            </div>
            
            <div className="error-content">
              <p className="error-message">
                Something went wrong while loading the GitHub repositories section.
              </p>
              <p>Please try refreshing the page or contact support if the issue persists.</p>
            </div>
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="btn btn-primary">
                🔄 Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                🔃 Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }

  getErrorTypeLabel(type) {
    const labels = {
      rate_limit: 'Rate Limited',
      network: 'Network Error',
      timeout: 'Timeout',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      not_found: 'Not Found',
      validation: 'Invalid Request',
      server_error: 'Server Error',
      api_error: 'API Error',
      unknown: 'Unknown Error'
    }
    return labels[type] || type
  }

  getSuggestions(error) {
    const suggestions = {
      rate_limit: [
        'Wait for the rate limit to reset (shown above)',
        'Consider adding a GitHub personal access token for higher rate limits',
        'Try again during off-peak hours'
      ],
      network: [
        'Check your internet connection',
        'Verify firewall settings allow GitHub API access',
        'Try refreshing the page'
      ],
      timeout: [
        'GitHub API is responding slowly',
        'Check your internet connection speed',
        'Try again in a few moments'
      ],
      unauthorized: [
        'This might be a temporary GitHub API issue',
        'Check if GitHub services are operational',
        'Try refreshing the page'
      ],
      forbidden: [
        'GitHub API access may be restricted',
        'Check if you need authentication',
        'Verify the GitHub username is correct'
      ],
      not_found: [
        'Verify the GitHub username is correct',
        'Check if the user has any public repositories',
        'The user might have been renamed or deleted'
      ],
      server_error: [
        'GitHub servers are experiencing issues',
        'Try again later',
        'Check GitHub status page for service updates'
      ]
    }

    return suggestions[error.type] || [
      'Try refreshing the page',
      'Check your internet connection',
      'Contact support if the issue persists'
    ]
  }

  formatRetryTime(seconds) {
    if (seconds < 60) {
      return `${seconds} seconds`
    } else if (seconds < 3600) {
      const minutes = Math.ceil(seconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''}`
    } else {
      const hours = Math.ceil(seconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''}`
    }
  }

  renderErrorDetails() {
    const { error, errorInfo, timestamp } = this.state
    
    return (
      <details className="error-details">
        <summary>🔧 Technical Details</summary>
        <div className="details-content">
          <div className="detail-section">
            <h4>Error Information</h4>
            <p><strong>Type:</strong> {error.constructor.name}</p>
            <p><strong>Message:</strong> {error.message}</p>
            {error.status && <p><strong>Status:</strong> {error.status}</p>}
            {error.type && <p><strong>Error Type:</strong> {error.type}</p>}
            {error.retryAfter && <p><strong>Retry After:</strong> {error.retryAfter} seconds</p>}
            <p><strong>Timestamp:</strong> {timestamp}</p>
          </div>
          
          {error.stack && (
            <div className="detail-section">
              <h4>Stack Trace</h4>
              <pre className="stack-trace">{error.stack}</pre>
            </div>
          )}
          
          {errorInfo && errorInfo.componentStack && (
            <div className="detail-section">
              <h4>Component Stack</h4>
              <pre className="component-stack">{errorInfo.componentStack}</pre>
            </div>
          )}
          
          <div className="detail-section">
            <h4>Environment</h4>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>Online Status:</strong> {navigator.onLine ? '🟢 Online' : '🔴 Offline'}</p>
          </div>
        </div>
      </details>
    )
  }
}

export default GitHubErrorBoundary