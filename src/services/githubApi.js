/**
 * Enhanced GitHub API Service
 * Comprehensive solution for GitHub API integration with robust error handling,
 * caching, retry logic, and rate limit management.
 */

class GitHubApiError extends Error {
  constructor(message, type, status, retryAfter) {
    super(message)
    this.name = 'GitHubApiError'
    this.type = type
    this.status = status
    this.retryAfter = retryAfter
  }
}

class GitHubApiService {
  constructor() {
    this.baseUrl = 'https://api.github.com'
    this.cache = new Map()
    this.requestQueue = new Map()
    this.rateLimitRemaining = 60
    this.rateLimitReset = Date.now() + 3600000 // 1 hour default
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 30000, // 30 seconds
      backoffMultiplier: 2
    }
    
    // Initialize with environment variable for GitHub token if available
    this.token = import.meta.env.VITE_GITHUB_TOKEN || null
  }

  /**
   * Create exponential backoff delay
   */
  createBackoffDelay(attempt) {
    const { baseDelay, maxDelay, backoffMultiplier } = this.retryConfig
    const delay = Math.min(
      baseDelay * Math.pow(backoffMultiplier, attempt),
      maxDelay
    )
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000
  }

  /**
   * Parse rate limit headers from GitHub API response
   */
  parseRateLimitHeaders(headers) {
    const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '60')
    const reset = parseInt(headers.get('X-RateLimit-Reset') || '0') * 1000
    
    this.rateLimitRemaining = remaining
    this.rateLimitReset = reset
    
    return { remaining, reset }
  }

  /**
   * Check if we're currently rate limited
   */
  isRateLimited() {
    return this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitReset
  }

  /**
   * Get time until rate limit reset
   */
  getTimeUntilReset() {
    return Math.max(0, this.rateLimitReset - Date.now())
  }

  /**
   * Enhanced fetch with comprehensive error handling and retry logic
   */
  async fetchWithRetry(endpoint, options = {}, attempt = 0) {
    const url = `${this.baseUrl}${endpoint}`
    const cacheKey = `${options.method || 'GET'}:${url}`
    
    // Check cache first for GET requests
    if ((!options.method || options.method === 'GET') && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.getCacheTimeout(endpoint)) {
        console.log('📦 Serving from cache:', endpoint)
        return cached.data
      }
    }

    // Check rate limiting
    if (this.isRateLimited()) {
      const timeUntilReset = this.getTimeUntilReset()
      throw new GitHubApiError(
        `GitHub API rate limit exceeded. Reset in ${Math.ceil(timeUntilReset / 60000)} minutes.`,
        'rate_limit',
        403,
        Math.ceil(timeUntilReset / 1000)
      )
    }

    // Prepare headers
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Ibrahim-Portfolio-Website',
      ...options.headers
    }

    // Add authentication if token is available
    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      console.log(`🌐 API Request (attempt ${attempt + 1}):`, url)
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Parse rate limit info
      const rateLimitInfo = this.parseRateLimitHeaders(response.headers)
      console.log('📊 Rate limit info:', rateLimitInfo)

      // Handle rate limiting specifically
      if (response.status === 403) {
        const resetTime = response.headers.get('X-RateLimit-Reset')
        const retryAfter = resetTime ? parseInt(resetTime) * 1000 - Date.now() : 3600000
        
        throw new GitHubApiError(
          'GitHub API rate limit exceeded',
          'rate_limit',
          403,
          Math.ceil(retryAfter / 1000)
        )
      }

      // Handle other HTTP errors
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // Use default error message if JSON parsing fails
        }

        throw new GitHubApiError(
          errorMessage,
          this.getErrorType(response.status),
          response.status
        )
      }

      // Parse successful response
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        
        // Limit cache size
        if (this.cache.size > 100) {
          const firstKey = this.cache.keys().next().value
          this.cache.delete(firstKey)
        }
      }

      console.log('✅ API request successful:', endpoint)
      return data

    } catch (error) {
      clearTimeout(timeoutId)
      
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new GitHubApiError(
          'Request timeout - GitHub API took too long to respond',
          'timeout',
          408
        )
      }

      if (error instanceof GitHubApiError) {
        throw error
      }

      // Handle other network errors
      throw new GitHubApiError(
        `Network error: ${error.message}`,
        'network',
        0
      )
    }
  }

  /**
   * Get cache timeout based on endpoint
   */
  getCacheTimeout(endpoint) {
    if (endpoint.includes('/repos')) {
      return 5 * 60 * 1000 // 5 minutes for repositories
    }
    if (endpoint.includes('/user')) {
      return 10 * 60 * 1000 // 10 minutes for user data
    }
    return 2 * 60 * 1000 // 2 minutes default
  }

  /**
   * Map HTTP status codes to error types
   */
  getErrorType(status) {
    switch (status) {
      case 401: return 'unauthorized'
      case 403: return 'forbidden'
      case 404: return 'not_found'
      case 422: return 'validation'
      case 500: return 'server_error'
      default: return 'api_error'
    }
  }

  /**
   * Enhanced fetch with automatic retry logic
   */
  async fetch(endpoint, options = {}, customRetryConfig = {}) {
    const config = { ...this.retryConfig, ...customRetryConfig }
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await this.fetchWithRetry(endpoint, options, attempt)
      } catch (error) {
        const isLastAttempt = attempt === config.maxRetries
        const shouldRetry = this.shouldRetry(error, attempt, config)
        
        console.log(`❌ Attempt ${attempt + 1} failed:`, error.message)
        
        if (isLastAttempt || !shouldRetry) {
          throw error
        }

        // Wait before retrying
        const delay = this.createBackoffDelay(attempt)
        console.log(`⏳ Retrying in ${delay}ms...`)
        await this.delay(delay)
      }
    }
  }

  /**
   * Determine if we should retry based on error type and attempt count
   */
  shouldRetry(error, attempt, config) {
    // Don't retry rate limit errors (they have specific reset times)
    if (error.type === 'rate_limit') {
      return false
    }

    // Don't retry client errors (4xx) except 408 (timeout) and 429 (too many requests)
    if (error.status >= 400 && error.status < 500 && error.status !== 408) {
      return false
    }

    // Retry server errors (5xx) and network errors
    return error.status >= 500 || error.type === 'network' || error.type === 'timeout'
  }

  /**
   * Promise-based delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get user repositories with enhanced filtering and error handling
   */
  async getUserRepositories(username, options = {}) {
    const {
      sort = 'updated',
      per_page = 8,
      page = 1,
      includeForks = false,
      includePrivate = false
    } = options

    const params = new URLSearchParams({
      sort,
      per_page: per_page.toString(),
      page: page.toString()
    })

    const endpoint = `/users/${username}/repos?${params.toString()}`
    
    try {
      const repos = await this.fetch(endpoint)
      
      // Filter repositories based on options
      const filtered = repos.filter(repo => {
        if (!includeForks && repo.fork) return false
        if (!includePrivate && repo.private) return false
        return true
      })

      // Sort by specified criteria
      const sorted = this.sortRepositories(filtered, sort)
      
      console.log(`📋 Retrieved ${sorted.length} repositories for ${username}`)
      return sorted

    } catch (error) {
      console.error('Failed to fetch repositories:', error)
      throw error
    }
  }

  /**
   * Sort repositories by different criteria
   */
  sortRepositories(repos, sortBy) {
    switch (sortBy) {
      case 'stars':
        return repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
      case 'forks':
        return repos.sort((a, b) => b.forks_count - a.forks_count)
      case 'size':
        return repos.sort((a, b) => b.size - a.size)
      case 'created':
        return repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      case 'updated':
      default:
        return repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(username) {
    const endpoint = `/users/${username}`
    
    try {
      return await this.fetch(endpoint)
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      throw error
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache() {
    this.cache.clear()
    console.log('🗑️ GitHub API cache cleared')
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      rateLimitRemaining: this.rateLimitRemaining,
      rateLimitReset: new Date(this.rateLimitReset).toISOString()
    }
  }

  /**
   * Check API health
   */
  async checkApiHealth() {
    try {
      const start = Date.now()
      await this.fetch('/rate_limit')
      const latency = Date.now() - start
      
      return {
        status: 'healthy',
        latency,
        rateLimitRemaining: this.rateLimitRemaining,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        rateLimitRemaining: this.rateLimitRemaining,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const githubApi = new GitHubApiService()
export { GitHubApiError }
export default githubApi