<template>
  <header class="app-header bg-gray-900 border-b border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">AI</span>
          </div>
          <h1 class="text-xl font-bold text-white">Terminal App</h1>
        </div>
        <div class="text-xs text-gray-400 hidden sm:block">
          Progressive building through AI commands
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="hidden md:flex items-center space-x-2 text-sm text-gray-400">
          <span class="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Ready</span>
        </div>
        
        <button 
          @click="toggleTheme"
          class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          title="Toggle theme (coming soon)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <button 
          @click="showInfo"
          class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          title="App info"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTerminalStore } from '@/stores/terminal'

const terminalStore = useTerminalStore()

const toggleTheme = () => {
  // Theme toggle functionality to be implemented
  console.log('Theme toggle (coming soon)')
}

const showInfo = () => {
  // Add info about the app to terminal
  terminalStore.executeCommand('about')
}
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
}
</style>