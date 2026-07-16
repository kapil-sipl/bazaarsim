import { useEffect, useRef, useState } from 'react'

const POLL_INTERVAL_MS = 20000

export function usePrices(symbols) {
  const [prices, setPrices] = useState({})
  const [status, setStatus] = useState('loading') // loading | live | error
  const [lastUpdated, setLastUpdated] = useState(null)
  const symbolsKey = symbols.join(',')

  useEffect(() => {
    let cancelled = false
    let timer

    async function fetchPrices() {
      try {
        const res = await fetch(`/api/quote?symbols=${encodeURIComponent(symbolsKey)}`)
        if (!res.ok) throw new Error('Bad response')
        const data = await res.json()
        if (cancelled) return
        setPrices(data.quotes || {})
        setStatus('live')
        setLastUpdated(Date.now())
      } catch {
        if (!cancelled) setStatus((prev) => (prev === 'loading' ? 'error' : prev))
      }
    }

    fetchPrices()
    timer = setInterval(fetchPrices, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [symbolsKey])

  return { prices, status, lastUpdated }
}
