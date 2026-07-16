import { useMemo, useState } from 'react'
import { formatINR, formatNumber } from '../lib/format'

export default function TradeModal({ trade, price, portfolio, onConfirm, onClose }) {
  const [qty, setQty] = useState(1)
  const { stock, side } = trade

  const maxQty = useMemo(() => {
    if (side === 'BUY') return Math.max(1, Math.floor(portfolio.cash / price))
    return portfolio.holdings[stock.symbol]?.qty || 0
  }, [side, price, portfolio, stock.symbol])

  const total = price * qty
  const isValid = qty > 0 && (side === 'BUY' ? total <= portfolio.cash : qty <= maxQty)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-ink-700 bg-ink-800 p-6 shadow-panel">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-100">
              {side === 'BUY' ? 'Buy' : 'Sell'} {stock.symbol.replace('.NS', '')}
            </h3>
            <p className="text-xs text-ink-400">{stock.name}</p>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-100" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-ink-700/50 px-4 py-3">
          <span className="text-xs text-ink-400">Market price</span>
          <span className="font-mono tabular text-ink-100">{formatNumber(price)}</span>
        </div>

        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">Quantity</label>
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-md bg-ink-700 text-ink-100 hover:bg-ink-600"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={maxQty || undefined}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-center font-mono tabular text-ink-100 focus:border-marigold-500 focus:outline-none"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="h-9 w-9 rounded-md bg-ink-700 text-ink-100 hover:bg-ink-600"
          >
            +
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-400">
          {side === 'BUY'
            ? `Max ${maxQty} share${maxQty === 1 ? '' : 's'} with available cash`
            : `You hold ${maxQty} share${maxQty === 1 ? '' : 's'}`}
        </p>

        <div className="mb-5 flex items-center justify-between border-t border-ink-700 pt-3">
          <span className="text-sm text-ink-300">Estimated total</span>
          <span className="font-mono tabular text-lg text-ink-100">
            {formatINR(total, { whole: true })}
          </span>
        </div>

        {!isValid && (
          <p className="mb-3 text-xs text-loss-400">
            {side === 'BUY' ? "That's more than your available cash." : "You don't hold that many shares."}
          </p>
        )}

        <button
          disabled={!isValid}
          onClick={() => onConfirm(qty)}
          className={`w-full rounded-md py-2.5 text-sm font-semibold transition ${
            side === 'BUY'
              ? 'bg-gain-500 text-ink-950 hover:bg-gain-400'
              : 'bg-loss-500 text-ink-950 hover:bg-loss-400'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Confirm {side === 'BUY' ? 'buy' : 'sell'}
        </button>
      </div>
    </div>
  )
}
