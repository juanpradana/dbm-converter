<template>
  <div v-if="showPrompt" class="glass-card p-4 rounded-lg flex items-center justify-between gap-4 animate-slide-in">
    <div class="flex-1">
      <div class="text-sm font-semibold text-white">Install App</div>
      <div class="text-xs text-gray-300">Add to home screen for quick access</div>
    </div>
    <div class="flex gap-2">
      <button
        @click="installApp"
        class="btn-primary text-sm px-4 py-2"
      >
        Install
      </button>
      <button
        @click="dismiss"
        class="px-3 py-2 text-gray-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['dismiss'])
const showPrompt = ref(false)
let deferredPrompt = null

onMounted(() => {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showPrompt.value = false
    return
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })

  // Check if already dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const now = Date.now()
    // Show again after 7 days
    if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      showPrompt.value = false
    }
  }
})

function installApp() {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
    deferredPrompt = null
    showPrompt.value = false
  })
}

function dismiss() {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  emit('dismiss')
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
