// Pure functions only — no side effects — so they're easy to reason about and test.

export function canBuy(portfolio, price, qty) {
  const cost = price * qty
  return cost > 0 && cost <= portfolio.cash + 1e-6
}

export function canSell(portfolio, symbol, qty) {
  const holding = portfolio.holdings[symbol]
  return !!holding && holding.qty >= qty
}

export function executeBuy(portfolio, symbol, price, qty) {
  const cost = price * qty
  const existing = portfolio.holdings[symbol]
  const newQty = (existing?.qty || 0) + qty
  const newAvgPrice = existing
    ? (existing.avgPrice * existing.qty + cost) / newQty
    : price

  const trade = {
    id: crypto.randomUUID(),
    symbol,
    side: 'BUY',
    qty,
    price,
    timestamp: Date.now()
  }

  return {
    ...portfolio,
    cash: portfolio.cash - cost,
    holdings: {
      ...portfolio.holdings,
      [symbol]: { qty: newQty, avgPrice: newAvgPrice }
    },
    trades: [trade, ...portfolio.trades]
  }
}

export function executeSell(portfolio, symbol, price, qty) {
  const existing = portfolio.holdings[symbol]
  if (!existing || existing.qty < qty) return portfolio

  const proceeds = price * qty
  const realizedPnl = (price - existing.avgPrice) * qty
  const remainingQty = existing.qty - qty

  const nextHoldings = { ...portfolio.holdings }
  if (remainingQty <= 0) {
    delete nextHoldings[symbol]
  } else {
    nextHoldings[symbol] = { qty: remainingQty, avgPrice: existing.avgPrice }
  }

  const trade = {
    id: crypto.randomUUID(),
    symbol,
    side: 'SELL',
    qty,
    price,
    timestamp: Date.now(),
    realizedPnl
  }

  return {
    ...portfolio,
    cash: portfolio.cash + proceeds,
    holdings: nextHoldings,
    trades: [trade, ...portfolio.trades]
  }
}

export function portfolioStats(portfolio, latestPrices) {
  let investedValue = 0
  let currentValue = 0

  for (const [symbol, holding] of Object.entries(portfolio.holdings)) {
    const price = latestPrices[symbol]?.price ?? holding.avgPrice
    investedValue += holding.avgPrice * holding.qty
    currentValue += price * holding.qty
  }

  const unrealizedPnl = currentValue - investedValue
  const realizedPnl = portfolio.trades
    .filter((t) => t.side === 'SELL')
    .reduce((sum, t) => sum + (t.realizedPnl || 0), 0)

  const netWorth = portfolio.cash + currentValue
  const totalPnl = netWorth - portfolio.startingBalance

  const sells = portfolio.trades.filter((t) => t.side === 'SELL')
  const wins = sells.filter((t) => (t.realizedPnl || 0) > 0).length
  const winRate = sells.length ? (wins / sells.length) * 100 : null

  return {
    investedValue,
    currentValue,
    unrealizedPnl,
    realizedPnl,
    netWorth,
    totalPnl,
    totalPnlPercent: (totalPnl / portfolio.startingBalance) * 100,
    winRate,
    totalTrades: portfolio.trades.length
  }
}
