import { USD_INR_SYMBOL } from '../data/instruments'

// Every instrument, regardless of asset class, needs a single INR price
// so the portfolio can hold one cash ledger. This is the only place
// that conversion logic lives.
export function getInrPrice(instrument, quotes) {
  const quote = quotes[instrument.symbol]
  if (!quote?.price) return null

  if (instrument.assetClass === 'CRYPTO') {
    const usdInr = quotes[USD_INR_SYMBOL]?.price
    if (!usdInr) return null
    return quote.price * usdInr
  }

  // STOCK (already INR) and FOREX (quoted directly vs INR) need no conversion.
  return quote.price
}

export function getNativePrice(instrument, quotes) {
  return quotes[instrument.symbol]?.price ?? null
}

export function assetClassLabel(assetClass) {
  return { STOCK: 'Stock', CRYPTO: 'Crypto', FOREX: 'Forex' }[assetClass] || assetClass
}
