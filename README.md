# Bazaar Sim — Paper Trading for Indian Markets

A free, no-signup paper trading app for NSE stocks. Trade with virtual
cash, track P&L in real time, and practice strategy without risking
real money.

## What's inside

- **React + Vite** frontend — a single-page dashboard (ticker tape,
  watchlist, holdings, trade history).
- **A tiny serverless function** (`/api/quote`) that fetches live-ish
  NSE prices from Yahoo Finance and relays them as JSON. This exists
  purely to dodge a browser CORS restriction — Yahoo's endpoints don't
  allow direct browser calls.
- **No database.** Your portfolio (cash, holdings, trade history)
  lives in your browser's `localStorage`. Clearing browser data or
  switching browsers starts you fresh.

## Running it locally

```bash
npm install
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`. Note: the
`/api/quote` function only runs on Vercel/Netlify's platform, not in
plain `vite dev`. To test prices locally, install the Vercel CLI and
run `vercel dev` instead — it emulates both the frontend and the
serverless function together.

```bash
npm install -g vercel
vercel dev
```

## Deploying for free

### Option A — Vercel (recommended)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and
   click **Add New → Project**.
3. Select the repo. Vercel auto-detects Vite; leave build settings as
   default (`npm run build`, output `dist`).
4. Click **Deploy**. The `/api/quote` function under `/api` is
   deployed automatically — no extra config needed.
5. You'll get a free `your-app.vercel.app` URL with HTTPS. Every push
   to `main` redeploys automatically.

### Option B — Netlify

1. Push this folder to a GitHub repo.
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import
   an existing project**.
3. Select the repo. Netlify reads `netlify.toml` automatically
   (build command, publish folder, and the `/api/*` → functions
   redirect are already configured).
4. Click **Deploy**. You'll get a free `your-app.netlify.app` URL.

Both platforms' free tiers comfortably cover a personal paper trading
app — the serverless function only runs when someone's browser polls
for prices (every 20 seconds while the tab is open).

## Extending it later

The codebase is deliberately split so each of these is a self-contained
change:

- **More instruments** — add rows to `src/data/stocks.js`. Nothing
  else needs to change.
- **F&O / options** — extend `src/lib/trading.js` with margin and
  leverage logic; the UI components already accept arbitrary
  instrument shapes.
- **Charts** — add a charting library (e.g. `lightweight-charts`) and
  a new panel component; historical candles can come from the same
  Yahoo Finance chart endpoint the proxy already calls.
- **Crypto markets** — the price proxy pattern (`/api/quote`) can be
  duplicated for a crypto data source and merged into `usePrices`.
- **Accounts / cloud sync** — swap `src/lib/storage.js` for calls to a
  real backend (e.g. Supabase) once you want portfolios to follow a
  user across devices instead of living in one browser.

## Known limitations (v1)

- Prices are delayed (Yahoo Finance's free feed), not tick-by-tick
  live data — fine for practice, not for latency-sensitive strategies.
- No pre-market/post-market or circuit-limit handling.
- Single portfolio per browser — no multi-user accounts yet.
