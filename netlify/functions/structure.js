// Netlify Functions version of the same logic in /api/structure.js.
// netlify.toml already redirects /api/* to this functions folder.

const CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD'

const YAHOO_INTERVAL = { '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m', '1h': '60m' }
const MAX_RANGE_DAYS = { '1m': 7, '5m': 59, '15m': 59, '30m': 59, '1h': 59 }

export async function handler(event) {
  const timeframe = event.queryStringParameters?.timeframe || '15m'
  const hours = Number(event.queryStringParameters?.hours)

  if (!YAHOO_INTERVAL[timeframe]) {
    return response(400, { error: `Unsupported timeframe "${timeframe}". Use one of: ${Object.keys(YAHOO_INTERVAL).join(', ')}` })
  }
  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) {
    return response(400, { error: 'hours must be a number between 1 and 168' })
  }

  const rangeDays = Math.min(MAX_RANGE_DAYS[timeframe], Math.ceil(hours / 24) + 2)

  let data
  try {
    const res = await fetch(
      `${CHART_URL}?interval=${YAHOO_INTERVAL[timeframe]}&range=${rangeDays}d`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BazaarSim/1.0)' } }
    )
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    data = await res.json()
  } catch {
    return response(502, { error: 'Could not reach the price feed. Try again shortly.' })
  }

  const result = data?.chart?.result?.[0]
  const timestamps = result?.timestamp
  const quote = result?.indicators?.quote?.[0]

  if (!timestamps?.length || !quote?.high?.length) {
    return response(502, { error: 'No candle data returned for this symbol/timeframe.' })
  }

  const candles = timestamps
    .map((ts, i) => ({ ts, high: quote.high[i], low: quote.low[i], close: quote.close[i] }))
    .filter((c) => c.high !== null && c.low !== null && c.close !== null)

  if (candles.length < 2) {
    return response(422, { error: 'Insufficient historical data for this lookback window.' })
  }

  const forming = candles[candles.length - 1]
  const completed = candles.slice(0, -1)

  const nowSec = Math.floor(Date.now() / 1000)
  const windowStart = nowSec - hours * 3600
  const inWindow = completed.filter((c) => c.ts >= windowStart)

  if (inWindow.length < 2) {
    return response(422, { error: `Not enough completed ${timeframe} candles in the last ${hours}h yet.` })
  }

  const higherHigh = Math.max(...inWindow.map((c) => c.high))
  const lowerLow = Math.min(...inWindow.map((c) => c.low))
  const midPoint = (higherHigh + lowerLow) / 2
  const currentPrice = forming.close
  const distance = currentPrice - midPoint
  const neutralBand = midPoint * 0.0005

  let bias = 'Neutral'
  if (distance > neutralBand) bias = 'Bullish'
  else if (distance < -neutralBand) bias = 'Bearish'

  return response(200, {
    symbol: 'BTCUSDT',
    lookback_hours: hours,
    timeframe,
    higher_high: round2(higherHigh),
    lower_low: round2(lowerLow),
    mid_point: round2(midPoint),
    range: round2(higherHigh - lowerLow),
    current_price: round2(currentPrice),
    distance_from_current_price: round2(distance),
    bias,
    candles_used: inWindow.length,
    data_source: 'Yahoo Finance (BTC-USD) — close proxy for BTCUSDT, not tick-identical'
  })
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  }
}
