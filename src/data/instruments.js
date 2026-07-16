// All tradable instruments across the three asset classes, plus the
// per-class metadata the rest of the app needs to price and display
// them consistently in a single INR ledger.
//
// Design note on currency handling:
//  - STOCK prices from Yahoo are already in INR — used as-is.
//  - FOREX pairs are deliberately limited to "X-vs-INR" quotes
//    (USDINR=X, EURINR=X, ...) so a pair's price IS its INR value per
//    unit of foreign currency — no double conversion needed.
//  - CRYPTO prices come back in USD (Yahoo has no reliable BTC-INR
//    feed), so the app converts them to INR using the live USDINR=X
//    rate, which is always fetched alongside everything else.
// See src/lib/markets.js for the conversion logic that uses this.

export const USD_INR_SYMBOL = 'USDINR=X'

export const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ITC.NS', name: 'ITC', sector: 'FMCG', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infra', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'NBFC', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Auto', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Consumer', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'IT', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', sector: 'Pharma', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Cement', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'IT', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Diversified', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'NTPC.NS', name: 'NTPC', sector: 'Power', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', sector: 'Power', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Auto', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Auto', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corp', sector: 'Energy', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Mining', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', sector: 'NBFC', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'DRREDDY.NS', name: "Dr. Reddy's Labs", sector: 'Pharma', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'GRASIM.NS', name: 'Grasim Industries', sector: 'Cement', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Pharma', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infra', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Auto', assetClass: 'STOCK', currency: 'INR' },
  { symbol: 'BPCL.NS', name: 'Bharat Petroleum', sector: 'Energy', assetClass: 'STOCK', currency: 'INR' }
]

// Priced in USD by Yahoo — converted to INR at the live USDINR=X rate
// before they touch the portfolio ledger. See src/lib/markets.js.
export const CRYPTO_UNIVERSE = [
  { symbol: 'BTC-USD', name: 'Bitcoin', sector: 'Layer 1', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'ETH-USD', name: 'Ethereum', sector: 'Layer 1', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'BNB-USD', name: 'BNB', sector: 'Exchange token', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'SOL-USD', name: 'Solana', sector: 'Layer 1', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'XRP-USD', name: 'XRP', sector: 'Payments', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'ADA-USD', name: 'Cardano', sector: 'Layer 1', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'DOGE-USD', name: 'Dogecoin', sector: 'Meme', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'DOT-USD', name: 'Polkadot', sector: 'Interoperability', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'MATIC-USD', name: 'Polygon', sector: 'Layer 2', assetClass: 'CRYPTO', currency: 'USD' },
  { symbol: 'LTC-USD', name: 'Litecoin', sector: 'Payments', assetClass: 'CRYPTO', currency: 'USD' }
]

// Deliberately all quoted directly against INR — the price already IS
// the INR value per unit of foreign currency, so no conversion needed.
export const FOREX_UNIVERSE = [
  { symbol: 'USDINR=X', name: 'US Dollar / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'EURINR=X', name: 'Euro / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'GBPINR=X', name: 'British Pound / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'JPYINR=X', name: 'Japanese Yen / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'AUDINR=X', name: 'Australian Dollar / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'CADINR=X', name: 'Canadian Dollar / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'CHFINR=X', name: 'Swiss Franc / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' },
  { symbol: 'SGDINR=X', name: 'Singapore Dollar / Indian Rupee', sector: 'Major', assetClass: 'FOREX', currency: 'INR' }
]

export const ALL_INSTRUMENTS = [...STOCK_UNIVERSE, ...CRYPTO_UNIVERSE, ...FOREX_UNIVERSE]
export const INSTRUMENT_LOOKUP = Object.fromEntries(ALL_INSTRUMENTS.map((i) => [i.symbol, i]))

export const ASSET_CLASSES = [
  { key: 'STOCK', label: 'Stocks', list: STOCK_UNIVERSE },
  { key: 'CRYPTO', label: 'Crypto', list: CRYPTO_UNIVERSE },
  { key: 'FOREX', label: 'Forex', list: FOREX_UNIVERSE }
]

export const DEFAULT_STARTING_BALANCE = 100000 // ₹1,00,000
