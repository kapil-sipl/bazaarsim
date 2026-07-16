// Netlify Functions version of the same proxy in /api/quote.js.
// netlify.toml redirects /api/quote to this function, so the frontend
// code never needs to know which host it's deployed on.

const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/'

export async function handler(event) {
  const symbolsParam = event.queryStringParameters?.symbols
  if (!symbolsParam) {
    return response(400, { error: 'Missing required "symbols" query param' })
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 60)

  const results = await Promise.allSettled(symbols.map(fetchQuote))
  const quotes = {}
  results.forEach((result, i) => {
    const symbol = symbols[i]
    quotes[symbol] = result.status === 'fulfilled' ? result.value : { symbol, error: true }
  })

  return response(200, { quotes, fetchedAt: Date.now() })
}

async function fetchQuote(symbol) {
  const res = await fetch(`${YAHOO_CHART_URL}${encodeURIComponent(symbol)}?interval=1d&range=1d`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BazaarSim/1.0)' }
  })
  if (!res.ok) throw new Error(`Upstream ${res.status}`)
  const data = await res.json()
  const meta = data?.chart?.result?.[0]?.meta
  if (!meta) throw new Error('No meta in response')

  const price = meta.regularMarketPrice
  const prevClose = meta.previousClose ?? meta.chartPreviousClose
  const change = price - prevClose
  const changePercent = prevClose ? (change / prevClose) * 100 : 0

  return { symbol, price, prevClose, change, changePercent, currency: meta.currency, marketState: meta.marketState }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  }
}
