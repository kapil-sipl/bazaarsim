import { useEffect, useState } from 'react'

const PERCENT_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100]

export default function TPSLCalculator({ side }) {
  const isBuy = side === 'BUY'

  const [amount, setAmount] = useState('')
  const [entryPrice, setEntryPrice] = useState('')
  const [priceStatus, setPriceStatus] = useState('loading') // loading | live | error
  const [pct1, setPct1] = useState(40)
  const [pct2, setPct2] = useState(10)

  useEffect(() => {
    fetchLivePrice()
  }, [])

  async function fetchLivePrice() {
    setPriceStatus('loading')
    try {
      const res = await fetch('/api/quote?symbols=BTC-USD')
      const data = await res.json()
      const price = data?.quotes?.['BTC-USD']?.price
      if (price) {
        setEntryPrice(String(price.toFixed(2)))
        setPriceStatus('live')
      } else {
        setPriceStatus('error')
      }
    } catch {
      setPriceStatus('error')
    }
  }

  const amountNum = parseFloat(amount) || 0
  const entryNum = parseFloat(entryPrice) || 0

  const targetPrice = isBuy
    ? entryNum * (1 + pct1 / 100)
    : entryNum * (1 - pct1 / 100)

  const pnlAtPct1 = amountNum * (pct1 / 100)
  const finalValue = pnlAtPct1 * (pct2 / 100)

  const accent = isBuy ? 'text-gain-400' : 'text-loss-400'
  const accentBorder = isBuy ? 'border-gain-500/50' : 'border-loss-500/50'

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
        <div>
          <h2 className={`font-display text-sm font-semibold tracking-wide ${accent}`}>
            {isBuy ? 'Buy · TP Calculator' : 'Sell · SL Calculator'}
          </h2>
          <p className="mt-0.5 text-xs text-ink-400">
            {isBuy ? 'Target price if BTC rises by your chosen %' : 'Target price if BTC falls by your chosen %'}
          </p>
        </div>
        <PriceStatusPill status={priceStatus} onRetry={fetchLivePrice} />
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
              Amount invested ($)
            </label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
              Entry price ($)
            </label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-ink-700 pt-4">
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
            {isBuy ? 'Take-profit %' : 'Stop-loss %'}
          </label>
          <select
            value={pct1}
            onChange={(e) => setPct1(Number(e.target.value))}
            className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
          >
            {PERCENT_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}%</option>
            ))}
          </select>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                Target price
              </label>
              <input
                readOnly
                value={targetPrice ? `$${targetPrice.toFixed(2)}` : '$0.00'}
                className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm font-mono tabular text-ink-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                {isBuy ? 'Profit at this %' : 'Loss covered at this %'}
              </label>
              <input
                readOnly
                value={`$${pnlAtPct1.toFixed(2)}`}
                className={`w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm font-mono tabular ${accent}`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-ink-700 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                % of that {isBuy ? 'profit' : 'loss'}
              </label>
              <select
                value={pct2}
                onChange={(e) => setPct2(Number(e.target.value))}
                className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
              >
                {PERCENT_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}%</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                Final value
              </label>
              <input
                readOnly
                value={`$${finalValue.toFixed(2)}`}
                className={`w-full rounded-md border bg-ink-900 px-3 py-2 text-sm font-mono tabular text-marigold-400 ${accentBorder}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceStatusPill({ status, onRetry }) {
  if (status === 'live') {
    return <span className="text-[11px] text-gain-400">Live price loaded</span>
  }
  if (status === 'error') {
    return (
      <button onClick={onRetry} className="text-[11px] text-loss-400 underline">
        Price feed failed · retry
      </button>
    )
  }
  return <span className="text-[11px] text-ink-400">Loading price…</span>
}
