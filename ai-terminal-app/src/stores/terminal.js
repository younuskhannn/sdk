import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTerminalStore = defineStore('terminal', () => {
  // State
  const history = ref([])
  const currentCommand = ref('')
  const isProcessing = ref(false)
  const output = ref([])
  const commandHistory = ref([])
  const historyIndex = ref(-1)

  // Getters
  const lastCommand = computed(() => {
    return commandHistory.value[commandHistory.value.length - 1] || ''
  })

  const commandCount = computed(() => {
    return commandHistory.value.length
  })

  const isTerminalActive = computed(() => {
    return !isProcessing.value
  })

  // Actions
  const addToHistory = (command, result = null, type = 'command') => {
    const timestamp = new Date().toISOString()
    history.value.push({
      id: Date.now(),
      command,
      result,
      type, // 'command', 'output', 'error', 'info'
      timestamp
    })
  }

  const executeCommand = async (command) => {
    if (!command.trim()) return

    isProcessing.value = true
    
    // Add command to history
    commandHistory.value.push(command)
    addToHistory(command, null, 'command')
    
    try {
      // Here we'll integrate with AI API later
      // For now, simulate processing
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Basic built-in commands
      let result = await processBuiltInCommand(command)
      
      if (result) {
        addToHistory(command, result, 'output')
      } else {
        // This would be sent to AI API in future
        addToHistory(command, 'Command processed by AI (integration pending)', 'info')
      }
    } catch (error) {
      addToHistory(command, error.message, 'error')
    } finally {
      isProcessing.value = false
      historyIndex.value = -1
    }
  }

  const processBuiltInCommand = async (command) => {
    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'help':
        return `Available commands:
  help     - Show this help message
  clear    - Clear terminal history
  history  - Show command history
  status   - Show application status
  about    - About this application
  
AI Commands (coming soon):
  build    - Build application features
  generate - Generate components
  deploy   - Deploy application`

      case 'clear':
        clearHistory()
        return null

      case 'history':
        return commandHistory.value.length > 0 
          ? commandHistory.value.map((cmd, i) => `${i + 1}: ${cmd}`).join('\n')
          : 'No commands in history'

      case 'status':
        return `AI Terminal App Status:
  Version: 1.0.0
  Commands executed: ${commandCount.value}
  Terminal active: ${isTerminalActive.value ? 'Yes' : 'No'}
  Last command: ${lastCommand.value || 'None'}`

      case 'about':
        return `AI Terminal App
A Vue.js 3 progressive building application that allows you to create and modify features through AI-powered commands.

Built with:
- Vue.js 3 (Composition API)
- Pinia (State Management)
- Tailwind CSS (Styling)
- PrimeVue (UI Components)
- xterm.js (Terminal Interface)
- Axios (API Client)`

      default:
        return null
    }
  }

  const clearHistory = () => {
    history.value = []
    output.value = []
  }

  const clearCommandHistory = () => {
    commandHistory.value = []
    historyIndex.value = -1
  }

  const navigateHistory = (direction) => {
    if (commandHistory.value.length === 0) return ''

    if (direction === 'up') {
      if (historyIndex.value < commandHistory.value.length - 1) {
        historyIndex.value++
      }
    } else if (direction === 'down') {
      if (historyIndex.value > 0) {
        historyIndex.value--
      } else {
        historyIndex.value = -1
        return ''
      }
    }

    return historyIndex.value >= 0 
      ? commandHistory.value[commandHistory.value.length - 1 - historyIndex.value]
      : ''
  }

  const setCurrentCommand = (command) => {
    currentCommand.value = command
  }

  return {
    // State
    history,
    currentCommand,
    isProcessing,
    output,
    commandHistory,
    historyIndex,
    
    // Getters
    lastCommand,
    commandCount,
    isTerminalActive,
    
    // Actions
    addToHistory,
    executeCommand,
    clearHistory,
    clearCommandHistory,
    navigateHistory,
    setCurrentCommand
  }
})