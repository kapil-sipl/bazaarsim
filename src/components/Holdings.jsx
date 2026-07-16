import { formatINR, formatNumber, formatPercent } from '../lib/format'

export default function Holdings({ holdings, prices, stockLookup, onTrade }) {
  const entries = Object.entries(holdings)

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="border-b border-ink-700 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">Holdings</h2>
      </div>

      {entries.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-ink-400">
          No open positions yet. Buy something from the watchlist to get started.
        </div>
      ) : (
        <div className="thin-scroll max-h-[320px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-ink-800 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-5 py-2 text-left font-medium">Stock</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Avg cost</th>
                <th className="px-3 py-2 text-right font-medium">LTP</th>
                <th className="px-3 py-2 text-right font-medium">P&L</th>
                <th className="px-5 py-2 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([symbol, holding]) => {
                const quote = prices[symbol]
                const ltp = quote?.price ?? holding.avgPrice
                const pnl = (ltp - holding.avgPrice) * holding.qty
                const pnlPercent = ((ltp - holding.avgPrice) / holding.avgPrice) * 100
                const stock = stockLookup[symbol]
                return (
                  <tr key={symbol} className="border-t border-ink-700/60">
                    <td className="px-5 py-2.5">
                      <div className="font-medium text-ink-100">{symbol.replace('.NS', '')}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular">{holding.qty}</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular">
                      {formatNumber(holding.avgPrice)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular">{formatNumber(ltp)}</td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono tabular text-xs ${
                        pnl > 0 ? 'text-gain-400' : pnl < 0 ? 'text-loss-400' : 'text-ink-400'
                      }`}
                    >
                      {formatINR(pnl, { whole: true })}
                      <div className="text-[10px]">{formatPercent(pnlPercent)}</div>
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => onTrade(stock, 'SELL')}
                        className="rounded-md bg-loss-600/20 px-2.5 py-1 text-xs font-medium text-loss-400 transition hover:bg-loss-600/30"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
