import axios from 'axios'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching
    config.headers['X-Request-Time'] = Date.now()
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token')
          console.error('Unauthorized access')
          break
        case 403:
          console.error('Forbidden access')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API Error:', data?.message || error.message)
      }
    }
    
    return Promise.reject(error)
  }
)

// AI Service endpoints
export const aiService = {
  // Process AI command
  processCommand: async (command, context = {}) => {
    try {
      const response = await apiClient.post('/ai/process', {
        command,
        context,
        timestamp: Date.now()
      })
      return response
    } catch (error) {
      console.error('AI processing error:', error)
      throw error
    }
  },

  // Generate code/components
  generateCode: async (prompt, type = 'component') => {
    try {
      const response = await apiClient.post('/ai/generate', {
        prompt,
        type,
        framework: 'vue3'
      })
      return response
    } catch (error) {
      console.error('Code generation error:', error)
      throw error
    }
  },

  // Get AI suggestions
  getSuggestions: async (input) => {
    try {
      const response = await apiClient.get('/ai/suggestions', {
        params: { input }
      })
      return response
    } catch (error) {
      console.error('Suggestions error:', error)
      throw error
    }
  }
}

// App management endpoints
export const appService = {
  // Get app status
  getStatus: async () => {
    try {
      const response = await apiClient.get('/app/status')
      return response
    } catch (error) {
      console.error('Status error:', error)
      throw error
    }
  },

  // Save app configuration
  saveConfig: async (config) => {
    try {
      const response = await apiClient.post('/app/config', config)
      return response
    } catch (error) {
      console.error('Config save error:', error)
      throw error
    }
  },

  // Get app configuration
  getConfig: async () => {
    try {
      const response = await apiClient.get('/app/config')
      return response
    } catch (error) {
      console.error('Config get error:', error)
      throw error
    }
  }
}

// File management endpoints
export const fileService = {
  // Create file
  createFile: async (path, content) => {
    try {
      const response = await apiClient.post('/files/create', {
        path,
        content
      })
      return response
    } catch (error) {
      console.error('File creation error:', error)
      throw error
    }
  },

  // Update file
  updateFile: async (path, content) => {
    try {
      const response = await apiClient.put('/files/update', {
        path,
        content
      })
      return response
    } catch (error) {
      console.error('File update error:', error)
      throw error
    }
  },

  // Get file list
  getFiles: async (directory = '/') => {
    try {
      const response = await apiClient.get('/files/list', {
        params: { directory }
      })
      return response
    } catch (error) {
      console.error('File list error:', error)
      throw error
    }
  }
}

// Export the main client for custom requests
export default apiClient