import { useState } from 'react'
import { formatNative, formatPercent } from '../lib/format'
import { getInrPrice } from '../lib/markets'
import { ASSET_CLASSES } from '../data/instruments'

export default function Watchlist({ prices, priceStatus, onTrade }) {
  const [activeClass, setActiveClass] = useState('STOCK')
  const instruments = ASSET_CLASSES.find((c) => c.key === activeClass).list

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
        <div className="flex gap-1">
          {ASSET_CLASSES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveClass(c.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                activeClass === c.key
                  ? 'bg-marigold-500/15 text-marigold-400'
                  : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <StatusPill status={priceStatus} />
      </div>
      <div className="thin-scroll max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-ink-800 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-2 text-left font-medium">Instrument</th>
              <th className="px-3 py-2 text-right font-medium">Price</th>
              <th className="px-3 py-2 text-right font-medium">Chg%</th>
              <th className="px-5 py-2 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument) => {
              const quote = prices[instrument.symbol]
              const change = quote?.changePercent
              const isUp = change > 0
              const isDown = change < 0
              const inrPrice = getInrPrice(instrument, prices)
              return (
                <tr key={instrument.symbol} className="border-t border-ink-700/60 hover:bg-ink-700/30">
                  <td className="px-5 py-2.5">
                    <div className="font-medium text-ink-100">{displaySymbol(instrument)}</div>
                    <div className="text-xs text-ink-400">{instrument.name}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular text-ink-100">
                    {formatNative(quote?.price, instrument.currency)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono tabular text-xs ${
                      isUp ? 'text-gain-400' : isDown ? 'text-loss-400' : 'text-ink-400'
                    }`}
                  >
                    {change !== undefined && change !== null ? formatPercent(change) : '—'}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onTrade(instrument, 'BUY')}
                        disabled={!inrPrice}
                        className="rounded-md bg-gain-600/20 px-2.5 py-1 text-xs font-medium text-gain-400 transition hover:bg-gain-600/30 disabled:opacity-40"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => onTrade(instrument, 'SELL')}
                        disabled={!inrPrice}
                        className="rounded-md bg-loss-600/20 px-2.5 py-1 text-xs font-medium text-loss-400 transition hover:bg-loss-600/30 disabled:opacity-40"
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function displaySymbol(instrument) {
  if (instrument.assetClass === 'STOCK') return instrument.symbol.replace('.NS', '')
  if (instrument.assetClass === 'CRYPTO') return instrument.symbol.replace('-USD', '')
  return instrument.symbol.replace('=X', '')
}

function StatusPill({ status }) {
  const map = {
    loading: { label: 'Connecting…', className: 'bg-ink-600 text-ink-200' },
    live: { label: 'Live · 20s refresh', className: 'bg-gain-600/20 text-gain-400' },
    error: { label: 'Price feed unavailable', className: 'bg-loss-600/20 text-loss-400' }
  }
  const { label, className } = map[status] || map.loading
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}>{label}</span>
  )
}
