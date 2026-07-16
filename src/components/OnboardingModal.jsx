import { formatINR } from '../lib/format'

export default function OnboardingModal({ startingBalance, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4">
      <div className="w-full max-w-md rounded-xl border border-ink-700 bg-ink-800 p-7 shadow-panel">
        <span className="mb-3 inline-block rounded-full bg-marigold-500/15 px-3 py-1 text-xs font-medium text-marigold-400">
          Paper trading · stocks, crypto & forex
        </span>
        <h2 className="mb-2 font-display text-xl font-semibold text-ink-100">
          Trade NSE stocks, crypto, and currency pairs — zero risk
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-ink-300">
          You're starting with {formatINR(startingBalance, { whole: true })} in virtual cash.
          Prices track the real market with a short delay, and everything settles in one INR
          ledger — crypto is auto-converted at the live USD/INR rate. Every buy and sell here is
          simulated — no broker, demat, or wallet involved.
        </p>
        <ul className="mb-6 space-y-2 text-sm text-ink-300">
          <li className="flex gap-2">
            <span className="text-marigold-400">•</span>
            Prices refresh automatically every 20 seconds.
          </li>
          <li className="flex gap-2">
            <span className="text-marigold-400">•</span>
            Your portfolio is saved in this browser — it'll be here next time you visit.
          </li>
          <li className="flex gap-2">
            <span className="text-marigold-400">•</span>
            Reset anytime from the top bar to start a fresh simulation.
          </li>
        </ul>
        <button
          onClick={onDismiss}
          className="w-full rounded-md bg-marigold-500 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-marigold-400"
        >
          Start trading
        </button>
      </div>
    </div>
  )
}
