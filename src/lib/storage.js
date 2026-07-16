import { DEFAULT_STARTING_BALANCE } from '../data/instruments'

const STORAGE_KEY = 'bazaar-sim-portfolio-v1'

export function loadPortfolio() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createFreshPortfolio()
    const parsed = JSON.parse(raw)
    // Guard against a corrupted or older-shape record.
    if (!parsed || typeof parsed.cash !== 'number' || !parsed.holdings || !Array.isArray(parsed.trades)) {
      return createFreshPortfolio()
    }
    return parsed
  } catch {
    return createFreshPortfolio()
  }
}

export function savePortfolio(portfolio) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio))
    return true
  } catch {
    return false
  }
}

export function createFreshPortfolio(startingBalance = DEFAULT_STARTING_BALANCE) {
  return {
    startingBalance,
    cash: startingBalance,
    holdings: {}, // symbol -> { qty, avgPrice }
    trades: [], // { id, symbol, side, qty, price, timestamp, realizedPnl? }
    createdAt: Date.now()
  }
}

export function hasVisitedBefore() {
  return window.localStorage.getItem('bazaar-sim-visited') === 'true'
}

export function markVisited() {
  window.localStorage.setItem('bazaar-sim-visited', 'true')
}
