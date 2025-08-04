<template>
  <div class="app-layout h-screen flex flex-col bg-gray-900">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 p-4">
        <div class="h-full max-w-7xl mx-auto">
          <XTerminal ref="terminal" />
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-700 px-6 py-2">
      <div class="flex items-center justify-between text-xs text-gray-400">
        <div class="flex items-center space-x-4">
          <span>Vue.js 3 + Composition API</span>
          <span>•</span>
          <span>Tailwind CSS + PrimeVue</span>
          <span>•</span>
          <span>xterm.js Terminal</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <span>Commands: {{ commandCount }}</span>
          <span>•</span>
          <span v-if="isProcessing" class="text-yellow-400">Processing...</span>
          <span v-else class="text-green-400">Ready for commands</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import XTerminal from '@/components/terminal/XTerminal.vue'
import { useTerminalStore } from '@/stores/terminal'

const terminal = ref(null)
const terminalStore = useTerminalStore()

// Get reactive values from store
const { isProcessing, commandCount } = terminalStore
</script>

<style scoped>
.app-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>