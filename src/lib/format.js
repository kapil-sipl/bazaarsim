const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
})

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
})

export function formatINR(value, { whole = false } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return whole ? inrWhole.format(value) : inrFormatter.format(value)
}

export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value)
}

export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

const currencySymbols = { USD: '$', INR: '₹', JPY: '¥', EUR: '€', GBP: '£' }

// For displaying an instrument's native quoted price (e.g. crypto in USD,
// a forex pair already in INR) alongside its own currency, separate from
// the INR-converted price used for portfolio math.
export function formatNative(value, currency, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  const symbol = currencySymbols[currency] || `${currency} `
  return `${symbol}${formatNumber(value, decimals)}`
}

export function formatDateTime(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
