import { formatNative, formatPercent } from '../lib/format'

export default function TickerTape({ instruments, prices }) {
  // Duplicate the list so the CSS animation can loop seamlessly at -50%.
  const items = [...instruments, ...instruments]

  return (
    <div className="relative overflow-hidden border-b border-ink-700 bg-ink-950/60 py-2">
      <div className="ticker-track flex w-max gap-8 whitespace-nowrap px-4 hover:[animation-play-state:paused]">
        {items.map((instrument, i) => {
          const quote = prices[instrument.symbol]
          const change = quote?.changePercent
          const isUp = change > 0
          const isDown = change < 0
          return (
            <div key={`${instrument.symbol}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-ink-300">{displaySymbol(instrument)}</span>
              <span className="tabular font-mono text-ink-100">
                {formatNative(quote?.price, instrument.currency)}
              </span>
              <span
                className={`tabular font-mono text-xs ${
                  isUp ? 'text-gain-400' : isDown ? 'text-loss-400' : 'text-ink-400'
                }`}
              >
                {change !== undefined ? formatPercent(change) : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function displaySymbol(instrument) {
  if (instrument.assetClass === 'STOCK') return instrument.symbol.replace('.NS', '')
  if (instrument.assetClass === 'CRYPTO') return instrument.symbol.replace('-USD', '')
  return instrument.symbol.replace('=X', '')
}
