import { formatINR, formatPercent } from '../lib/format'

function StatBlock({ label, value, sub, tone = 'neutral' }) {
  const toneClass =
    tone === 'gain' ? 'text-gain-400' : tone === 'loss' ? 'text-loss-400' : 'text-ink-100'
  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      <span className="text-xs uppercase tracking-wide text-ink-400">{label}</span>
      <span className={`font-mono text-xl tabular ${toneClass}`}>{value}</span>
      {sub && <span className="text-xs text-ink-400">{sub}</span>}
    </div>
  )
}

export default function SummaryBar({ stats, cash }) {
  const pnlTone = stats.totalPnl > 0 ? 'gain' : stats.totalPnl < 0 ? 'loss' : 'neutral'

  return (
    <div className="grid grid-cols-2 divide-x divide-ink-700 rounded-xl border border-ink-700 bg-ink-800 shadow-panel sm:grid-cols-4">
      <StatBlock label="Net worth" value={formatINR(stats.netWorth, { whole: true })} />
      <StatBlock label="Available cash" value={formatINR(cash, { whole: true })} />
      <StatBlock
        label="Total P&L"
        value={formatINR(stats.totalPnl, { whole: true })}
        sub={formatPercent(stats.totalPnlPercent)}
        tone={pnlTone}
      />
      <StatBlock
        label="Win rate"
        value={stats.winRate === null ? '—' : `${stats.winRate.toFixed(0)}%`}
        sub={`${stats.totalTrades} trade${stats.totalTrades === 1 ? '' : 's'}`}
      />
    </div>
  )
}
