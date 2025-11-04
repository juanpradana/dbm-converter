<template>
  <div class="min-h-screen pb-8">
    <!-- Header -->
    <header class="glass-card mx-4 mt-4 md:mx-auto md:max-w-6xl rounded-2xl p-4 md:p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📻 Signal Meter Pro
          </h1>
          <p class="text-sm md:text-base text-gray-300 mt-1">
            Modern S-Meter & dB Converter
          </p>
        </div>
        <PWAInstallPrompt v-if="showInstallPrompt" @dismiss="showInstallPrompt = false" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 mt-6 md:mt-8 max-w-7xl">
      <!-- Mobile: Single column -->
      <div class="block md:hidden space-y-6">
        <ConverterCard @convert="handleConversion" />
        <SMeterTable />
        <ConversionHistory :history="history" @clear="clearHistory" />
      </div>

      <!-- Tablet & Desktop: Grid layout -->
      <div class="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Converter Card - Center/Main Column -->
        <div class="lg:col-span-2">
          <ConverterCard @convert="handleConversion" />
        </div>

        <!-- Sidebar - Reference Table & History -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Reference Table -->
          <SMeterTable />
          
          <!-- History -->
          <ConversionHistory :history="history" @clear="clearHistory" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-8 px-4 md:px-6">
      <div class="glass-card mx-auto max-w-7xl rounded-2xl p-4 md:p-6">
        <p class="text-center text-sm text-gray-400">
          © 2025 Farzani RBA. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConverterCard from './components/ConverterCard.vue'
import SMeterTable from './components/SMeterTable.vue'
import ConversionHistory from './components/ConversionHistory.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'

const history = ref([])
const showInstallPrompt = ref(false)

// Load history from localStorage
onMounted(() => {
  const saved = localStorage.getItem('conversionHistory')
  if (saved) {
    try {
      history.value = JSON.parse(saved)
    } catch (e) {
      console.error('Error loading history:', e)
    }
  }
})

function handleConversion(conversion) {
  // Add to history
  history.value.unshift({
    ...conversion,
    timestamp: new Date().toISOString()
  })

  // Keep only last 10 conversions
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10)
  }

  // Save to localStorage
  localStorage.setItem('conversionHistory', JSON.stringify(history.value))
}

function clearHistory() {
  history.value = []
  localStorage.removeItem('conversionHistory')
}
</script>
