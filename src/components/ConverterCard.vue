<template>
  <div class="glass-card rounded-2xl p-6 md:p-8">
    <h2 class="text-xl md:text-2xl font-bold mb-6 text-cyan-400">Converter</h2>
    
    <!-- Input Section -->
    <div class="space-y-4 mb-8">
      <div v-if="fromUnit !== 'S-Meter'">
        <label class="block text-sm font-medium mb-2 text-gray-300">Value</label>
        <input
          v-model.number="inputValue"
          type="number"
          step="any"
          placeholder="Enter value"
          class="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 transition-all duration-200"
          @input="debouncedConvert"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-300">From Unit</label>
        <select
          v-model="fromUnit"
          class="glass-input w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
          @change="convert"
        >
          <option value="dBm">dBm</option>
          <option value="dBµV">dBµV</option>
          <option value="dBV">dBV</option>
          <option value="S-Meter">S-Meter</option>
        </select>
      </div>

      <!-- S-Meter specific input: dropdown or manual -->
      <div v-if="fromUnit === 'S-Meter'">
        <label class="block text-sm font-medium mb-2 text-gray-300">S-Meter Reading</label>
        
        <!-- Toggle between dropdown and manual input -->
        <div class="flex gap-2 mb-2">
          <button
            @click="sMeterInputMode = 'dropdown'; convert()"
            :class="sMeterInputMode === 'dropdown' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'"
            class="px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Preset
          </button>
          <button
            @click="sMeterInputMode = 'manual'; sMeterManualValue = ''; sMeterError = ''"
            :class="sMeterInputMode === 'manual' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'"
            class="px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Manual
          </button>
        </div>

        <!-- Dropdown mode -->
        <select
          v-if="sMeterInputMode === 'dropdown'"
          v-model="sMeterValue"
          class="glass-input w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
          @change="handleSMeterDropdownChange"
        >
          <option v-for="option in sMeterOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Manual input mode -->
        <div v-else>
          <input
            v-model="sMeterManualValue"
            type="text"
            placeholder="e.g., S9+17, S9+25, S5, etc."
            class="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 transition-all duration-200"
            :class="{ 'border-red-500': sMeterError }"
            @input="handleSMeterManualInput"
          />
          <div v-if="sMeterError" class="text-red-400 text-xs mt-1">
            {{ sMeterError }}
          </div>
          <div v-else-if="sMeterManualValue && !sMeterError" class="text-cyan-400 text-xs mt-1">
            Format: S1-S9 or S9+X (e.g., S9+17, S9+25.5)
          </div>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-cyan-400 mb-4">Converted Values</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- dBm Result -->
        <div class="glass-card p-4 rounded-lg">
          <div class="text-sm text-gray-400 mb-1">dBm</div>
          <div class="text-2xl font-bold text-white">
            {{ results.dBm !== null ? results.dBm.toLocaleString() : '---' }}
          </div>
        </div>

        <!-- dBµV Result -->
        <div class="glass-card p-4 rounded-lg">
          <div class="text-sm text-gray-400 mb-1">dBµV</div>
          <div class="text-2xl font-bold text-white">
            {{ results.dBuV !== null ? results.dBuV.toLocaleString() : '---' }}
          </div>
        </div>

        <!-- dBV Result -->
        <div class="glass-card p-4 rounded-lg">
          <div class="text-sm text-gray-400 mb-1">dBV</div>
          <div class="text-2xl font-bold text-white">
            {{ results.dBV !== null ? results.dBV.toLocaleString() : '---' }}
          </div>
        </div>

        <!-- S-Meter Result -->
        <div class="glass-card p-4 rounded-lg">
          <div class="text-sm text-gray-400 mb-1">S-Meter</div>
          <div class="text-2xl font-bold text-cyan-400">
            {{ results.sMeter || '---' }}
          </div>
          <div v-if="results.sMeter && results.sMeter.includes('+') && !sMeterOptions.includes(results.sMeter)" class="text-xs text-gray-400 mt-1">
            (calculated)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { convertValue, getSMeterOptions, isValidSMeterFormat } from '../utils/converter.js'

const emit = defineEmits(['convert'])

const inputValue = ref('')
const fromUnit = ref('dBm')
const sMeterValue = ref('S9')
const sMeterInputMode = ref('dropdown') // 'dropdown' or 'manual'
const sMeterManualValue = ref('')
const sMeterError = ref('')
const results = ref({
  dBm: null,
  dBuV: null,
  dBV: null,
  sMeter: null
})
const sMeterOptions = getSMeterOptions()

let debounceTimer = null
let sMeterDebounceTimer = null

onMounted(() => {
  sMeterValue.value = sMeterOptions[0]
  // Trigger initial conversion if S-Meter is selected
  if (fromUnit.value === 'S-Meter') {
    convert()
  }
})

function convert() {
  let valueToConvert = inputValue.value

  // For S-Meter, use the selected S-Meter value (dropdown or manual)
  if (fromUnit.value === 'S-Meter') {
    if (sMeterInputMode.value === 'manual') {
      valueToConvert = sMeterManualValue.value
      // Validate format
      if (!valueToConvert || valueToConvert.trim() === '') {
        results.value = { dBm: null, dBuV: null, dBV: null, sMeter: null }
        sMeterError.value = ''
        return
      }
      // Normalize input (trim and check format)
      const normalized = String(valueToConvert).trim()
      if (!isValidSMeterFormat(normalized)) {
        sMeterError.value = 'Invalid format. Use: S1-S9 or S9+X (e.g., S9+17)'
        results.value = { dBm: null, dBuV: null, dBV: null, sMeter: null }
        return
      }
      sMeterError.value = ''
      valueToConvert = normalized
    } else {
      valueToConvert = sMeterValue.value
      // Ensure dropdown value is valid
      if (!valueToConvert) {
        results.value = { dBm: null, dBuV: null, dBV: null, sMeter: null }
        return
      }
    }
  }

  // Check if value is empty (for non-S-Meter units)
  if (fromUnit.value !== 'S-Meter' && (valueToConvert === '' || valueToConvert === null || valueToConvert === undefined)) {
    results.value = { dBm: null, dBuV: null, dBV: null, sMeter: null }
    return
  }

  // Perform conversion
  const conversionResult = convertValue(valueToConvert, fromUnit.value)
  results.value = conversionResult

  // Emit conversion event for history (only if valid)
  if (results.value.dBm !== null && !sMeterError.value) {
    emit('convert', {
      input: valueToConvert,
      unit: fromUnit.value,
      results: { ...results.value }
    })
  }
}

function handleSMeterManualInput() {
  // Clear any existing error first
  sMeterError.value = ''
  
  clearTimeout(sMeterDebounceTimer)
  sMeterDebounceTimer = setTimeout(() => {
    // Force convert after debounce
    convert()
  }, 300)
}

function handleSMeterDropdownChange() {
  // Ensure conversion happens when dropdown value changes
  convert()
}

function debouncedConvert() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    convert()
  }, 300)
}

// Watch for unit changes
watch(fromUnit, (newUnit) => {
  if (newUnit === 'S-Meter') {
    sMeterInputMode.value = 'dropdown'
    sMeterManualValue.value = ''
    sMeterError.value = ''
    // Ensure sMeterValue is set
    if (!sMeterValue.value || !sMeterOptions.includes(sMeterValue.value)) {
      sMeterValue.value = sMeterOptions[0]
    }
    // Trigger conversion after a brief delay to ensure values are set
    setTimeout(() => {
      convert()
    }, 10)
  } else {
    setTimeout(() => {
      convert()
    }, 10)
  }
}, { immediate: true })

// Watch for S-Meter dropdown value changes
watch(sMeterValue, (newValue) => {
  // Only trigger if in dropdown mode and fromUnit is S-Meter
  if (fromUnit.value === 'S-Meter' && sMeterInputMode.value === 'dropdown' && newValue) {
    // Use nextTick to ensure DOM is updated
    setTimeout(() => {
      convert()
    }, 0)
  }
}, { immediate: false })

// Watch for S-Meter input mode changes
watch(sMeterInputMode, () => {
  if (fromUnit.value === 'S-Meter') {
    if (sMeterInputMode.value === 'manual') {
      sMeterManualValue.value = ''
      sMeterError.value = ''
    } else {
      // Switching to dropdown - ensure value is set
      if (!sMeterValue.value || !sMeterOptions.includes(sMeterValue.value)) {
        sMeterValue.value = sMeterOptions[0]
      }
    }
    // Use nextTick to ensure DOM is updated
    setTimeout(() => {
      convert()
    }, 0)
  }
})
</script>
