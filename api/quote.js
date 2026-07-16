// Serverless function — deployed automatically by Vercel from /api.
// Netlify users: see /netlify/functions/quote.js (thin wrapper, same logic).
//
// Why this exists: Yahoo Finance's endpoints don't send CORS headers, so the
// browser can't call them directly. This function runs server-side (free on
// Vercel/Netlify's function tier) and simply relays the data as clean JSON.

export const config = { runtime: 'edge' }

const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/'

export default async function handler(request) {
  const { searchParams } = new URL(request.url)
  const symbolsParam = searchParams.get('symbols')

  if (!symbolsParam) {
    return json({ error: 'Missing required "symbols" query param' }, 400)
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 60)

  const results = await Promise.allSettled(
    symbols.map((symbol) => fetchQuote(symbol))
  )

  const quotes = {}
  results.forEach((result, i) => {
    const symbol = symbols[i]
    if (result.status === 'fulfilled' && result.value) {
      quotes[symbol] = result.value
    } else {
      quotes[symbol] = { symbol, error: true }
    }
  })

  return json({ quotes, fetchedAt: Date.now() })
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

  return {
    symbol,
    price,
    prevClose,
    change,
    changePercent,
    currency: meta.currency,
    marketState: meta.marketState
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store'
    }
  })
}
