/**
 * Custom Hook for GitHub Repositories
 * Provides a clean interface for fetching and managing GitHub repositories
 * with caching, error handling, and retry logic.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { githubApi, GitHubApiError } from '../services/githubApi'

export const useGitHubRepositories = (username, options = {}) => {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [lastFetch, setLastFetch] = useState(null)
  const [cacheStats, setCacheStats] = useState(null)
  
  const abortControllerRef = useRef(null)
  const retryTimeoutRef = useRef(null)

  // Default options
  const defaultOptions = {
    sort: 'updated',
    per_page: 8,
    page: 1,
    includeForks: false,
    includePrivate: false,
    autoRefresh: false,
    refreshInterval: 300000, // 5 minutes
    retryConfig: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000
    }
  }

  const finalOptions = { ...defaultOptions, ...options }

  // Clear any pending timeouts
  const clearTimeouts = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Enhanced error classification
  const classifyError = useCallback((error) => {
    if (error instanceof GitHubApiError) {
      return {
        type: error.type,
        message: error.message,
        status: error.status,
        retryAfter: error.retryAfter,
        canRetry: error.type !== 'rate_limit',
        isRecoverable: ['network', 'timeout', 'server_error'].includes(error.type),
        userMessage: getUserFriendlyMessage(error)
      }
    }

    return {
      type: 'unknown',
      message: 'An unexpected error occurred',
      canRetry: true,
      isRecoverable: true,
      userMessage: 'Something went wrong. Please try again.'
    }
  }, [])

  // Get user-friendly error messages
  const getUserFriendlyMessage = useCallback((error) => {
    const messages = {
      rate_limit: 'GitHub API rate limit exceeded. Please wait a few minutes before trying again.',
      network: 'Unable to connect to GitHub. Please check your internet connection.',
      timeout: 'GitHub API is responding slowly. Please try again.',
      unauthorized: 'GitHub API authentication failed. This might be a temporary issue.',
      forbidden: 'GitHub API access denied. Please check your credentials.',
      not_found: 'GitHub user or repositories not found.',
      server_error: 'GitHub servers are experiencing issues. Please try again later.'
    }

    return messages[error.type] || error.message || 'An unexpected error occurred.'
  }, [])

  // Fetch repositories with comprehensive error handling
  const fetchRepositories = useCallback(async (isRetry = false) => {
    if (!username) {
      setError({
        type: 'validation',
        message: 'Username is required',
        canRetry: false,
        isRecoverable: false,
        userMessage: 'Please provide a valid GitHub username.'
      })
      setLoading(false)
      return
    }

    clearTimeouts()
    setLoading(true)
    setError(null)

    try {
      console.log(`🚀 Fetching repositories for ${username}...`)
      
      const repos = await githubApi.getUserRepositories(username, finalOptions)
      
      setRepositories(repos)
      setLastFetch(new Date().toISOString())
      setRetryCount(0)
      
      // Update cache stats
      setCacheStats(githubApi.getCacheStats())
      
      console.log(`✅ Successfully fetched ${repos.length} repositories`)

    } catch (err) {
      console.error('❌ Error fetching repositories:', err)
      
      const errorInfo = classifyError(err)
      setError(errorInfo)
      
      // Implement automatic retry for recoverable errors
      if (errorInfo.canRetry && errorInfo.isRecoverable && retryCount < finalOptions.retryConfig.maxRetries) {
        const delay = githubApi.createBackoffDelay(retryCount)
        console.log(`⏳ Scheduling retry ${retryCount + 1} in ${delay}ms...`)
        
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchRepositories(true)
        }, delay)
      }

    } finally {
      setLoading(false)
    }
  }, [username, finalOptions, retryCount, classifyError])

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0)
    fetchRepositories()
  }, [fetchRepositories])

  // Force refresh (bypass cache)
  const refresh = useCallback(() => {
    githubApi.clearCache()
    setRetryCount(0)
    fetchRepositories()
  }, [fetchRepositories])

  // Clear cache manually
  const clearCache = useCallback(() => {
    githubApi.clearCache()
    setCacheStats(githubApi.getCacheStats())
  }, [])

  // Test API connectivity
  const testApi = useCallback(async () => {
    try {
      const health = await githubApi.checkApiHealth()
      return health
    } catch (error) {
      throw classifyError(error)
    }
  }, [classifyError])

  // Auto-refresh functionality
  useEffect(() => {
    if (finalOptions.autoRefresh && finalOptions.refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!loading && !error) {
          refresh()
        }
      }, finalOptions.refreshInterval)

      return () => clearInterval(interval)
    }
  }, [finalOptions.autoRefresh, finalOptions.refreshInterval, loading, error, refresh])

  // Initial fetch
  useEffect(() => {
    fetchRepositories()
    
    return () => {
      clearTimeouts()
    }
  }, [fetchRepositories])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  // Computed state
  const isEmpty = !loading && !error && repositories.length === 0
  const hasData = !loading && !error && repositories.length > 0
  const canRetry = error?.canRetry && retryCount < finalOptions.retryConfig.maxRetries

  return {
    // Data
    repositories,
    error,
    loading,
    retryCount,
    lastFetch,
    cacheStats,
    
    // Computed state
    isEmpty,
    hasData,
    canRetry,
    
    // Actions
    retry,
    refresh,
    clearCache,
    testApi,
    
    // API info
    apiHealth: {
      rateLimitRemaining: githubApi.rateLimitRemaining,
      rateLimitReset: new Date(githubApi.rateLimitReset).toISOString(),
      isRateLimited: githubApi.isRateLimited(),
      timeUntilReset: githubApi.getTimeUntilReset()
    }
  }
}

export default useGitHubRepositories