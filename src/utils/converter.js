// S-Meter to dBm conversion table (standard amateur radio)
const S_METER_TABLE = {
  'S1': -121,
  'S2': -115,
  'S3': -109,
  'S4': -103,
  'S5': -97,
  'S6': -91,
  'S7': -85,
  'S8': -79,
  'S9': -73,
  'S9+10': -63,
  'S9+20': -53,
  'S9+30': -43,
  'S9+40': -33,
  'S9+50': -23,
  'S9+60': -13
}

// Convert dBm to dBµV (50Ω system)
// Formula: dBµV = dBm + 107
export function dBmToDbuV(dBm) {
  if (dBm === null || dBm === undefined || isNaN(dBm)) return null
  return dBm + 107
}

// Convert dBµV to dBm
export function dBuVToDbm(dBuV) {
  if (dBuV === null || dBuV === undefined || isNaN(dBuV)) return null
  return dBuV - 107
}

// Convert dBV to dBm (50Ω system)
// Formula: dBm = dBV + 13.01
export function dBVToDbm(dBV) {
  if (dBV === null || dBV === undefined || isNaN(dBV)) return null
  return dBV + 13.01
}

// Convert dBm to dBV
export function dBmToDBV(dBm) {
  if (dBm === null || dBm === undefined || isNaN(dBm)) return null
  return dBm - 13.01
}

// Convert dBµV to dBV
export function dBuVToDBV(dBuV) {
  if (dBuV === null || dBuV === undefined || isNaN(dBuV)) return null
  return dBuV - 120
}

// Convert dBV to dBµV
export function dBVToDbuV(dBV) {
  if (dBV === null || dBV === undefined || isNaN(dBV)) return null
  return dBV + 120
}

// Convert S-Meter to dBm
// Supports both predefined values and manual input like "S9+17", "S9+25", etc.
export function sMeterToDbm(sMeter) {
  if (!sMeter || typeof sMeter !== 'string') return null
  
  // Check if it's in the predefined table
  const predefinedValue = S_METER_TABLE[sMeter]
  if (predefinedValue !== undefined) {
    return predefinedValue
  }
  
  // Parse manual input format: S1-S9 or S9+X where X is any number
  const trimmed = sMeter.trim()
  
  // Match S1-S9 format
  const sMatch = trimmed.match(/^S([1-9])$/i)
  if (sMatch) {
    const sValue = parseInt(sMatch[1])
    if (sValue >= 1 && sValue <= 9) {
      const dbmValue = S_METER_TABLE[`S${sValue}`]
      return dbmValue !== undefined ? dbmValue : null
    }
  }
  
  // Match S9+X format where X can be any positive number (e.g., S9+17, S9+25)
  const s9PlusMatch = trimmed.match(/^S9\+(\d+(?:\.\d+)?)$/i)
  if (s9PlusMatch) {
    const offset = parseFloat(s9PlusMatch[1])
    // S9 = -73 dBm, each +1 = +1 dB
    return -73 + offset
  }
  
  // Match S+X format for values above S9 (e.g., S+10, S+20)
  const sPlusMatch = trimmed.match(/^S\+(\d+(?:\.\d+)?)$/i)
  if (sPlusMatch) {
    const offset = parseFloat(sPlusMatch[1])
    return -73 + offset
  }
  
  return null
}

// Convert dBm to S-Meter reading
// Returns exact match if available, otherwise calculates S9+X format
export function dBmToSMeter(dBm) {
  if (dBm === null || dBm === undefined || isNaN(dBm)) return null
  
  // If below S1
  if (dBm < -121) return 'S0'
  
  // First, check for exact matches in predefined table
  const entries = Object.entries(S_METER_TABLE)
  for (const [sMeter, dbmValue] of entries) {
    if (Math.abs(dBm - dbmValue) < 0.01) { // Exact match with tolerance
      return sMeter
    }
  }
  
  // Check for S1-S9 range first
  if (dBm >= -121 && dBm < -73) {
    // Find closest S1-S9 value
    for (let i = 0; i < entries.length - 1; i++) {
      const [currentS, currentDbm] = entries[i]
      const [nextS, nextDbm] = entries[i + 1]
      
      // Skip S9+ values
      if (currentS.startsWith('S9+') || nextS.startsWith('S9+')) continue
      
      if (dBm >= currentDbm && dBm < nextDbm) {
        // Check which is closer
        const diffToCurrent = Math.abs(dBm - currentDbm)
        const diffToNext = Math.abs(dBm - nextDbm)
        return diffToCurrent <= diffToNext ? currentS : nextS
      }
    }
  }
  
  // Handle S9+ values (S9 = -73 dBm, each +1 = +1 dB)
  if (dBm >= -73) {
    const offset = dBm - (-73) // Calculate offset from S9
    if (offset >= 0) {
      // Round to 1 decimal place for display
      const roundedOffset = Math.round(offset * 10) / 10
      // If it's a whole number, display without decimal
      if (roundedOffset % 1 === 0) {
        return `S9+${Math.round(roundedOffset)}`
      }
      return `S9+${roundedOffset.toFixed(1)}`
    }
  }
  
  // Fallback: find closest predefined value
  let closestS = 'S9'
  let minDiff = Infinity
  for (const [sMeter, dbmValue] of entries) {
    const diff = Math.abs(dBm - dbmValue)
    if (diff < minDiff) {
      minDiff = diff
      closestS = sMeter
    }
  }
  
  return closestS
}

// Main conversion function
export function convertValue(value, fromUnit) {
  // For S-Meter, value is a string, so check differently
  if (fromUnit !== 'S-Meter') {
    if (value === null || value === undefined || value === '' || isNaN(value)) {
      return {
        dBm: null,
        dBuV: null,
        dBV: null,
        sMeter: null
      }
    }
  } else {
    // For S-Meter, check if string is empty
    if (!value || String(value).trim() === '') {
      return {
        dBm: null,
        dBuV: null,
        dBV: null,
        sMeter: null
      }
    }
  }

  let dBm = null

  // Convert to dBm first (common reference)
  switch (fromUnit) {
    case 'dBm':
      dBm = parseFloat(value)
      break
    case 'dBµV':
      dBm = dBuVToDbm(parseFloat(value))
      break
    case 'dBV':
      dBm = dBVToDbm(parseFloat(value))
      break
    case 'S-Meter':
      // Convert to string and normalize case
      const sMeterStr = String(value).trim()
      dBm = sMeterToDbm(sMeterStr)
      break
    default:
      return { dBm: null, dBuV: null, dBV: null, sMeter: null }
  }

  if (dBm === null || isNaN(dBm)) {
    return { dBm: null, dBuV: null, dBV: null, sMeter: null }
  }

  // Convert from dBm to all other units
  return {
    dBm: parseFloat(dBm.toFixed(2)),
    dBuV: parseFloat(dBmToDbuV(dBm).toFixed(2)),
    dBV: parseFloat(dBmToDBV(dBm).toFixed(2)),
    sMeter: dBmToSMeter(dBm)
  }
}

// Get S-Meter reference table
export function getSMeterTable() {
  return Object.entries(S_METER_TABLE).map(([s, dBm]) => ({
    sMeter: s,
    dBm: dBm,
    dBuV: parseFloat(dBmToDbuV(dBm).toFixed(2)),
    dBV: parseFloat(dBmToDBV(dBm).toFixed(2))
  }))
}

// Get available S-Meter options for dropdown
export function getSMeterOptions() {
  return Object.keys(S_METER_TABLE)
}

// Validate if S-Meter string is valid format
export function isValidSMeterFormat(sMeter) {
  if (!sMeter || typeof sMeter !== 'string') return false
  
  // Check predefined table
  if (S_METER_TABLE[sMeter] !== undefined) return true
  
  const trimmed = sMeter.trim()
  
  // Match S1-S9
  if (/^S[1-9]$/i.test(trimmed)) return true
  
  // Match S9+X or S+X where X is a number
  if (/^S9\+\d+(?:\.\d+)?$/i.test(trimmed)) return true
  if (/^S\+\d+(?:\.\d+)?$/i.test(trimmed)) return true
  
  return false
}
