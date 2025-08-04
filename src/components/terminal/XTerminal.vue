<template>
  <div class="terminal-wrapper h-full flex flex-col">
    <!-- Terminal Header -->
    <div class="terminal-header bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="flex space-x-1">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span class="text-gray-300 text-sm font-mono">AI Terminal</span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="clearTerminal"
          class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
        >
          Clear
        </button>
        <div class="text-xs text-gray-400">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </div>
      </div>
    </div>

    <!-- Terminal Container -->
    <div 
      ref="terminalContainer" 
      class="terminal-container flex-1 p-4"
      @click="focusTerminal"
    ></div>

    <!-- Status Bar -->
    <div class="terminal-status bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-400 flex justify-between">
      <span>Commands: {{ commandCount }}</span>
      <span v-if="isProcessing" class="text-yellow-400">Processing...</span>
      <span v-else class="text-green-400">Ready</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Terminal } from '@xterm/xterm'
import { useTerminalStore } from '@/stores/terminal'

// Store
const terminalStore = useTerminalStore()

// Refs
const terminalContainer = ref(null)
const terminal = ref(null)
const isConnected = ref(true)
const currentInput = ref('')

// Computed from store
const { isProcessing, commandCount, history } = terminalStore

// Terminal configuration
const terminalConfig = {
  cursorBlink: true,
  cursorStyle: 'block',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
  theme: {
    background: '#0f172a',
    foreground: '#e2e8f0',
    cursor: '#10b981',
    selection: '#374151',
    black: '#1f2937',
    red: '#ef4444',
    green: '#10b981',
    yellow: '#f59e0b',
    blue: '#3b82f6',
    magenta: '#8b5cf6',
    cyan: '#06b6d4',
    white: '#f3f4f6',
    brightBlack: '#4b5563',
    brightRed: '#f87171',
    brightGreen: '#34d399',
    brightYellow: '#fbbf24',
    brightBlue: '#60a5fa',
    brightMagenta: '#a78bfa',
    brightCyan: '#22d3ee',
    brightWhite: '#ffffff'
  },
  cols: 80,
  rows: 24
}

// Initialize terminal
const initTerminal = async () => {
  if (!terminalContainer.value) return

  terminal.value = new Terminal(terminalConfig)
  
  try {
    terminal.value.open(terminalContainer.value)
    
    // Welcome message
    writeWelcomeMessage()
    
    // Show prompt
    showPrompt()
    
    // Setup event handlers
    setupEventHandlers()
    
    // Focus terminal
    terminal.value.focus()
    
  } catch (error) {
    console.error('Terminal initialization error:', error)
    isConnected.value = false
  }
}

// Welcome message
const writeWelcomeMessage = () => {
  const welcome = [
    '\x1b[1;32m╔═══════════════════════════════════════════════════════════════╗\x1b[0m',
    '\x1b[1;32m║\x1b[0m                    \x1b[1;36mAI Terminal App v1.0.0\x1b[0m                    \x1b[1;32m║\x1b[0m',
    '\x1b[1;32m║\x1b[0m        Progressive building through AI-powered commands        \x1b[1;32m║\x1b[0m',
    '\x1b[1;32m╚═══════════════════════════════════════════════════════════════╝\x1b[0m',
    '',
    '\x1b[1;33mType "help" to see available commands.\x1b[0m',
    ''
  ]
  
  welcome.forEach(line => {
    terminal.value.writeln(line)
  })
}

// Show command prompt
const showPrompt = () => {
  terminal.value.write('\x1b[1;32mai-terminal$\x1b[0m ')
}

// Setup event handlers
const setupEventHandlers = () => {
  let currentLine = ''
  
  terminal.value.onData((data) => {
    const code = data.charCodeAt(0)
    
    if (code === 13) { // Enter
      if (currentLine.trim()) {
        terminal.value.writeln('')
        executeCommand(currentLine.trim())
        currentLine = ''
      } else {
        terminal.value.writeln('')
        showPrompt()
      }
    } else if (code === 127) { // Backspace
      if (currentLine.length > 0) {
        currentLine = currentLine.slice(0, -1)
        terminal.value.write('\b \b')
      }
    } else if (code === 27) { // Escape sequences (arrow keys, etc.)
      handleEscapeSequence(data, currentLine)
    } else if (code >= 32 && code <= 126) { // Printable characters
      currentLine += data
      terminal.value.write(data)
    }
  })
}

// Handle escape sequences (arrow keys for history navigation)
const handleEscapeSequence = (data, currentLine) => {
  if (data === '\x1b[A') { // Up arrow
    const historyCommand = terminalStore.navigateHistory('up')
    if (historyCommand) {
      clearCurrentLine(currentLine)
      terminal.value.write(historyCommand)
      currentLine = historyCommand
    }
  } else if (data === '\x1b[B') { // Down arrow
    const historyCommand = terminalStore.navigateHistory('down')
    clearCurrentLine(currentLine)
    if (historyCommand) {
      terminal.value.write(historyCommand)
      currentLine = historyCommand
    }
  }
}

// Clear current input line
const clearCurrentLine = (currentLine) => {
  for (let i = 0; i < currentLine.length; i++) {
    terminal.value.write('\b \b')
  }
}

// Execute command
const executeCommand = async (command) => {
  try {
    await terminalStore.executeCommand(command)
  } catch (error) {
    terminal.value.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`)
  }
  
  showPrompt()
}

// Watch for terminal history changes
watch(() => terminalStore.history, (newHistory) => {
  // Display the latest output
  const latestEntry = newHistory[newHistory.length - 1]
  if (latestEntry && latestEntry.result) {
    displayOutput(latestEntry.result, latestEntry.type)
  }
}, { deep: true })

// Display command output
const displayOutput = (output, type = 'output') => {
  const colorMap = {
    output: '\x1b[0m',      // Default
    error: '\x1b[1;31m',    // Red
    warning: '\x1b[1;33m',  // Yellow
    info: '\x1b[1;36m',     // Cyan
    success: '\x1b[1;32m'   // Green
  }
  
  const color = colorMap[type] || colorMap.output
  const lines = output.split('\n')
  
  lines.forEach(line => {
    terminal.value.writeln(`${color}${line}\x1b[0m`)
  })
}

// Clear terminal
const clearTerminal = () => {
  if (terminal.value) {
    terminal.value.clear()
    terminalStore.clearHistory()
    showPrompt()
  }
}

// Focus terminal
const focusTerminal = () => {
  if (terminal.value) {
    terminal.value.focus()
  }
}

// Resize terminal
const resizeTerminal = () => {
  if (terminal.value && terminalContainer.value) {
    const { clientWidth, clientHeight } = terminalContainer.value
    const cols = Math.floor(clientWidth / 9) // Approximate character width
    const rows = Math.floor(clientHeight / 18) // Approximate line height
    
    try {
      terminal.value.resize(Math.max(cols, 80), Math.max(rows, 24))
    } catch (error) {
      console.warn('Terminal resize error:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  initTerminal()
  
  // Setup resize listener
  window.addEventListener('resize', resizeTerminal)
})

onUnmounted(() => {
  if (terminal.value) {
    terminal.value.dispose()
  }
  window.removeEventListener('resize', resizeTerminal)
})

// Expose methods
defineExpose({
  clearTerminal,
  focusTerminal,
  resizeTerminal
})
</script>

<style scoped>
.terminal-wrapper {
  @apply bg-terminal-bg text-terminal-text font-mono;
}

.terminal-container {
  @apply bg-terminal-bg;
}

/* Hide xterm.js cursor when not focused */
.terminal-container:not(:focus-within) .xterm-cursor {
  opacity: 0.5 !important;
}
</style>