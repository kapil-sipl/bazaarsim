// A curated slice of NIFTY 50 constituents. Symbols use the Yahoo Finance
// ".NS" suffix so the same ticker works for the price API.
// Kept intentionally small (v1) for fast loads — expand this list later
// (F&O, mid-caps, indices) without touching any other part of the app.
export const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'ITC.NS', name: 'ITC', sector: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infra' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'NBFC' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Consumer' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'IT' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', sector: 'Pharma' },
  { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Cement' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'IT' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Diversified' },
  { symbol: 'NTPC.NS', name: 'NTPC', sector: 'Power' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', sector: 'Power' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Auto' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Auto' },
  { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corp', sector: 'Energy' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Mining' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', sector: 'NBFC' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals' },
  { symbol: 'DRREDDY.NS', name: "Dr. Reddy's Labs", sector: 'Pharma' },
  { symbol: 'GRASIM.NS', name: 'Grasim Industries', sector: 'Cement' },
  { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Pharma' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infra' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Auto' },
  { symbol: 'BPCL.NS', name: 'Bharat Petroleum', sector: 'Energy' }
]

export const DEFAULT_STARTING_BALANCE = 100000 // ₹1,00,000
