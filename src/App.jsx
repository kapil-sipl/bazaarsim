import { useEffect, useMemo, useState } from 'react'
import TickerTape from './components/TickerTape'
import SummaryBar from './components/SummaryBar'
import Watchlist from './components/Watchlist'
import Holdings from './components/Holdings'
import TradeHistory from './components/TradeHistory'
import TradeModal from './components/TradeModal'
import OnboardingModal from './components/OnboardingModal'
import { ALL_INSTRUMENTS, INSTRUMENT_LOOKUP, DEFAULT_STARTING_BALANCE } from './data/instruments'
import { usePrices } from './lib/usePrices'
import { getInrPrice, getNativePrice } from './lib/markets'
import { loadPortfolio, savePortfolio, createFreshPortfolio, hasVisitedBefore, markVisited } from './lib/storage'
import { canBuy, canSell, executeBuy, executeSell, portfolioStats } from './lib/trading'

const SYMBOLS = ALL_INSTRUMENTS.map((s) => s.symbol)

export default function App() {
  const [portfolio, setPortfolio] = useState(loadPortfolio)
  const [activeTrade, setActiveTrade] = useState(null) // { instrument, side }
  const [showOnboarding, setShowOnboarding] = useState(!hasVisitedBefore())
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [toast, setToast] = useState(null)

  const { prices, status: priceStatus } = usePrices(SYMBOLS)

  // A single INR price per symbol — this is what the portfolio, holdings,
  // and P&L math use regardless of whether the instrument is a stock,
  // a USD-priced crypto asset, or a currency pair quoted vs INR.
  const inrPrices = useMemo(() => {
    const map = {}
    for (const instrument of ALL_INSTRUMENTS) {
      const price = getInrPrice(instrument, prices)
      if (price) map[instrument.symbol] = { price }
    }
    return map
  }, [prices])

  useEffect(() => {
    savePortfolio(portfolio)
  }, [portfolio])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const stats = useMemo(() => portfolioStats(portfolio, inrPrices), [portfolio, inrPrices])

  function handleDismissOnboarding() {
    markVisited()
    setShowOnboarding(false)
  }

  function openTrade(instrument, side) {
    if (side === 'SELL' && !portfolio.holdings[instrument.symbol]) return
    setActiveTrade({ instrument, side })
  }

  function confirmTrade(qty) {
    const { instrument, side } = activeTrade
    const price = inrPrices[instrument.symbol]?.price
    if (!price) return

    if (side === 'BUY') {
      if (!canBuy(portfolio, price, qty)) return
      setPortfolio((p) => executeBuy(p, instrument.symbol, price, qty))
      setToast(`Bought ${qty} ${displaySymbol(instrument)} @ ₹${price.toFixed(2)}`)
    } else {
      if (!canSell(portfolio, instrument.symbol, qty)) return
      setPortfolio((p) => executeSell(p, instrument.symbol, price, qty))
      setToast(`Sold ${qty} ${displaySymbol(instrument)} @ ₹${price.toFixed(2)}`)
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
      <TickerTape instruments={ALL_INSTRUMENTS} prices={prices} />

      <header className="border-b border-ink-700 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink-100">
              Bazaar Sim
            </h1>
            <p className="text-xs text-ink-400">
              Paper trading · stocks, crypto & forex · not real money
            </p>
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
            <Watchlist prices={prices} priceStatus={priceStatus} onTrade={openTrade} />
          </div>
          <div className="space-y-5 lg:col-span-2">
            <Holdings
              holdings={portfolio.holdings}
              prices={prices}
              instrumentLookup={INSTRUMENT_LOOKUP}
              onTrade={openTrade}
            />
          </div>
        </div>

        <TradeHistory trades={portfolio.trades} />
      </main>

      <footer className="px-5 py-6 text-center text-xs text-ink-500 sm:px-8">
        Simulated prices sourced with a short delay. Crypto is converted to INR at the live
        USD/INR rate. No brokerage, demat, wallet, or real funds are involved.
      </footer>

      {showOnboarding && (
        <OnboardingModal startingBalance={portfolio.startingBalance} onDismiss={handleDismissOnboarding} />
      )}

      {activeTrade && (
        <TradeModal
          trade={activeTrade}
          inrPrice={inrPrices[activeTrade.instrument.symbol]?.price}
          nativePrice={getNativePrice(activeTrade.instrument, prices)}
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

function displaySymbol(instrument) {
  if (instrument.assetClass === 'STOCK') return instrument.symbol.replace('.NS', '')
  if (instrument.assetClass === 'CRYPTO') return instrument.symbol.replace('-USD', '')
  return instrument.symbol.replace('=X', '')
}
