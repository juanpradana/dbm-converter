<template>
  <div class="glass-card rounded-2xl p-6">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between text-left mb-4"
    >
      <h3 class="text-lg md:text-xl font-bold text-cyan-400">
        📊 S-Meter Reference
      </h3>
      <svg
        :class="{ 'rotate-180': isOpen }"
        class="w-5 h-5 transition-transform duration-200 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-show="isOpen" class="overflow-hidden transition-all duration-300">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="text-left py-2 px-2 text-gray-300 font-semibold">S-Meter</th>
              <th class="text-right py-2 px-2 text-gray-300 font-semibold">dBm</th>
              <th class="text-right py-2 px-2 text-gray-300 font-semibold">dBµV</th>
              <th class="text-right py-2 px-2 text-gray-300 font-semibold">dBV</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in tableData"
              :key="index"
              class="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
            >
              <td class="py-2 px-2 font-medium text-cyan-400">{{ row.sMeter }}</td>
              <td class="py-2 px-2 text-right">{{ row.dBm }}</td>
              <td class="py-2 px-2 text-right">{{ row.dBuV }}</td>
              <td class="py-2 px-2 text-right">{{ row.dBV }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSMeterTable } from '../utils/converter.js'

const isOpen = ref(false)
const tableData = ref([])

onMounted(() => {
  tableData.value = getSMeterTable()
})
</script>
