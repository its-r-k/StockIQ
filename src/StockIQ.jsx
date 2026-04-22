
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, TrendingDown, BarChart2, Briefcase, Bell, Activity, AlertTriangle, CheckCircle, Plus, Trash2, Home, Zap, Target, Shield, RefreshCw, Star, ChevronRight, Newspaper, ArrowUpRight, ArrowDownRight } from "lucide-react";

const C = {
  bg: "#06060f", card: "#0c0c1e", cardBright: "#10102a",
  border: "#1e1e40", borderBright: "#2d2d5a",
  primary: "#5b8aff", accent: "#00ffcc",
  positive: "#00e87a", negative: "#ff4466",
  warning: "#ffaa00", gold: "#ffd700",
  text: "#dde4ff", muted: "#6070a8", dim: "#1e2248",
};

const MARKET = [
  { n: "SENSEX", v: "73,847", c: "+0.82%", up: true }, { n: "NIFTY 50", v: "22,419", c: "+0.76%", up: true },
  { n: "BANK NIFTY", v: "47,234", c: "-0.23%", up: false }, { n: "NIFTY IT", v: "35,621", c: "+1.42%", up: true },
  { n: "GOLD", v: "₹72,450", c: "+0.41%", up: true }, { n: "USD/INR", v: "83.42", c: "-0.12%", up: false },
  { n: "BTC", v: "$67,832", c: "+2.15%", up: true }, { n: "VIX", v: "14.23", c: "-5.2%", up: false },
  { n: "CRUDE OIL", v: "$87.34", c: "+1.23%", up: true }, { n: "MIDCAP 150", v: "48,320", c: "+1.14%", up: true },
];

const TRENDING_STOCKS = [
  { sym: "RELIANCE", name: "Reliance Industries", chg: "+2.3%", up: true, sec: "Energy", price: "2,954" },
  { sym: "TCS", name: "Tata Consultancy Services", chg: "+1.8%", up: true, sec: "IT", price: "3,782" },
  { sym: "HDFC BANK", name: "HDFC Bank Ltd", chg: "-0.9%", up: false, sec: "Banking", price: "1,642" },
  { sym: "INFY", name: "Infosys Ltd", chg: "+1.2%", up: true, sec: "IT", price: "1,487" },
  { sym: "ADANIENT", name: "Adani Enterprises", chg: "+3.1%", up: true, sec: "Infra", price: "3,201" },
  { sym: "TATAMOTORS", name: "Tata Motors Ltd", chg: "+2.7%", up: true, sec: "Auto", price: "974" },
];

const TOP_MFS = [
  { name: "Mirae Asset Large Cap", ret: "+18.4%", cat: "Large Cap", stars: 5, aum: "₹32,410 Cr" },
  { name: "SBI Small Cap Fund", ret: "+32.7%", cat: "Small Cap", stars: 5, aum: "₹21,380 Cr" },
  { name: "HDFC Mid-Cap Opp", ret: "+28.1%", cat: "Mid Cap", stars: 4, aum: "₹58,920 Cr" },
  { name: "Axis Bluechip Fund", ret: "+15.2%", cat: "Large Cap", stars: 4, aum: "₹45,200 Cr" },
];

const EXCHANGES = ["NSE", "BSE", "NYSE", "NASDAQ", "MCX"];
const HORIZONS = ["1 month", "3 months", "6 months", "1 year", "3 years", "5 years"];

async function callClaude(prompt, maxTokens = 1000) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await resp.json();
  const raw = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  return raw.replace(/```json\n?|\n?```/g, "").trim();
}

async function analyzeAsset(symbol, type, amount, horizon, exchange) {
  const raw = await callClaude(`You are an expert financial analyst for Indian & global markets. Analyze ${symbol} (${type}) on ${exchange} for ₹${amount} investment with ${horizon} horizon as of April 2026.

Return ONLY valid JSON, no markdown:
{
  "overview": "2-3 sentence description",
  "currentPrice": 2954,
  "priceUnit": "₹",
  "marketCap": "₹20.1 Lakh Cr",
  "technical": {
    "trend": "Bullish",
    "rsi": 62,
    "macd": "Bullish Crossover",
    "ma50": 2820,
    "ma200": 2650,
    "support": 2800,
    "resistance": 3100,
    "volume": "Above Average",
    "rating": "Buy",
    "score": 72,
    "signals": ["Signal 1", "Signal 2", "Signal 3"]
  },
  "fundamental": {
    "pe": "28.4",
    "pb": "2.9",
    "de": "0.38",
    "roe": "17.2%",
    "eps": "₹104",
    "dividendYield": "0.4%",
    "revenueGrowth": "+11.3% YoY",
    "netProfitGrowth": "+14.2% YoY",
    "rating": "Good",
    "score": 68
  },
  "sentiment": {
    "overall": "Positive",
    "score": 74,
    "summary": "Sentiment summary",
    "institutional": "Net Buyers",
    "fii": "FII activity",
    "dii": "DII activity",
    "analystRating": "Buy",
    "analystTarget": 3250
  },
  "risk": {
    "level": "Medium",
    "score": 5,
    "beta": "1.12",
    "volatility": "Medium",
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "positives": ["Strength 1", "Strength 2", "Strength 3"]
  },
  "targets": {
    "1m": {"price": 3020, "upside": "+2.2%", "prob": "68%"},
    "3m": {"price": 3150, "upside": "+6.6%", "prob": "63%"},
    "6m": {"price": 3300, "upside": "+11.7%", "prob": "57%"},
    "1y": {"price": 3600, "upside": "+21.9%", "prob": "51%"},
    "cagr": "22%",
    "bearCase": 2600,
    "bullCase": 3900
  },
  "investment": {
    "invested": ${amount},
    "return1y": ${Math.round(parseInt(amount) * 1.22)},
    "return3y": ${Math.round(parseInt(amount) * 1.81)},
    "return5y": ${Math.round(parseInt(amount) * 2.7)},
    "recommendation": "Buy",
    "target": 3600,
    "stopLoss": 2700,
    "sip": "SIP suggestion"
  },
  "catalysts": ["Catalyst 1", "Catalyst 2", "Catalyst 3", "Catalyst 4"],
  "concerns": ["Concern 1", "Concern 2"],
  "recentNews": ["News 1", "News 2", "News 3"],
  "sectorOutlook": "Sector outlook summary",
  "summary": "4-5 sentence investment summary and recommendation."
}

Use REALISTIC current data for ${symbol}. All prices must be realistic numbers.`);
  return JSON.parse(raw);
}

async function getNews() {
  const raw = await callClaude(`Generate 5 impactful Indian market news items for April 2026. Return ONLY JSON array:
[{"headline":"headline","summary":"2 sentence summary","impact":"Positive","affectedSectors":["IT"],"time":"2h ago"}]`);
  return JSON.parse(raw);
}

const ss = {
  app: { fontFamily: "'DM Sans',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 76 },
  ticker: { background: "#080815", borderBottom: `1px solid ${C.border}`, padding: "7px 0", overflow: "hidden", whiteSpace: "nowrap" },
  tickerInner: { display: "inline-flex", gap: 28, animation: "ticker 50s linear infinite" },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 },
  input: { background: "#0a0a22", border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", color: C.text, fontSize: 14, width: "100%", outline: "none" },
  btnPrimary: { background: `linear-gradient(135deg, ${C.primary}, #3d65e8)`, border: "none", borderRadius: 12, color: "#fff", padding: "13px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", transition: "opacity 0.2s" },
  btnOutline: (col) => ({ background: `${col}14`, border: `1px solid ${col}40`, borderRadius: 11, color: col, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", transition: "all 0.2s" }),
  pill: (col) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: `${col}15`, border: `1px solid ${col}30`, borderRadius: 20, padding: "3px 9px", fontSize: 11, color: col, fontWeight: 600 }),
  tab: (on) => ({ padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: on ? `1px solid ${C.primary}50` : `1px solid transparent`, background: on ? `${C.primary}20` : "transparent", color: on ? C.primary : C.muted, transition: "all 0.2s" }),
  secTitle: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 10 },
  navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(6,6,15,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 100 },
  navBtn: (on) => ({ flex: 1, padding: "9px 0 11px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "none", background: "none", cursor: "pointer", color: on ? C.accent : C.muted, transition: "color 0.2s", position: "relative" }),
};

function Gauge({ val, max = 100, col = C.primary, label, size = 84 }) {
  const pct = Math.min(val / max, 1);
  const r = size / 2 - 9;
  const cx = size / 2, cy = size / 2;
  const toXY = (deg) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) });
  const start = toXY(-180);
  const end = toXY(-180 + pct * 180);
  const large = pct > 0.5 ? 1 : 0;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size / 2 + 14}>
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.dim} strokeWidth={7} />
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" />
        <text x={cx} y={cy + 6} textAnchor="middle" fill={col} fontSize={13} fontWeight="bold" fontFamily="'Space Mono',monospace">{val}</text>
      </svg>
      <div style={{ fontSize: 10, color: C.muted, marginTop: -6 }}>{label}</div>
    </div>
  );
}

function Stars({ n }) {
  return <span>{[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < n ? C.gold : "none"} color={i < n ? C.gold : C.dim} />)}</span>;
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [aTab, setATab] = useState("technical");
  const [symbol, setSymbol] = useState("");
  const [assetType, setAssetType] = useState("stock");
  const [exchange, setExchange] = useState("NSE");
  const [amount, setAmount] = useState("50000");
  const [horizon, setHorizon] = useState("1 year");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [news, setNews] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState([
    { sym: "RELIANCE", qty: 10, buy: 2750, cur: 2954, type: "Stock" },
    { sym: "TCS", qty: 5, buy: 3500, cur: 3782, type: "Stock" },
    { sym: "SBI Small Cap", qty: 1000, buy: 98.5, cur: 118.2, type: "MF" },
  ]);
  const [alerts, setAlerts] = useState([
    { sym: "HDFC BANK", type: "Above", price: 1700 },
    { sym: "INFY", type: "Below", price: 1400 },
  ]);
  const [newAlertSym, setNewAlertSym] = useState("");
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertType, setNewAlertType] = useState("Above");
  const [addOpen, setAddOpen] = useState(false);
  const [newPos, setNewPos] = useState({ sym: "", qty: "", buy: "", type: "Stock" });

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
    const st = document.createElement("style");
    st.textContent = `
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      *{box-sizing:border-box}
      ::-webkit-scrollbar{width:0;height:0}
      input,select{font-family:'DM Sans',sans-serif}
      input::placeholder{color:#2a3060}
      select option{background:#0c0c1e}
    `;
    document.head.appendChild(st);
  }, []);

  const handleAnalyze = async () => {
    if (!symbol.trim()) { setError("Enter a stock or MF symbol"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const d = await analyzeAsset(symbol.trim().toUpperCase(), assetType, amount, horizon, exchange);
      setResult(d); setATab("technical");
    } catch (e) { setError("Analysis failed. Try again."); }
    setLoading(false);
  };

  const pVal = portfolio.reduce((s, p) => s + p.qty * p.cur, 0);
  const pCost = portfolio.reduce((s, p) => s + p.qty * p.buy, 0);
  const pPnL = pVal - pCost;
  const pPct = ((pPnL / pCost) * 100).toFixed(2);

  const projData = result ? [
    { t: "Now", p: result.currentPrice },
    { t: "1M", p: result.targets["1m"].price },
    { t: "3M", p: result.targets["3m"].price },
    { t: "6M", p: result.targets["6m"].price },
    { t: "1Y", p: result.targets["1y"].price },
  ] : [];

  const fmt = (n) => n?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) ?? "—";

  return (
    <div style={ss.app}>
      {/* TICKER */}
      <div style={ss.ticker}>
        <div style={ss.tickerInner}>
          {[...MARKET, ...MARKET].map((m, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "'Space Mono',monospace" }}>
              <span style={{ color: C.muted }}>{m.n}</span>
              <span style={{ color: C.text, fontWeight: 700 }}>{m.v}</span>
              <span style={{ color: m.up ? C.positive : C.negative }}>{m.c}</span>
              <span style={{ color: C.dim }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div style={{ padding: "13px 16px 9px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 21, fontWeight: 800 }}>
          <span style={{ color: C.accent }}>◈</span>
          <span style={{ background: `linear-gradient(90deg,${C.text},${C.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> StockIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.positive, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "'Space Mono'" }}>LIVE</span>
        </div>
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div style={{ padding: 16 }}>
          <div style={{ ...ss.secTitle, marginTop: 4 }}>Market Overview</div>
          <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
            {[{l:"SENSEX",v:"73,847",c:"+0.82%",up:true},{l:"NIFTY 50",v:"22,419",c:"+0.76%",up:true},{l:"BANK NIFTY",v:"47,234",c:"-0.23%",up:false},{l:"NIFTY IT",v:"35,621",c:"+1.42%",up:true}].map((m,i)=>(
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 13px", minWidth: 110, textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{m.l}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: C.text }}>{m.v}</div>
                <div style={{ fontSize: 11, color: m.up ? C.positive : C.negative, marginTop: 2 }}>{m.up ? "▲" : "▼"} {m.c}</div>
              </div>
            ))}
          </div>

          <div style={ss.secTitle}>🔥 Trending Stocks</div>
          <div style={{ ...ss.card, padding: 0, overflow: "hidden" }}>
            {TRENDING_STOCKS.map((st, i) => (
              <div key={i} onClick={() => { setSymbol(st.sym); setTab("analyze"); }} style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderBottom: i < 5 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${C.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 11, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.primary }}>{st.sym.slice(0,2)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{st.sym}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{st.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.text }}>₹{st.price}</div>
                  <div style={{ fontSize: 11, color: st.up ? C.positive : C.negative }}>{st.up ? "▲" : "▼"} {st.chg}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={ss.secTitle}>📈 Top Mutual Funds</div>
          <div style={{ ...ss.card, padding: 0, overflow: "hidden" }}>
            {TOP_MFS.map((mf, i) => (
              <div key={i} style={{ padding: "11px 14px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{mf.name}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Stars n={mf.stars} /><span style={{ fontSize: 10, color: C.muted }}>{mf.cat}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: C.positive }}>{mf.ret}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...ss.card, background: `linear-gradient(135deg,${C.primary}12,${C.accent}06)`, border: `1px solid ${C.primary}30`, cursor: "pointer" }} onClick={() => setTab("analyze")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${C.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={20} color={C.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700 }}>AI Deep Analysis</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Technicals · Fundamentals · AI Predictions</div>
              </div>
              <ChevronRight size={16} color={C.primary} />
            </div>
          </div>
        </div>
      )}

      {/* ANALYZE */}
      {tab === "analyze" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI Analysis</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Technical · Fundamental · Predictions · Sentiment</div>

          <div style={ss.card}>
            <div style={{ display: "flex", gap: 7, marginBottom: 13, flexWrap: "wrap" }}>
              {["stock","mutual fund","ETF","index"].map(t => (
                <button key={t} onClick={() => setAssetType(t)} style={ss.tab(assetType === t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>SYMBOL / FUND NAME</label>
              <div style={{ position: "relative" }}>
                <Search size={13} color={C.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input value={symbol} onChange={e => setSymbol(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAnalyze()} placeholder="e.g. RELIANCE, TCS, SBI Small Cap..." style={{ ...ss.input, paddingLeft: 32 }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>EXCHANGE</label>
                <select value={exchange} onChange={e => setExchange(e.target.value)} style={{ ...ss.input, appearance: "none" }}>
                  {EXCHANGES.map(ex => <option key={ex}>{ex}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>INVESTMENT (₹)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="50000" style={ss.input} />
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>HORIZON</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {HORIZONS.map(h => <button key={h} onClick={() => setHorizon(h)} style={ss.tab(horizon === h)}>{h}</button>)}
              </div>
            </div>
            {error && <div style={{ background: `${C.negative}12`, border: `1px solid ${C.negative}35`, borderRadius: 9, padding: "9px 12px", fontSize: 12, color: C.negative, marginBottom: 11 }}>{error}</div>}
            <button onClick={handleAnalyze} disabled={loading} style={{ ...ss.btnPrimary, opacity: loading ? 0.75 : 1 }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: 16 }}>⊕</span> Analyzing...</> : <><Zap size={15} /> Analyze Now</>}
            </button>
          </div>

          {result && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              {/* Header Card */}
              <div style={{ ...ss.card, background: `linear-gradient(135deg,${C.primary}12,${C.accent}06)`, border: `1px solid ${C.primary}28` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800 }}>{symbol.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{exchange} • {assetType}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: C.accent }}>{result.priceUnit}{result.currentPrice?.toLocaleString()}</div>
                    {result.marketCap && <div style={{ fontSize: 10, color: C.muted }}>MCap: {result.marketCap}</div>}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 11 }}>{result.overview}</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <span style={ss.pill(result.investment?.recommendation === "Buy" || result.investment?.recommendation === "Strong Buy" ? C.positive : C.warning)}>{result.investment?.recommendation}</span>
                  <span style={ss.pill(C.primary)}>Risk: {result.risk?.level}</span>
                  <span style={ss.pill(C.accent)}>CAGR {result.targets?.cagr}</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 11, overflowX: "auto", paddingBottom: 2 }}>
                {[["technical","Technical",Activity],["fundamental","Fundamental",BarChart2],["prediction","AI Predict",Target],["sentiment","Sentiment",Newspaper],["risk","Risk",Shield]].map(([k,l,Icon])=>(
                  <button key={k} onClick={() => setATab(k)} style={{ ...ss.tab(aTab===k), display:"flex", alignItems:"center", gap:4, flexShrink:0, fontSize:11 }}>
                    <Icon size={10}/>{l}
                  </button>
                ))}
              </div>

              {/* TECHNICAL */}
              {aTab === "technical" && (
                <div style={{ animation: "fadeUp 0.25s ease" }}>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Key Indicators</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <Gauge val={result.technical?.rsi ?? 50} label="RSI" col={result.technical?.rsi > 70 ? C.negative : result.technical?.rsi < 30 ? C.positive : C.primary} />
                      <Gauge val={result.technical?.score ?? 60} label="Tech Score" col={C.accent} />
                      <Gauge val={result.fundamental?.score ?? 60} label="Fund Score" col={C.warning} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                      {[
                        {l:"Trend",v:result.technical?.trend,c:result.technical?.trend==="Bullish"?C.positive:result.technical?.trend==="Bearish"?C.negative:C.warning},
                        {l:"MACD",v:result.technical?.macd,c:result.technical?.macd?.includes("Bullish")?C.positive:C.negative},
                        {l:"50 DMA",v:`₹${result.technical?.ma50}`,c:C.text},
                        {l:"200 DMA",v:`₹${result.technical?.ma200}`,c:C.text},
                        {l:"Support",v:`₹${result.technical?.support}`,c:C.positive},
                        {l:"Resistance",v:`₹${result.technical?.resistance}`,c:C.negative},
                        {l:"Volume",v:result.technical?.volume,c:C.warning},
                        {l:"Signal",v:result.technical?.rating,c:C.accent},
                      ].map((it,i)=>(
                        <div key={i} style={{ background: C.bg, borderRadius: 9, padding: "9px 11px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{it.l}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: it.c, fontFamily: "'Space Mono',monospace" }}>{it.v}</div>
                        </div>
                      ))}
                    </div>
                    {result.technical?.signals && (
                      <div style={{ marginTop: 11 }}>
                        {result.technical.signals.map((sig,i)=>(
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                            <CheckCircle size={11} color={C.positive}/><span style={{ fontSize:11, color:C.muted }}>{sig}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FUNDAMENTAL */}
              {aTab === "fundamental" && (
                <div style={{ animation: "fadeUp 0.25s ease" }}>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Fundamental Metrics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 13 }}>
                      {[{l:"P/E Ratio",v:result.fundamental?.pe},{l:"P/B Ratio",v:result.fundamental?.pb},{l:"Debt/Equity",v:result.fundamental?.de},{l:"ROE",v:result.fundamental?.roe},{l:"EPS",v:result.fundamental?.eps},{l:"Dividend Yield",v:result.fundamental?.dividendYield},{l:"Revenue Growth",v:result.fundamental?.revenueGrowth},{l:"Profit Growth",v:result.fundamental?.netProfitGrowth}].map((it,i)=>(
                        <div key={i} style={{ background: C.bg, borderRadius: 9, padding: "9px 11px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{it.l}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: "'Space Mono',monospace" }}>{it.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", background:C.bg, borderRadius:9, padding:"10px 12px", border:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:12, color:C.muted }}>Fundamental Rating</span>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:result.fundamental?.rating==="Excellent"?C.positive:result.fundamental?.rating==="Good"?C.accent:C.warning }}>{result.fundamental?.rating}</span>
                    </div>
                  </div>
                  {result.catalysts && (
                    <div style={ss.card}>
                      <div style={ss.secTitle}>Catalysts & Concerns</div>
                      {result.catalysts.map((c,i)=>(
                        <div key={i} style={{ display:"flex", gap:9, marginBottom:7, padding:"8px 10px", background:`${C.positive}08`, borderRadius:8, border:`1px solid ${C.positive}18` }}>
                          <TrendingUp size={13} color={C.positive} style={{ flexShrink:0, marginTop:1 }}/>
                          <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{c}</span>
                        </div>
                      ))}
                      {result.concerns?.map((c,i)=>(
                        <div key={i} style={{ display:"flex", gap:9, marginBottom:7, padding:"8px 10px", background:`${C.warning}08`, borderRadius:8, border:`1px solid ${C.warning}18` }}>
                          <AlertTriangle size={13} color={C.warning} style={{ flexShrink:0, marginTop:1 }}/>
                          <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PREDICTION */}
              {aTab === "prediction" && (
                <div style={{ animation: "fadeUp 0.25s ease" }}>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Price Projection</div>
                    <ResponsiveContainer width="100%" height={155}>
                      <AreaChart data={projData}>
                        <defs>
                          <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.accent} stopOpacity={0.28}/>
                            <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={C.dim} strokeDasharray="3 3"/>
                        <XAxis dataKey="t" stroke={C.muted} tick={{ fontSize:10 }}/>
                        <YAxis stroke={C.muted} tick={{ fontSize:10 }} domain={["auto","auto"]}/>
                        <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                        <Area type="monotone" dataKey="p" stroke={C.accent} strokeWidth={2} fill="url(#gr)" dot={{ fill:C.accent, r:4 }}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Price Targets</div>
                    {[["1 Month","1m"],["3 Months","3m"],["6 Months","6m"],["1 Year","1y"]].map(([label,key])=>(
                      <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 11px", background:C.bg, borderRadius:9, marginBottom:7, border:`1px solid ${C.border}` }}>
                        <span style={{ fontSize:12, color:C.muted }}>{label}</span>
                        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, fontWeight:700, color:C.text }}>₹{result.targets[key].price}</span>
                          <span style={{ fontSize:11, color:C.positive }}>{result.targets[key].upside}</span>
                          <span style={{ fontSize:10, color:C.dim }}>P:{result.targets[key].prob}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginTop:4 }}>
                      <div style={{ background:`${C.positive}10`, border:`1px solid ${C.positive}22`, borderRadius:9, padding:11, textAlign:"center" }}>
                        <div style={{ fontSize:10, color:C.muted }}>Bull Case</div>
                        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:15, color:C.positive, fontWeight:700 }}>₹{result.targets.bullCase}</div>
                      </div>
                      <div style={{ background:`${C.negative}10`, border:`1px solid ${C.negative}22`, borderRadius:9, padding:11, textAlign:"center" }}>
                        <div style={{ fontSize:10, color:C.muted }}>Bear Case</div>
                        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:15, color:C.negative, fontWeight:700 }}>₹{result.targets.bearCase}</div>
                      </div>
                    </div>
                  </div>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Investment Returns on ₹{parseInt(amount).toLocaleString()}</div>
                    {[{l:"Expected in 1Y",v:`₹${fmt(result.investment?.return1y)}`,c:C.positive},{l:"Expected in 3Y",v:`₹${fmt(result.investment?.return3y)}`,c:C.accent},{l:"Expected in 5Y",v:`₹${fmt(result.investment?.return5y)}`,c:C.gold},{l:"Target Price",v:`₹${result.investment?.target}`,c:C.positive},{l:"Stop Loss",v:`₹${result.investment?.stopLoss}`,c:C.negative}].map((it,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
                        <span style={{ fontSize:12, color:C.muted }}>{it.l}</span>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, fontWeight:700, color:it.c }}>{it.v}</span>
                      </div>
                    ))}
                    {result.investment?.sip && (
                      <div style={{ marginTop:11, background:`${C.primary}10`, border:`1px solid ${C.primary}22`, borderRadius:9, padding:11 }}>
                        <div style={{ fontSize:11, color:C.primary, fontWeight:600 }}>💡 SIP Suggestion</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{result.investment.sip}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SENTIMENT */}
              {aTab === "sentiment" && (
                <div style={{ animation: "fadeUp 0.25s ease" }}>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Market Sentiment</div>
                    <div style={{ textAlign:"center", marginBottom:14 }}>
                      <Gauge val={result.sentiment?.score ?? 60} label="Sentiment Score" col={result.sentiment?.score > 60 ? C.positive : C.warning} size={100}/>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:11 }}>
                      {[{l:"Overall",v:result.sentiment?.overall},{l:"Institutional",v:result.sentiment?.institutional},{l:"Analyst Rating",v:result.sentiment?.analystRating},{l:"Analyst Target",v:`₹${result.sentiment?.analystTarget}`}].map((it,i)=>(
                        <div key={i} style={{ background:C.bg, borderRadius:9, padding:"9px 11px", border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{it.l}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>{it.v}</div>
                        </div>
                      ))}
                    </div>
                    {[{l:"FII Activity",v:result.sentiment?.fii},{l:"DII Activity",v:result.sentiment?.dii},{l:"Sentiment Summary",v:result.sentiment?.summary}].map((it,i)=>(
                      <div key={i} style={{ background:C.bg, borderRadius:9, padding:11, border:`1px solid ${C.border}`, marginBottom:7 }}>
                        <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{it.l}</div>
                        <div style={{ fontSize:12, color:C.text }}>{it.v}</div>
                      </div>
                    ))}
                  </div>
                  {result.recentNews && (
                    <div style={ss.card}>
                      <div style={ss.secTitle}>Recent News</div>
                      {result.recentNews.map((n,i)=>(
                        <div key={i} style={{ display:"flex", gap:9, marginBottom:7, padding:"8px 10px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                          <Newspaper size={13} color={C.primary} style={{ flexShrink:0, marginTop:2 }}/>
                          <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.sectorOutlook && (
                    <div style={{ ...ss.card, background:`${C.accent}08`, border:`1px solid ${C.accent}22` }}>
                      <div style={{ fontSize:11, color:C.accent, fontWeight:700, marginBottom:4 }}>SECTOR OUTLOOK</div>
                      <div style={{ fontSize:13, color:C.text }}>{result.sectorOutlook}</div>
                    </div>
                  )}
                </div>
              )}

              {/* RISK */}
              {aTab === "risk" && (
                <div style={{ animation: "fadeUp 0.25s ease" }}>
                  <div style={ss.card}>
                    <div style={ss.secTitle}>Risk Assessment</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:13 }}>
                      {[{l:"Risk Level",v:result.risk?.level,c:result.risk?.level==="Low"?C.positive:result.risk?.level==="Medium"?C.warning:C.negative},{l:"Risk Score",v:`${result.risk?.score}/10`,c:C.warning},{l:"Beta",v:result.risk?.beta,c:C.text},{l:"Volatility",v:result.risk?.volatility,c:C.warning}].map((it,i)=>(
                        <div key={i} style={{ background:C.bg, borderRadius:9, padding:"9px 11px", border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{it.l}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:it.c, fontFamily:"'Space Mono',monospace" }}>{it.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:11 }}>
                      <div style={{ fontSize:12, color:C.negative, fontWeight:700, marginBottom:7 }}>⚠ Key Risks</div>
                      {result.risk?.risks?.map((r,i)=>(
                        <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                          <AlertTriangle size={12} color={C.negative} style={{ flexShrink:0, marginTop:2 }}/>
                          <span style={{ fontSize:12, color:C.muted }}>{r}</span>
                        </div>
                      ))}
                    </div>
                    {result.risk?.positives && (
                      <div>
                        <div style={{ fontSize:12, color:C.positive, fontWeight:700, marginBottom:7 }}>✓ Strengths</div>
                        {result.risk.positives.map((p,i)=>(
                          <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                            <CheckCircle size={12} color={C.positive} style={{ flexShrink:0, marginTop:2 }}/>
                            <span style={{ fontSize:12, color:C.muted }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ ...ss.card, background:`${C.primary}08`, border:`1px solid ${C.primary}22` }}>
                    <div style={{ fontSize:11, color:C.primary, fontWeight:700, marginBottom:7 }}>INVESTMENT SUMMARY</div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.75 }}>{result.summary}</div>
                    <div style={{ marginTop:11, padding:"8px 10px", background:`${C.warning}0e`, borderRadius:7, fontSize:11, color:C.muted, borderLeft:`3px solid ${C.warning}` }}>
                      ⚠ AI-generated analysis for informational purposes only. Not financial advice. Consult a SEBI-registered advisor.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:C.muted }}>
              <Activity size={42} color={C.dim} style={{ margin:"0 auto 12px", display:"block" }}/>
              <div style={{ fontSize:14, fontWeight:600, color:C.muted }}>Search any Indian or global stock</div>
              <div style={{ fontSize:12, marginTop:5 }}>RELIANCE · TCS · NIFTY 50 · SBI Small Cap</div>
            </div>
          )}
        </div>
      )}

      {/* PORTFOLIO */}
      {tab === "portfolio" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:12 }}>Portfolio</div>
          <div style={{ ...ss.card, background:`linear-gradient(135deg,${pPnL>=0?C.positive:C.negative}12,${C.primary}08)`, border:`1px solid ${pPnL>=0?C.positive:C.negative}28` }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:5 }}>Total Portfolio Value</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:28, fontWeight:700 }}>₹{fmt(pVal)}</div>
            <div style={{ display:"flex", gap:20, marginTop:9 }}>
              {[{l:"Invested",v:`₹${fmt(pCost)}`,c:C.text},{l:"P&L",v:`${pPnL>=0?"+":""}₹${fmt(pPnL)}`,c:pPnL>=0?C.positive:C.negative},{l:"Returns",v:`${pPnL>=0?"+":""}${pPct}%`,c:pPnL>=0?C.positive:C.negative}].map((it,i)=>(
                <div key={i}><div style={{ fontSize:10, color:C.muted }}>{it.l}</div><div style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:it.c, fontWeight:700 }}>{it.v}</div></div>
              ))}
            </div>
          </div>

          <div style={ss.secTitle}>Holdings</div>
          <div style={{ ...ss.card, padding:0, overflow:"hidden" }}>
            {portfolio.map((pos,i) => {
              const val = pos.qty*pos.cur, cost = pos.qty*pos.buy, pnl = val-cost;
              const pct = ((pnl/cost)*100).toFixed(2);
              return (
                <div key={i} style={{ padding:"11px 14px", borderBottom:i<portfolio.length-1?`1px solid ${C.border}`:"none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{pos.sym}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{pos.qty} {pos.type==="MF"?"units":"shares"} • {pos.type}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:C.text }}>₹{fmt(val)}</div>
                      <div style={{ fontSize:11, color:pnl>=0?C.positive:C.negative }}>{pnl>=0?"+":""}₹{fmt(pnl)} ({pct}%)</div>
                    </div>
                  </div>
                  <div style={{ background:C.dim, borderRadius:3, height:3, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(Math.abs(parseFloat(pct))*2.5,100)}%`, background:pnl>=0?C.positive:C.negative, height:"100%", borderRadius:3 }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                    <button onClick={()=>{setSymbol(pos.sym);setTab("analyze");}} style={{ fontSize:11, color:C.primary, background:"none", border:"none", cursor:"pointer" }}>Analyze →</button>
                    <button onClick={()=>setPortfolio(p=>p.filter((_,j)=>j!==i))} style={{ fontSize:11, color:C.negative, background:"none", border:"none", cursor:"pointer" }}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={()=>setAddOpen(!addOpen)} style={ss.btnOutline(C.accent)}><Plus size={15}/> Add Position</button>
          {addOpen && (
            <div style={{ ...ss.card, marginTop:11, animation:"fadeUp 0.2s ease" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                <input placeholder="Symbol" value={newPos.sym} onChange={e=>setNewPos(p=>({...p,sym:e.target.value}))} style={ss.input}/>
                <select value={newPos.type} onChange={e=>setNewPos(p=>({...p,type:e.target.value}))} style={{ ...ss.input, appearance:"none" }}>
                  <option>Stock</option><option>MF</option><option>ETF</option>
                </select>
                <input placeholder="Qty/Units" type="number" value={newPos.qty} onChange={e=>setNewPos(p=>({...p,qty:e.target.value}))} style={ss.input}/>
                <input placeholder="Buy Price ₹" type="number" value={newPos.buy} onChange={e=>setNewPos(p=>({...p,buy:e.target.value}))} style={ss.input}/>
              </div>
              <button onClick={()=>{ if(newPos.sym&&newPos.qty&&newPos.buy){setPortfolio(p=>[...p,{sym:newPos.sym.toUpperCase(),qty:parseFloat(newPos.qty),buy:parseFloat(newPos.buy),cur:parseFloat(newPos.buy)*1.05,type:newPos.type}]);setNewPos({sym:"",qty:"",buy:"",type:"Stock"});setAddOpen(false);}}} style={{ ...ss.btnPrimary, background:`linear-gradient(135deg,${C.positive},#00b860)` }}>Add to Portfolio</button>
            </div>
          )}
        </div>
      )}

      {/* NEWS */}
      {tab === "news" && (
        <div style={{ padding: 16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>Market News</div>
              <div style={{ fontSize:12, color:C.muted }}>AI-analyzed & curated</div>
            </div>
            <button onClick={()=>{setNewsLoading(true);getNews().then(d=>{setNews(d);setNewsLoading(false);}).catch(()=>setNewsLoading(false));}} style={{ background:`${C.primary}18`, border:`1px solid ${C.primary}38`, borderRadius:10, padding:"8px 12px", color:C.primary, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
              <RefreshCw size={12} style={{ animation:newsLoading?"spin 1s linear infinite":"none" }}/> Refresh
            </button>
          </div>
          {!news && !newsLoading && (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <Newspaper size={42} color={C.dim} style={{ margin:"0 auto 12px", display:"block" }}/>
              <div style={{ fontSize:14, color:C.muted, marginBottom:16 }}>Load AI-analyzed market news</div>
              <button onClick={()=>{setNewsLoading(true);getNews().then(d=>{setNews(d);setNewsLoading(false);}).catch(()=>setNewsLoading(false));}} style={{ ...ss.btnPrimary, width:"auto", padding:"11px 24px" }}><Zap size={14}/> Load News</button>
            </div>
          )}
          {newsLoading && <div style={{ textAlign:"center", padding:"40px 20px", fontSize:14, color:C.muted, animation:"pulse 1s infinite" }}>Analyzing market news with AI...</div>}
          {news && news.map((item,i)=>(
            <div key={i} style={{ ...ss.card, borderLeft:`3px solid ${item.impact==="Positive"?C.positive:item.impact==="Negative"?C.negative:C.warning}`, animation:`fadeUp ${0.1+i*0.08}s ease` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={ss.pill(item.impact==="Positive"?C.positive:item.impact==="Negative"?C.negative:C.warning)}>{item.impact}</span>
                <span style={{ fontSize:11, color:C.dim }}>{item.time}</span>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text, marginBottom:5, lineHeight:1.4 }}>{item.headline}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{item.summary}</div>
              {item.affectedSectors?.length>0 && (
                <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                  {item.affectedSectors.map((s,j)=><span key={j} style={{ ...ss.pill(C.primary), fontSize:10 }}>{s}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ALERTS */}
      {tab === "alerts" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:4 }}>Price Alerts</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Get notified on price movements</div>
          {alerts.map((al,i)=>(
            <div key={i} style={{ ...ss.card, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:al.type==="Above"?`${C.positive}18`:`${C.negative}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {al.type==="Above"?<TrendingUp size={18} color={C.positive}/>:<TrendingDown size={18} color={C.negative}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{al.sym}</div>
                <div style={{ fontSize:11, color:C.muted }}>{al.type} ₹{al.price}</div>
              </div>
              <button onClick={()=>setAlerts(a=>a.filter((_,j)=>j!==i))} style={{ background:`${C.negative}14`, border:`1px solid ${C.negative}30`, borderRadius:8, padding:"6px 10px", color:C.negative, cursor:"pointer" }}>
                <Trash2 size={12}/>
              </button>
            </div>
          ))}
          <div style={{ ...ss.card, marginTop:8 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, marginBottom:11 }}>Add Alert</div>
            <input placeholder="Symbol (e.g. NIFTY 50, TCS)" value={newAlertSym} onChange={e=>setNewAlertSym(e.target.value)} style={{ ...ss.input, marginBottom:8 }}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:11 }}>
              <select value={newAlertType} onChange={e=>setNewAlertType(e.target.value)} style={{ ...ss.input, appearance:"none" }}>
                <option>Above</option><option>Below</option>
              </select>
              <input placeholder="Target Price ₹" type="number" value={newAlertPrice} onChange={e=>setNewAlertPrice(e.target.value)} style={ss.input}/>
            </div>
            <button onClick={()=>{ if(newAlertSym&&newAlertPrice){setAlerts(a=>[...a,{sym:newAlertSym.toUpperCase(),type:newAlertType,price:parseFloat(newAlertPrice)}]);setNewAlertSym("");setNewAlertPrice("");}}} style={{ ...ss.btnPrimary, background:`linear-gradient(135deg,${C.warning},#e8960d)` }}>
              <Bell size={14}/> Set Alert
            </button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={ss.navBar}>
        {[[`home`,"Home",Home],[`analyze`,"Analyze",Zap],[`portfolio`,"Portfolio",Briefcase],[`news`,"News",Newspaper],[`alerts`,"Alerts",Bell]].map(([k,l,Icon])=>(
          <button key={k} onClick={()=>setTab(k)} style={ss.navBtn(tab===k)}>
            <Icon size={20}/>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.4px" }}>{l}</span>
            {tab===k && <div style={{ position:"absolute", bottom:0, width:22, height:2, background:C.accent, borderRadius:2 }}/>}
          </button>
        ))}
      </nav>
    </div>
  );
}
