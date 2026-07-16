import { formatNumber, formatPercent } from '../lib/format'

export default function TickerTape({ stocks, prices }) {
  // Duplicate the list so the CSS animation can loop seamlessly at -50%.
  const items = [...stocks, ...stocks]

  return (
    <div className="relative overflow-hidden border-b border-ink-700 bg-ink-950/60 py-2">
      <div className="ticker-track flex w-max gap-8 whitespace-nowrap px-4 hover:[animation-play-state:paused]">
        {items.map((stock, i) => {
          const quote = prices[stock.symbol]
          const change = quote?.changePercent
          const isUp = change > 0
          const isDown = change < 0
          return (
            <div key={`${stock.symbol}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-ink-300">{stock.symbol.replace('.NS', '')}</span>
              <span className="tabular font-mono text-ink-100">
                {quote?.price ? formatNumber(quote.price) : '—'}
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
