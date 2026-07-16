import { formatDateTime, formatINR, formatNumber } from '../lib/format'

export default function TradeHistory({ trades }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="border-b border-ink-700 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">
          Trade history
        </h2>
      </div>

      {trades.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-ink-400">
          Your executed trades will show up here.
        </div>
      ) : (
        <div className="thin-scroll max-h-[280px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-ink-800 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-5 py-2 text-left font-medium">Stock</th>
                <th className="px-3 py-2 text-left font-medium">Side</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Realized P&L</th>
                <th className="px-5 py-2 text-right font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-t border-ink-700/60">
                  <td className="px-5 py-2.5 font-medium text-ink-100">
                    {trade.symbol.replace('.NS', '')}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                        trade.side === 'BUY'
                          ? 'bg-gain-600/20 text-gain-400'
                          : 'bg-loss-600/20 text-loss-400'
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular">{trade.qty}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular">
                    {formatNumber(trade.price)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono tabular text-xs ${
                      trade.realizedPnl > 0
                        ? 'text-gain-400'
                        : trade.realizedPnl < 0
                        ? 'text-loss-400'
                        : 'text-ink-400'
                    }`}
                  >
                    {trade.realizedPnl !== undefined ? formatINR(trade.realizedPnl, { whole: true }) : '—'}
                  </td>
                  <td className="px-5 py-2.5 text-right text-xs text-ink-400">
                    {formatDateTime(trade.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
