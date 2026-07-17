import { useMemo, useState } from 'react'

const PERCENT_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100]

export default function BuySellCalculator() {
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [pct1, setPct1] = useState(50)
  const [pct2, setPct2] = useState(50)

  const buy = parseFloat(buyAmount) || 0
  const sell = parseFloat(sellAmount) || 0

  const result = useMemo(() => sell - buy, [buy, sell])
  const pct1Value = useMemo(() => (result * pct1) / 100, [result, pct1])
  const pct2Value = useMemo(() => (pct1Value * pct2) / 100, [pct1Value, pct2])

  const resultTone = result > 0 ? 'text-gain-400' : result < 0 ? 'text-loss-400' : 'text-ink-100'

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800 shadow-panel">
      <div className="border-b border-ink-700 px-5 py-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">
          BTC Buy/Sell Calculator
        </h2>
        <p className="mt-0.5 text-xs text-ink-400">
          Net result from your buy and sell amounts, then split it down by percentage
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
              Buy amount (USD)
            </label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
              Sell amount (USD)
            </label>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-marigold-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
            Result (Sell − Buy)
          </label>
          <input
            readOnly
            value={result ? `$${result.toFixed(2)}` : '$0.00'}
            className={`w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm font-mono tabular ${resultTone}`}
          />
        </div>

        <div className="border-t border-ink-700 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                % of result
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
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                Value at {pct1}%
              </label>
              <input
                readOnly
                value={`$${pct1Value.toFixed(2)}`}
                className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm font-mono tabular text-ink-100"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-400">
                % of that value
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
                value={`$${pct2Value.toFixed(2)}`}
                className="w-full rounded-md border border-marigold-500/50 bg-ink-900 px-3 py-2 text-sm font-mono tabular text-marigold-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
