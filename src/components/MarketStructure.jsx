import { useState } from 'react'
import { formatNumber } from '../lib/format'

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h']
const LOOKBACKS = [1, 2, 3, 4, 6, 8, 12, 24, 48]

export default function MarketStructure() {
  const [timeframe, setTimeframe] = useState('15m')
  const [hours, setHours] = useState(4)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/structure?timeframe=${timeframe}&hours=${hours}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not reach the analysis service. Try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="border-b border-ink-700 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">
          BTC Structure Analyzer
        </h2>
        <p className="mt-0.5 text-xs text-ink-400">
          Higher High / Lower Low / Mid Point over a chosen lookback window
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 px-5 py-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Lookback</label>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
          >
            {LOOKBACKS.map((h) => (
              <option key={h} value={h}>{h}h</option>
            ))}
          </select>
        </div>

        <button
          onClick={analyze}
          disabled={loading}
          className="rounded-md bg-marigold-500 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-marigold-400 disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="mx-5 mb-4 rounded-md bg-loss-600/15 px-4 py-2.5 text-sm text-loss-400">
          {error}
        </div>
      )}

      {result && (
        <div className="border-t border-ink-700 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-ink-400">
              {result.symbol} · {result.timeframe} · last {result.lookback_hours}h · {result.candles_used} candles
            </span>
            <BiasPill bias={result.bias} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Higher High" value={formatNumber(result.higher_high)} tone="gain" />
            <Stat label="Lower Low" value={formatNumber(result.lower_low)} tone="loss" />
            <Stat label="Mid Point" value={formatNumber(result.mid_point)} />
            <Stat label="Range" value={formatNumber(result.range)} />
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-ink-700/40 px-4 py-2.5 text-sm">
            <span className="text-ink-300">Current price vs. mid point</span>
            <span
              className={`font-mono tabular ${
                result.distance_from_current_price > 0
                  ? 'text-gain-400'
                  : result.distance_from_current_price < 0
                  ? 'text-loss-400'
                  : 'text-ink-400'
              }`}
            >
              {result.distance_from_current_price > 0 ? '+' : ''}
              {formatNumber(result.distance_from_current_price)}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-ink-500">{result.data_source}</p>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, tone }) {
  const toneClass = tone === 'gain' ? 'text-gain-400' : tone === 'loss' ? 'text-loss-400' : 'text-ink-100'
  return (
    <div className="rounded-lg bg-ink-700/30 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-400">{label}</div>
      <div className={`font-mono tabular text-sm ${toneClass}`}>{value}</div>
    </div>
  )
}

function BiasPill({ bias }) {
  const map = {
    Bullish: 'bg-gain-600/20 text-gain-400',
    Bearish: 'bg-loss-600/20 text-loss-400',
    Neutral: 'bg-ink-600 text-ink-200'
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${map[bias] || map.Neutral}`}>
      {bias}
    </span>
  )
}
