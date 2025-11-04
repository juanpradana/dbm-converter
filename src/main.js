import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker will be auto-registered by vite-plugin-pwa
    })
  })
}

createApp(App).mount('#app')
