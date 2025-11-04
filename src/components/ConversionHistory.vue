<template>
  <div class="glass-card rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg md:text-xl font-bold text-cyan-400">
        📝 History
      </h3>
      <button
        v-if="history.length > 0"
        @click="$emit('clear')"
        class="text-xs text-gray-400 hover:text-red-400 transition-colors"
      >
        Clear
      </button>
    </div>

    <div v-if="history.length === 0" class="text-center py-8 text-gray-400 text-sm">
      No conversion history yet
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="glass-card p-3 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="text-sm font-medium text-white">
              {{ item.input }} <span class="text-cyan-400">{{ item.unit }}</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatTime(item.timestamp) }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
          <div>
            <span class="text-gray-400">dBm:</span>
            <span class="ml-1 text-white">{{ item.results.dBm }}</span>
          </div>
          <div>
            <span class="text-gray-400">dBµV:</span>
            <span class="ml-1 text-white">{{ item.results.dBuV }}</span>
          </div>
          <div>
            <span class="text-gray-400">dBV:</span>
            <span class="ml-1 text-white">{{ item.results.dBV }}</span>
          </div>
          <div>
            <span class="text-gray-400">S:</span>
            <span class="ml-1 text-cyan-400">{{ item.results.sMeter }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

defineEmits(['clear'])

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
