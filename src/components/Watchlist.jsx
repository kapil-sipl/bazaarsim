import { formatNumber, formatPercent } from '../lib/format'

export default function Watchlist({ stocks, prices, priceStatus, onTrade }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">
          Watchlist
        </h2>
        <StatusPill status={priceStatus} />
      </div>
      <div className="thin-scroll max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-ink-800 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-2 text-left font-medium">Stock</th>
              <th className="px-3 py-2 text-right font-medium">LTP</th>
              <th className="px-3 py-2 text-right font-medium">Chg%</th>
              <th className="px-5 py-2 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const quote = prices[stock.symbol]
              const change = quote?.changePercent
              const isUp = change > 0
              const isDown = change < 0
              return (
                <tr key={stock.symbol} className="border-t border-ink-700/60 hover:bg-ink-700/30">
                  <td className="px-5 py-2.5">
                    <div className="font-medium text-ink-100">{stock.symbol.replace('.NS', '')}</div>
                    <div className="text-xs text-ink-400">{stock.name}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular text-ink-100">
                    {quote?.price ? formatNumber(quote.price) : '—'}
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
                        onClick={() => onTrade(stock, 'BUY')}
                        disabled={!quote?.price}
                        className="rounded-md bg-gain-600/20 px-2.5 py-1 text-xs font-medium text-gain-400 transition hover:bg-gain-600/30 disabled:opacity-40"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => onTrade(stock, 'SELL')}
                        disabled={!quote?.price}
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
