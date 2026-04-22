
import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, Cell } from "recharts";
import { Search, TrendingUp, TrendingDown, BarChart2, Briefcase, Bell, Activity, AlertTriangle, CheckCircle, Plus, Trash2, Home, Zap, Target, Shield, RefreshCw, Star, ChevronRight, Info, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Newspaper, SlidersHorizontal } from "lucide-react";

const C = {
  bg: "#06060f",
  card: "#0c0c1e",
  cardBright: "#10102a",
  border: "#1e1e40",
  borderBright: "#2d2d5a",
  primary: "#5b8aff",
  accent: "#00ffcc",
  positive: "#00e87a",
  negative: "#ff4466",
  warning: "#ffaa00",
  gold: "#ffd700",
  text: "#dde4ff",
  muted: "#6070a8",
  dim: "#2a3060",
};

const MARKET = [
  { n: "SENSEX", v: "73,847.15", c: "+0.82%", up: true },
  { n: "NIFTY 50", v: "22,419.95", c: "+0.76%", up: true },
  { n: "BANK NIFTY", v: "47,234.30", c: "-0.23%", up: false },
  { n: "NIFTY IT", v: "35,621.80", c: "+1.42%", up: true },
  { n: "GOLD", v: "₹72,450", c: "+0.41%", up: true },
  { n: "USD/INR", v: "83.42", c: "-0.12%", up: false },
  { n: "CRUDE OIL", v: "$87.34", c: "+1.23%", up: true },
  { n: "BTC", v: "$67,832", c: "+2.15%", up: true },
  { n: "NIFTY MIDCAP", v: "48,320.55", c: "+1.14%", up: true },
  { n: "VIX", v: "14.23", c: "-5.2%", up: false },
];

const TRENDING_STOCKS = [
  { sym: "RELIANCE", name: "Reliance Industries", chg: "+2.3%", up: true, sec: "Energy", price: "2,954" },
  { sym: "TCS", name: "Tata Consultancy", chg: "+1.8%", up: true, sec: "IT", price: "3,782" },
  { sym: "HDFC BANK", name: "HDFC Bank Ltd", chg: "-0.9%", up: false, sec: "Banking", price: "1,642" },
  { sym: "INFY", name: "Infosys Ltd", chg: "+1.2%", up: true, sec: "IT", price: "1,487" },
  { sym: "ADANI GRP", name: "Adani Enterprises", chg: "+3.1%", up: true, sec: "Infrastructure", price: "3,201" },
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

async function callClaudeAnalysis(params) {
  const { symbol, type, amount, horizon, exchange } = params;
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are an expert financial analyst for Indian & global markets. Analyze ${symbol} (${type}) on ${exchange} for an investment of ₹${amount} with a ${horizon} investment horizon as of April 2026.

Return ONLY valid JSON with no markdown fences:
{
  "overview": "2-3 sentence factual company/fund description",
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
    "signals": ["RSI in healthy zone", "Price above 200 DMA", "MACD positive"]
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
    "summary": "Strong institutional buying with positive news flow",
    "institutional": "Net Buyers",
    "fii": "Net buyers ₹2,340 Cr this month",
    "dii": "Net buyers ₹1,890 Cr this month",
    "analystRating": "Buy",
    "analystTarget": 3250
  },
  "risk": {
    "level": "Medium",
    "score": 5,
    "beta": "1.12",
    "volatility": "Medium",
    "risks": ["Crude oil price sensitivity", "Regulatory changes in telecom", "Global demand slowdown"],
    "positives": ["Strong balance sheet", "Diversified revenue streams", "Market leadership"]
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
    "units": ${Math.round(parseInt(amount) / 2954 * 10) / 10},
    "return1y": ${Math.round(parseInt(amount) * 1.22)},
    "return3y": ${Math.round(parseInt(amount) * 1.81)},
    "return5y": ${Math.round(parseInt(amount) * 2.7)},
    "breakeven": "N/A (already profitable)",
    "recommendation": "Buy",
    "target": 3600,
    "stopLoss": 2700,
    "sip": "Consider ₹${Math.round(parseInt(amount) / 12)}/month SIP for rupee cost averaging"
  },
  "catalysts": ["New energy business ramping up strongly", "Jio subscriber growth momentum", "Retail expansion across tier-2/3 cities", "5G rollout completion"],
  "concerns": ["High valuation premium vs peers", "Geopolitical risks on crude imports"],
  "recentNews": ["Q3 results beat expectations with 14.2% profit growth", "JIO platforms signs major partnerships", "New solar energy capacity commissioned"],
  "sectorOutlook": "Positive - Energy transition and digital consumption driving sector growth",
  "summary": "4-5 sentence investment summary with clear actionable recommendation based on current market conditions."
}

Use REALISTIC data for ${symbol} based on actual recent performance and market conditions in April 2026. All numbers must be realistic and internally consistent.`
      }]
    })
  });
  const data = await resp.json();
  const raw = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

async function getMarketNews() {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `You are a financial news analyst. Generate 5 recent market news items for Indian markets as of April 2026. Return ONLY JSON array:
[
  {
    "headline": "news headline",
    "summary": "2 sentence summary",
    "impact": "Positive/Negative/Neutral",
    "affectedSectors": ["IT", "Banking"],
    "time": "2 hours ago"
  }
]`
      }]
    })
  });
  const data = await resp.json();
  const raw = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
}

const s = {
  app: { fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 },
  ticker: { background: `linear-gradient(90deg, ${C.bg}, #0a0a20)`, borderBottom: `1px solid ${C.border}`, padding: "6px 0", overflow: "hidden", whiteSpace: "nowrap" },
  tickerInner: { display: "inline-flex", gap: 32, animation: "ticker 40s linear infinite" },
  tickerItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "'Space Mono', monospace" },
  header: { padding: "14px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` },
  logo: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" },
  navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `rgba(6,6,15,0.95)`, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 100 },
  navBtn: (active) => ({ flex: 1, padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", color: active ? C.accent : C.muted, transition: "all 0.2s" }),
  navLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" },
  page: { padding: "16px" },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardBright: { background: C.cardBright, border: `1px solid ${C.borderBright}`, borderRadius: 16, padding: 16, marginBottom: 12 },
  marketCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", minWidth: 120, textAlign: "center" },
  input: { background: "#0d0d25", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14, width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" },
  btn: (color = C.primary) => ({ background: `linear-gradient(135deg, ${color}22, ${color}44)`, border: `1px solid ${color}66`, borderRadius: 12, color: color, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", transition: "all 0.2s" }),
  btnFull: (color = C.primary) => ({ ...s.btn(color), background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none" }),
  pill: (color = C.muted) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 20, padding: "4px 10px", fontSize: 11, color, fontWeight: 600 }),
  tab: (active) => ({ padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: active ? `${C.primary}22` : "transparent", color: active ? C.primary : C.muted, borderColor: active ? `${C.primary}44` : "transparent", borderWidth: 1, borderStyle: "solid", transition: "all 0.2s" }),
};

function GaugeMeter({ value, max = 100, color = C.primary, label, size = 80 }) {
  const pct = value / max;
  const angle = pct * 180 - 90;
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2;
  const startX = cx + r * Math.cos((-90 * Math.PI) / 180);
  const startY = cy + r * Math.sin((-90 * Math.PI) / 180);
  const endX = cx + r * Math.cos(((angle) * Math.PI) / 180);
  const endY = cy + r * Math.sin(((angle) * Math.PI) / 180);
  const largeArc = pct > 0.5 ? 1 : 0;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size / 2 + 10}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.dim} strokeWidth={6} />
        <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={14} fontWeight="bold" fontFamily="'Space Mono'">{value}</text>
      </svg>
      <div style={{ fontSize: 10, color: C.muted, marginTop: -4 }}>{label}</div>
    </div>
  );
}

function ScoreBar({ label, score, max = 10, color = C.primary }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 12, color, fontFamily: "'Space Mono'", fontWeight: 700 }}>{score}/{max}</span>
      </div>
      <div style={{ background: C.dim, borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${(score / max) * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, height: "100%", borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function StarRating({ n }) {
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
    { sym: "HDFC BANK", type: "Above", price: 1700, active: true },
    { sym: "INFY", type: "Below", price: 1400, active: true },
  ]);
  const [newAlertSym, setNewAlertSym] = useState("");
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertType, setNewAlertType] = useState("Above");
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const [newPos, setNewPos] = useState({ sym: "", qty: "", buy: "", type: "Stock" });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      @keyframes spin { to { transform:rotate(360deg) } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 0; height: 0; }
      input::placeholder { color: #3d4a70; }
      select option { background: #0c0c1e; }
    `;
    document.head.appendChild(style);
  }, []);

  const handleAnalyze = async () => {
    if (!symbol.trim()) { setError("Please enter a stock or mutual fund symbol"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const data = await callClaudeAnalysis({ symbol: symbol.trim().toUpperCase(), type: assetType, amount, horizon, exchange });
      setResult(data);
      setATab("technical");
    } catch (e) {
      setError("Analysis failed. Check your symbol and try again.");
      console.error(e);
    }
    setLoading(false);
  };

  const loadNews = async () => {
    setNewsLoading(true);
    try {
      const data = await getMarketNews();
      setNews(data);
    } catch (e) { console.error(e); }
    setNewsLoading(false);
  };

  const portfolioValue = portfolio.reduce((s, p) => s + p.qty * p.cur, 0);
  const portfolioCost = portfolio.reduce((s, p) => s + p.qty * p.buy, 0);
  const portfolioPnL = portfolioValue - portfolioCost;
  const portfolioPct = ((portfolioPnL / portfolioCost) * 100).toFixed(2);

  const projectionData = result ? [
    { t: "Now", p: result.currentPrice },
    { t: "1M", p: result.targets["1m"].price },
    { t: "3M", p: result.targets["3m"].price },
    { t: "6M", p: result.targets["6m"].price },
    { t: "1Y", p: result.targets["1y"].price },
  ] : [];

  const radarData = result ? [
    { subject: "Technical", A: result.technical.score },
    { subject: "Fundamental", A: result.fundamental.score },
    { subject: "Sentiment", A: result.sentiment.score },
    { subject: "Safety", A: (10 - result.risk.score) * 10 },
    { subject: "Growth", A: parseInt(result.targets.cagr) * 2 },
  ] : [];

  const portfolioChartData = portfolio.map(p => ({
    name: p.sym,
    value: p.qty * p.cur,
    pnl: (p.cur - p.buy) / p.buy * 100
  }));

  const CHART_COLORS = [C.primary, C.accent, C.warning, C.positive, C.negative];

  return (
    <div style={s.app}>
      {/* TICKER TAPE */}
      <div style={s.ticker}>
        <div style={s.tickerInner}>
          {[...MARKET, ...MARKET].map((m, i) => (
            <div key={i} style={s.tickerItem}>
              <span style={{ color: C.muted, fontSize: 10 }}>{m.n}</span>
              <span style={{ color: C.text, fontWeight: 700 }}>{m.v}</span>
              <span style={{ color: m.up ? C.positive : C.negative }}>{m.c}</span>
              <span style={{ color: C.dim, fontSize: 10 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>
          <span style={{ color: C.accent }}>◈</span>
          <span style={{ background: `linear-gradient(90deg, ${C.text}, ${C.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> StockIQ</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.positive, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "'Space Mono'" }}>LIVE</span>
        </div>
      </div>

      {/* HOME TAB */}
      {tab === "home" && (
        <div style={s.page}>
          {/* Market Overview */}
          <div style={{ ...s.sectionTitle, marginTop: 4 }}>Market Overview</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
            {[
              { label: "SENSEX", val: "73,847", chg: "+0.82%", up: true },
              { label: "NIFTY 50", val: "22,419", chg: "+0.76%", up: true },
              { label: "BANK NIFTY", val: "47,234", chg: "-0.23%", up: false },
              { label: "NIFTY IT", val: "35,621", chg: "+1.42%", up: true },
            ].map((m, i) => (
              <div key={i} style={{ ...s.marketCard, flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 14, fontWeight: 700, color: C.text }}>{m.val}</div>
                <div style={{ fontSize: 11, color: m.up ? C.positive : C.negative, marginTop: 2 }}>{m.up ? "▲" : "▼"} {m.chg}</div>
              </div>
            ))}
          </div>

          {/* Trending Stocks */}
          <div style={s.sectionTitle}>🔥 Trending Stocks</div>
          <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
            {TRENDING_STOCKS.map((st, i) => (
              <div key={i} onClick={() => { setSymbol(st.sym); setTab("analyze"); }}
                style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: i < TRENDING_STOCKS.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.cardBright}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}18`, border: `1px solid ${C.primary}30`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.primary }}>{st.sym.slice(0, 2)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{st.sym}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{st.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 13, color: C.text }}>₹{st.price}</div>
                  <div style={{ fontSize: 11, color: st.up ? C.positive : C.negative }}>
                    {st.up ? <ArrowUpRight size={10} style={{ display: "inline" }} /> : <ArrowDownRight size={10} style={{ display: "inline" }} />}
                    {" "}{st.chg}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Mutual Funds */}
          <div style={s.sectionTitle}>📈 Top Mutual Funds</div>
          <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
            {TOP_MFS.map((mf, i) => (
              <div key={i} style={{ padding: "12px 14px", borderBottom: i < TOP_MFS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{mf.name}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <StarRating n={mf.stars} />
                      <span style={{ fontSize: 10, color: C.muted }}>{mf.cat}</span>
                      <span style={{ fontSize: 10, color: C.dim }}>AUM {mf.aum}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 14, fontWeight: 700, color: C.positive }}>{mf.ret}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Analyze CTA */}
          <div style={{ ...s.card, background: `linear-gradient(135deg, ${C.primary}15, ${C.accent}08)`, border: `1px solid ${C.primary}30`, cursor: "pointer" }} onClick={() => setTab("analyze")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${C.primary}20`, border: `1px solid ${C.primary}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={20} color={C.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne'", fontSize: 15, fontWeight: 700, color: C.text }}>AI Deep Analysis</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Get predictions, technicals & fundamentals</div>
              </div>
              <ChevronRight size={16} color={C.primary} />
            </div>
          </div>
        </div>
      )}

      {/* ANALYZE TAB */}
      {tab === "analyze" && (
        <div style={s.page}>
          <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>AI Analysis</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Deep-dive technical, fundamental & predictive analysis</div>

          {/* Input Form */}
          <div style={s.card}>
            {/* Asset Type Toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["stock", "mutual fund", "ETF", "index"].map(t => (
                <button key={t} onClick={() => setAssetType(t)} style={{ ...s.tab(assetType === t), fontSize: 11, textTransform: "capitalize", padding: "6px 12px" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            {/* Symbol */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>SYMBOL / NAME</label>
              <div style={{ position: "relative" }}>
                <Search size={14} color={C.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input value={symbol} onChange={e => setSymbol(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAnalyze()} placeholder="e.g. RELIANCE, TCS, INFY..." style={{ ...s.input, paddingLeft: 34 }} />
              </div>
            </div>

            {/* Exchange + Amount Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>EXCHANGE</label>
                <select value={exchange} onChange={e => setExchange(e.target.value)} style={{ ...s.input, appearance: "none" }}>
                  {EXCHANGES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>INVESTMENT (₹)</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="50000" type="number" style={s.input} />
              </div>
            </div>

            {/* Horizon */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>INVESTMENT HORIZON</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {HORIZONS.map(h => (
                  <button key={h} onClick={() => setHorizon(h)} style={{ ...s.tab(horizon === h), fontSize: 11, padding: "5px 10px" }}>{h}</button>
                ))}
              </div>
            </div>

            {error && <div style={{ background: `${C.negative}15`, border: `1px solid ${C.negative}40`, borderRadius: 10, padding: "10px 12px", fontSize: 12, color: C.negative, marginBottom: 12 }}>{error}</div>}

            <button onClick={handleAnalyze} disabled={loading} style={{ ...s.btnFull(C.primary), opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⊕</span> Analyzing with AI...</> : <><Zap size={16} /> Analyze Now</>}
            </button>
          </div>

          {/* RESULTS */}
          {result && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {/* Overview Header */}
              <div style={{ ...s.cardBright, background: `linear-gradient(135deg, ${C.primary}12, ${C.accent}06)`, border: `1px solid ${C.primary}30` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: C.text }}>{symbol.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{exchange} • {assetType.charAt(0).toUpperCase() + assetType.slice(1)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700, color: C.accent }}>{result.priceUnit}{result.currentPrice.toLocaleString()}</div>
                    {result.marketCap && <div style={{ fontSize: 10, color: C.muted }}>Mkt Cap: {result.marketCap}</div>}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>{result.overview}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={s.pill(result.technical.rating === "Buy" || result.technical.rating === "Strong Buy" ? C.positive : result.technical.rating === "Sell" || result.technical.rating === "Strong Sell" ? C.negative : C.warning)}>
                    {result.investment.recommendation}
                  </span>
                  <span style={s.pill(C.primary)}>Risk: {result.risk.level}</span>
                  <span style={s.pill(C.accent)}>CAGR {result.targets.cagr}</span>
                </div>
              </div>

              {/* Analysis Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                {[
                  { key: "technical", label: "Technical", icon: Activity },
                  { key: "fundamental", label: "Fundamental", icon: BarChart2 },
                  { key: "prediction", label: "AI Predict", icon: Target },
                  { key: "sentiment", label: "Sentiment", icon: Newspaper },
                  { key: "risk", label: "Risk", icon: Shield },
                ].map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setATab(key)} style={{ ...s.tab(aTab === key), display: "flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 11 }}>
                    <Icon size={11} />{label}
                  </button>
                ))}
              </div>

              {/* Technical Analysis */}
              {aTab === "technical" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={s.card}>
                    <div style={s.sectionTitle}>Technical Indicators</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                      <GaugeMeter value={result.technical.rsi} label="RSI" color={result.technical.rsi > 70 ? C.negative : result.technical.rsi < 30 ? C.positive : C.primary} />
                      <GaugeMeter value={result.technical.score} label="Tech Score" color={C.accent} />
                      <GaugeMeter value={result.fundamental.score} label="Fund Score" color={C.warning} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Trend", val: result.technical.trend, color: result.technical.trend === "Bullish" ? C.positive : result.technical.trend === "Bearish" ? C.negative : C.warning },
                        { label: "MACD", val: result.technical.macd, color: result.technical.macd.includes("Bullish") ? C.positive : C.negative },
                        { label: "50 DMA", val: `₹${result.technical.ma50}`, color: C.text },
                        { label: "200 DMA", val: `₹${result.technical.ma200}`, color: C.text },
                        { label: "Support", val: `₹${result.technical.support}`, color: C.positive },
                        { label: "Resistance", val: `₹${result.technical.resistance}`, color: C.negative },
                        { label: "Volume", val: result.technical.volume, color: C.warning },
                        { label: "Signal", val: result.technical.rating, color: C.accent },
                      ].map((item, i) => (
                        <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "'Space Mono'" }}>{item.val}</div>
                        </div>
                      ))}
                    </div>

                    {result.technical.signals && (
                      <div style={{ marginTop: 12 }}>
                        {result.technical.signals.map((sig, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <CheckCircle size={12} color={C.positive} />
                            <span style={{ fontSize: 12, color: C.muted }}>{sig}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fundamental Analysis */}
              {aTab === "fundamental" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={s.card}>
                    <div style={s.sectionTitle}>Fundamental Metrics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {[
                        { label: "P/E Ratio", val: result.fundamental.pe },
                        { label: "P/B Ratio", val: result.fundamental.pb },
                        { label: "Debt/Equity", val: result.fundamental.de },
                        { label: "ROE", val: result.fundamental.roe },
                        { label: "EPS", val: result.fundamental.eps },
                        { label: "Div Yield", val: result.fundamental.dividendYield },
                        { label: "Rev Growth", val: result.fundamental.revenueGrowth },
                        { label: "Profit Growth", val: result.fundamental.netProfitGrowth },
                      ].map((item, i) => (
                        <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Space Mono'" }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                    <ScoreBar label="Fundamental Score" score={result.fundamental.score} max={100} color={C.warning} />
                    <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 12, color: C.muted }}>Overall Rating</div>
                      <div style={{ fontFamily: "'Syne'", fontSize: 18, fontWeight: 700, color: result.fundamental.rating === "Excellent" ? C.positive : result.fundamental.rating === "Good" ? C.accent : result.fundamental.rating === "Average" ? C.warning : C.negative }}>{result.fundamental.rating}</div>
                    </div>
                  </div>
                  {result.catalysts && (
                    <div style={s.card}>
                      <div style={s.sectionTitle}>Key Catalysts</div>
                      {result.catalysts.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 10px", background: `${C.positive}08`, borderRadius: 8, border: `1px solid ${C.positive}20` }}>
                          <TrendingUp size={14} color={C.positive} style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{c}</span>
                        </div>
                      ))}
                      {result.concerns?.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 10px", background: `${C.warning}08`, borderRadius: 8, border: `1px solid ${C.warning}20` }}>
                          <AlertTriangle size={14} color={C.warning} style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Prediction */}
              {aTab === "prediction" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={s.card}>
                    <div style={s.sectionTitle}>Price Projection Chart</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={projectionData}>
                        <defs>
                          <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={C.dim} strokeDasharray="3 3" />
                        <XAxis dataKey="t" stroke={C.muted} tick={{ fontSize: 10 }} />
                        <YAxis stroke={C.muted} tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                        <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                        <Area type="monotone" dataKey="p" stroke={C.accent} strokeWidth={2} fill="url(#projGrad)" dot={{ fill: C.accent, r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={s.card}>
                    <div style={s.sectionTitle}>Price Targets</div>
                    {[
                      { period: "1 Month", data: result.targets["1m"] },
                      { period: "3 Months", data: result.targets["3m"] },
                      { period: "6 Months", data: result.targets["6m"] },
                      { period: "1 Year", data: result.targets["1y"] },
                    ].map(({ period, data }, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.bg, borderRadius: 10, marginBottom: 8, border: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{period}</span>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontFamily: "'Space Mono'", fontSize: 13, fontWeight: 700, color: C.text }}>₹{data.price}</span>
                          <span style={{ fontSize: 11, color: C.positive }}>{data.upside}</span>
                          <span style={{ fontSize: 10, color: C.muted }}>P: {data.prob}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                      <div style={{ background: `${C.positive}10`, border: `1px solid ${C.positive}25`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: C.muted }}>Bull Case</div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 15, color: C.positive, fontWeight: 700 }}>₹{result.targets.bullCase}</div>
                      </div>
                      <div style={{ background: `${C.negative}10`, border: `1px solid ${C.negative}25`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: C.muted }}>Bear Case</div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 15, color: C.negative, fontWeight: 700 }}>₹{result.targets.bearCase}</div>
                      </div>
                    </div>
                  </div>

                  <div style={s.card}>
                    <div style={s.sectionTitle}>Investment Returns</div>
                    {[
                      { label: "Invested", val: `₹${parseInt(amount).toLocaleString()}`, color: C.text },
                      { label: "Expected in 1Y", val: `₹${result.investment.return1y?.toLocaleString()}`, color: C.positive },
                      { label: "Expected in 3Y", val: `₹${result.investment.return3y?.toLocaleString()}`, color: C.accent },
                      { label: "Expected in 5Y", val: `₹${result.investment.return5y?.toLocaleString()}`, color: C.gold },
                      { label: "Target Price", val: `₹${result.investment.target}`, color: C.positive },
                      { label: "Stop Loss", val: `₹${result.investment.stopLoss}`, color: C.negative },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{item.label}</span>
                        <span style={{ fontFamily: "'Space Mono'", fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
                      </div>
                    ))}
                    {result.investment.sip && (
                      <div style={{ marginTop: 12, background: `${C.primary}10`, border: `1px solid ${C.primary}25`, borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 11, color: C.primary }}>💡 SIP Suggestion</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{result.investment.sip}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {aTab === "sentiment" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={s.card}>
                    <div style={s.sectionTitle}>Market Sentiment</div>
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <GaugeMeter value={result.sentiment.score} label="Sentiment Score" color={result.sentiment.score > 60 ? C.positive : result.sentiment.score < 40 ? C.negative : C.warning} size={100} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                      {[
                        { label: "Overall", val: result.sentiment.overall },
                        { label: "Institutional", val: result.sentiment.institutional },
                        { label: "Analyst Rating", val: result.sentiment.analystRating },
                        { label: "Analyst Target", val: `₹${result.sentiment.analystTarget}` },
                      ].map((item, i) => (
                        <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}`, marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>FII Activity</div>
                      <div style={{ fontSize: 12, color: C.text }}>{result.sentiment.fii}</div>
                    </div>
                    <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}`, marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>DII Activity</div>
                      <div style={{ fontSize: 12, color: C.text }}>{result.sentiment.dii}</div>
                    </div>
                    <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>News Summary</div>
                      <div style={{ fontSize: 12, color: C.text }}>{result.sentiment.summary}</div>
                    </div>
                  </div>
                  {result.recentNews && (
                    <div style={s.card}>
                      <div style={s.sectionTitle}>Recent News</div>
                      {result.recentNews.map((n, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 10px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                          <Newspaper size={14} color={C.primary} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.sectorOutlook && (
                    <div style={{ ...s.card, background: `${C.accent}08`, border: `1px solid ${C.accent}25` }}>
                      <div style={{ fontSize: 11, color: C.accent, marginBottom: 4, fontWeight: 600 }}>SECTOR OUTLOOK</div>
                      <div style={{ fontSize: 13, color: C.text }}>{result.sectorOutlook}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Risk Assessment */}
              {aTab === "risk" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={s.card}>
                    <div style={s.sectionTitle}>Risk Assessment</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {[
                        { label: "Risk Level", val: result.risk.level, color: result.risk.level === "Low" ? C.positive : result.risk.level === "Medium" ? C.warning : C.negative },
                        { label: "Risk Score", val: `${result.risk.score}/10`, color: C.warning },
                        { label: "Beta", val: result.risk.beta, color: C.text },
                        { label: "Volatility", val: result.risk.volatility, color: C.warning },
                      ].map((item, i) => (
                        <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "'Space Mono'" }}>{item.val}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: C.negative, fontWeight: 600, marginBottom: 8 }}>⚠ Key Risks</div>
                      {result.risk.risks.map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <AlertTriangle size={12} color={C.negative} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, color: C.muted }}>{r}</span>
                        </div>
                      ))}
                    </div>
                    {result.risk.positives && (
                      <div>
                        <div style={{ fontSize: 12, color: C.positive, fontWeight: 600, marginBottom: 8 }}>✓ Strengths</div>
                        {result.risk.positives.map((p, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                            <CheckCircle size={12} color={C.positive} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: C.muted }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ ...s.card, background: `${C.primary}08`, border: `1px solid ${C.primary}25` }}>
                    <div style={{ fontSize: 11, color: C.primary, marginBottom: 8, fontWeight: 700 }}>OVERALL SUMMARY</div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{result.summary}</div>
                    <div style={{ marginTop: 12, padding: "8px 10px", background: `${C.warning}10`, borderRadius: 8, fontSize: 11, color: C.muted, borderLeft: `3px solid ${C.warning}` }}>
                      ⚠ Disclaimer: This is AI-generated analysis for informational purposes only. Not financial advice. Consult a SEBI-registered advisor before investing.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div style={{ textAlign: "center", padding: "30px 20px", color: C.muted }}>
              <Activity size={40} color={C.dim} style={{ margin: "0 auto 12px", display: "block" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: C.muted }}>Enter any stock or mutual fund</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>e.g. RELIANCE, NIFTY 50, TCS, SBI Small Cap Fund</div>
            </div>
          )}
        </div>
      )}

      {/* PORTFOLIO TAB */}
      {tab === "portfolio" && (
        <div style={s.page}>
          <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Portfolio</div>

          {/* Summary Card */}
          <div style={{ ...s.card, background: `linear-gradient(135deg, ${portfolioPnL >= 0 ? C.positive : C.negative}15, ${C.primary}08)`, border: `1px solid ${portfolioPnL >= 0 ? C.positive : C.negative}30` }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Total Portfolio Value</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 28, fontWeight: 700, color: C.text }}>₹{portfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>Invested</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 14, color: C.text }}>₹{portfolioCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>P&L</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 14, color: portfolioPnL >= 0 ? C.positive : C.negative }}>
                  {portfolioPnL >= 0 ? "+" : ""}₹{portfolioPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>Returns</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 14, color: portfolioPnL >= 0 ? C.positive : C.negative }}>{portfolioPnL >= 0 ? "+" : ""}{portfolioPct}%</div>
              </div>
            </div>
          </div>

          {/* Holdings */}
          <div style={s.sectionTitle}>Holdings</div>
          <div style={{ ...s.card, padding: 0, overflow: "hidden", marginBottom: 12 }}>
            {portfolio.map((pos, i) => {
              const val = pos.qty * pos.cur;
              const cost = pos.qty * pos.buy;
              const pnl = val - cost;
              const pct = ((pnl / cost) * 100).toFixed(2);
              return (
                <div key={i} style={{ padding: "12px 14px", borderBottom: i < portfolio.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{pos.sym}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{pos.qty} units × ₹{pos.cur} • {pos.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Space Mono'", fontSize: 13, color: C.text }}>₹{val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                      <div style={{ fontSize: 11, color: pnl >= 0 ? C.positive : C.negative }}>{pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ({pct}%)</div>
                    </div>
                  </div>
                  <div style={{ background: C.dim, borderRadius: 3, height: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(Math.abs(parseFloat(pct)) * 3, 100)}%`, background: pnl >= 0 ? C.positive : C.negative, height: "100%", borderRadius: 3 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <button onClick={() => { setSymbol(pos.sym); setTab("analyze"); }} style={{ fontSize: 11, color: C.primary, background: "none", border: "none", cursor: "pointer" }}>Analyze →</button>
                    <button onClick={() => setPortfolio(p => p.filter((_, j) => j !== i))} style={{ fontSize: 11, color: C.negative, background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Position */}
          <button onClick={() => setAddPortfolioOpen(!addPortfolioOpen)} style={s.btn(C.accent)}>
            <Plus size={16} /> Add Position
          </button>
          {addPortfolioOpen && (
            <div style={{ ...s.card, marginTop: 12, animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input placeholder="Symbol" value={newPos.sym} onChange={e => setNewPos(p => ({ ...p, sym: e.target.value }))} style={s.input} />
                <select value={newPos.type} onChange={e => setNewPos(p => ({ ...p, type: e.target.value }))} style={{ ...s.input, appearance: "none" }}>
                  <option>Stock</option><option>MF</option><option>ETF</option>
                </select>
                <input placeholder="Qty / Units" type="number" value={newPos.qty} onChange={e => setNewPos(p => ({ ...p, qty: e.target.value }))} style={s.input} />
                <input placeholder="Buy Price (₹)" type="number" value={newPos.buy} onChange={e => setNewPos(p => ({ ...p, buy: e.target.value }))} style={s.input} />
              </div>
              <button onClick={() => {
                if (newPos.sym && newPos.qty && newPos.buy) {
                  setPortfolio(p => [...p, { sym: newPos.sym.toUpperCase(), qty: parseFloat(newPos.qty), buy: parseFloat(newPos.buy), cur: parseFloat(newPos.buy) * 1.05, type: newPos.type }]);
                  setNewPos({ sym: "", qty: "", buy: "", type: "Stock" });
                  setAddPortfolioOpen(false);
                }
              }} style={s.btnFull(C.positive)}>Add to Portfolio</button>
            </div>
          )}
        </div>
      )}

      {/* NEWS TAB */}
      {tab === "news" && (
        <div style={s.page}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: C.text }}>Market News</div>
              <div style={{ fontSize: 12, color: C.muted }}>AI-curated & analyzed</div>
            </div>
            <button onClick={loadNews} style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}40`, borderRadius: 10, padding: "8px 12px", color: C.primary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <RefreshCw size={12} style={{ animation: newsLoading ? "spin 1s linear infinite" : "none" }} /> Refresh
            </button>
          </div>

          {!news && !newsLoading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Newspaper size={40} color={C.dim} style={{ margin: "0 auto 12px", display: "block" }} />
              <div style={{ fontSize: 14, color: C.muted }}>Load AI-analyzed market news</div>
              <button onClick={loadNews} style={{ ...s.btnFull(C.primary), marginTop: 16, width: "auto", padding: "10px 24px" }}>
                <Zap size={14} /> Load News
              </button>
            </div>
          )}

          {newsLoading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 14, color: C.muted, animation: "pulse 1s infinite" }}>Loading AI-analyzed news...</div>
            </div>
          )}

          {news && news.map((item, i) => (
            <div key={i} style={{ ...s.card, borderLeft: `3px solid ${item.impact === "Positive" ? C.positive : item.impact === "Negative" ? C.negative : C.warning}`, animation: `fadeIn ${0.1 + i * 0.1}s ease` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={s.pill(item.impact === "Positive" ? C.positive : item.impact === "Negative" ? C.negative : C.warning)}>{item.impact}</span>
                <span style={{ fontSize: 11, color: C.dim }}>{item.time}</span>
              </div>
              <div style={{ fontFamily: "'Syne'", fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6, lineHeight: 1.4 }}>{item.headline}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.summary}</div>
              {item.affectedSectors?.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {item.affectedSectors.map((sec, j) => (
                    <span key={j} style={{ ...s.pill(C.primary), fontSize: 10 }}>{sec}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ALERTS TAB */}
      {tab === "alerts" && (
        <div style={s.page}>
          <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Price Alerts</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Set alerts for price movements</div>

          {alerts.map((alert, i) => (
            <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: alert.type === "Above" ? `${C.positive}18` : `${C.negative}18`, border: `1px solid ${alert.type === "Above" ? C.positive : C.negative}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {alert.type === "Above" ? <TrendingUp size={18} color={C.positive} /> : <TrendingDown size={18} color={C.negative} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{alert.sym}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{alert.type} ₹{alert.price}</div>
              </div>
              <button onClick={() => setAlerts(a => a.filter((_, j) => j !== i))} style={{ background: `${C.negative}15`, border: `1px solid ${C.negative}30`, borderRadius: 8, padding: "6px 10px", color: C.negative, cursor: "pointer", fontSize: 11 }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          <div style={{ ...s.card, marginTop: 8 }}>
            <div style={{ fontFamily: "'Syne'", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Add New Alert</div>
            <input placeholder="Symbol (e.g. NIFTY 50)" value={newAlertSym} onChange={e => setNewAlertSym(e.target.value)} style={{ ...s.input, marginBottom: 8 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <select value={newAlertType} onChange={e => setNewAlertType(e.target.value)} style={{ ...s.input, appearance: "none" }}>
                <option>Above</option><option>Below</option>
              </select>
              <input placeholder="Price (₹)" type="number" value={newAlertPrice} onChange={e => setNewAlertPrice(e.target.value)} style={s.input} />
            </div>
            <button onClick={() => {
              if (newAlertSym && newAlertPrice) {
                setAlerts(a => [...a, { sym: newAlertSym.toUpperCase(), type: newAlertType, price: parseFloat(newAlertPrice), active: true }]);
                setNewAlertSym(""); setNewAlertPrice("");
              }
            }} style={s.btnFull(C.warning)}>
              <Bell size={14} /> Set Alert
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav style={s.navBar}>
        {[
          { key: "home", label: "Home", Icon: Home },
          { key: "analyze", label: "Analyze", Icon: Zap },
          { key: "portfolio", label: "Portfolio", Icon: Briefcase },
          { key: "news", label: "News", Icon: Newspaper },
          { key: "alerts", label: "Alerts", Icon: Bell },
        ].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={s.navBtn(tab === key)}>
            <Icon size={20} />
            <span style={s.navLabel}>{label}</span>
            {tab === key && <div style={{ position: "absolute", bottom: 0, width: 20, height: 2, background: C.accent, borderRadius: 2 }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}
