import { useEffect, useMemo, useState } from 'react'
import TickerTape from './components/TickerTape'
import SummaryBar from './components/SummaryBar'
import Watchlist from './components/Watchlist'
import Holdings from './components/Holdings'
import TradeHistory from './components/TradeHistory'
import TradeModal from './components/TradeModal'
import OnboardingModal from './components/OnboardingModal'
import { STOCK_UNIVERSE, DEFAULT_STARTING_BALANCE } from './data/stocks'
import { usePrices } from './lib/usePrices'
import { loadPortfolio, savePortfolio, createFreshPortfolio, hasVisitedBefore, markVisited } from './lib/storage'
import { canBuy, canSell, executeBuy, executeSell, portfolioStats } from './lib/trading'

const SYMBOLS = STOCK_UNIVERSE.map((s) => s.symbol)
const STOCK_LOOKUP = Object.fromEntries(STOCK_UNIVERSE.map((s) => [s.symbol, s]))

export default function App() {
  const [portfolio, setPortfolio] = useState(loadPortfolio)
  const [activeTrade, setActiveTrade] = useState(null) // { stock, side }
  const [showOnboarding, setShowOnboarding] = useState(!hasVisitedBefore())
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [toast, setToast] = useState(null)

  const { prices, status: priceStatus } = usePrices(SYMBOLS)

  useEffect(() => {
    savePortfolio(portfolio)
  }, [portfolio])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const stats = useMemo(() => portfolioStats(portfolio, prices), [portfolio, prices])

  function handleDismissOnboarding() {
    markVisited()
    setShowOnboarding(false)
  }

  function openTrade(stock, side) {
    if (side === 'SELL' && !portfolio.holdings[stock.symbol]) return
    setActiveTrade({ stock, side })
  }

  function confirmTrade(qty) {
    const { stock, side } = activeTrade
    const price = prices[stock.symbol]?.price
    if (!price) return

    if (side === 'BUY') {
      if (!canBuy(portfolio, price, qty)) return
      setPortfolio((p) => executeBuy(p, stock.symbol, price, qty))
      setToast(`Bought ${qty} ${stock.symbol.replace('.NS', '')} @ ${price.toFixed(2)}`)
    } else {
      if (!canSell(portfolio, stock.symbol, qty)) return
      setPortfolio((p) => executeSell(p, stock.symbol, price, qty))
      setToast(`Sold ${qty} ${stock.symbol.replace('.NS', '')} @ ${price.toFixed(2)}`)
    }
    setActiveTrade(null)
  }

  function handleReset() {
    setPortfolio(createFreshPortfolio(DEFAULT_STARTING_BALANCE))
    setShowResetConfirm(false)
    setToast('Portfolio reset. Fresh start!')
  }

  return (
    <div className="min-h-screen">
      <TickerTape stocks={STOCK_UNIVERSE} prices={prices} />

      <header className="border-b border-ink-700 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink-100">
              Bazaar Sim
            </h1>
            <p className="text-xs text-ink-400">Paper trading for Indian equities · not real money</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="rounded-md border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-ink-100"
          >
            Reset portfolio
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-6 sm:px-8">
        <SummaryBar stats={stats} cash={portfolio.cash} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Watchlist
              stocks={STOCK_UNIVERSE}
              prices={prices}
              priceStatus={priceStatus}
              onTrade={openTrade}
            />
          </div>
          <div className="space-y-5 lg:col-span-2">
            <Holdings
              holdings={portfolio.holdings}
              prices={prices}
              stockLookup={STOCK_LOOKUP}
              onTrade={openTrade}
            />
          </div>
        </div>

        <TradeHistory trades={portfolio.trades} />
      </main>

      <footer className="px-5 py-6 text-center text-xs text-ink-500 sm:px-8">
        Simulated prices sourced with a short delay. No brokerage, demat, or real funds are involved.
      </footer>

      {showOnboarding && (
        <OnboardingModal startingBalance={portfolio.startingBalance} onDismiss={handleDismissOnboarding} />
      )}

      {activeTrade && (
        <TradeModal
          trade={activeTrade}
          price={prices[activeTrade.stock.symbol]?.price}
          portfolio={portfolio}
          onConfirm={confirmTrade}
          onClose={() => setActiveTrade(null)}
        />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4">
          <div className="w-full max-w-sm rounded-xl border border-ink-700 bg-ink-800 p-6 shadow-panel">
            <h3 className="mb-2 font-display text-lg font-semibold text-ink-100">Reset portfolio?</h3>
            <p className="mb-5 text-sm text-ink-300">
              This clears all holdings and trade history and starts you fresh with{' '}
              {DEFAULT_STARTING_BALANCE.toLocaleString('en-IN')} in virtual cash. This can't be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-md border border-ink-600 py-2 text-sm text-ink-300 hover:border-ink-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-md bg-loss-500 py-2 text-sm font-semibold text-ink-950 hover:bg-loss-400"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ink-100 shadow-panel">
          {toast}
        </div>
      )}
    </div>
  )
}
