import { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const i = Number(income);
    const c = Number(cost);

    if (!i || !c) return;

    const remaining = i - c;
    const score = Math.max(0, Math.min(100, ((remaining / i) * 100).toFixed(0)));

    let status = "Stable";
    if (score >= 70) status = "Strong Fit";
    else if (score >= 40) status = "Moderate Risk";
    else status = "High Risk";

    const runwayMonths = remaining > 0 ? Math.floor(remaining / (c || 1)) : 0;

    setResult({ remaining, score, status, runwayMonths });
  };

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>CareerCash</h2>
        <p style={styles.tagline}>
          Career affordability intelligence for early-stage professionals
        </p>

        <div style={styles.smallBox}>
          <p style={styles.smallText}>Investor Snapshot</p>
          <p style={styles.smallValue}>AI-powered financial readiness scoring</p>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.title}>Career Financial Dashboard</h1>
        <p style={styles.subtitle}>
          Evaluate whether you can realistically afford a career path before committing.
        </p>

        {/* Input Card */}
        <div style={styles.card}>
          <h3>Input Parameters</h3>

          <input
            style={styles.input}
            placeholder="Monthly income ($)"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Monthly career cost ($)"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />

          <button style={styles.button} onClick={calculate}>
            Generate CareerCash Score
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.grid}>
            <div style={styles.metricCard}>
              <h4>CareerCash Score</h4>
              <p style={styles.big}>{result.score}/100</p>
            </div>

            <div style={styles.metricCard}>
              <h4>Financial Status</h4>
              <p style={styles.big}>{result.status}</p>
            </div>

            <div style={styles.metricCard}>
              <h4>Runway Estimate</h4>
              <p style={styles.big}>{result.runwayMonths} months</p>
            </div>

            <div style={styles.metricCardWide}>
              <h4>Investor Insight</h4>
              <p>
                This user has a <b>{result.score}% financial readiness score</b> for
                sustaining this career path based on current income and cost structure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
    background: "#0b1220",
    color: "white",
  },

  sidebar: {
    width: "280px",
    padding: "24px",
    background: "#0a0f1c",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },

  logo: {
    fontSize: "22px",
    background: "linear-gradient(90deg,#3b82f6,#8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  tagline: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "10px",
  },

  smallBox: {
    marginTop: "20px",
    padding: "12px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
  },

  smallText: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  smallValue: {
    fontSize: "12px",
    marginTop: "5px",
  },

  main: {
    flex: 1,
    padding: "32px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "6px",
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#0a0f1c",
    color: "white",
  },

  button: {
    padding: "12px 16px",
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    border: "none",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
  },

  metricCard: {
    background: "rgba(255,255,255,0.04)",
    padding: "16px",
    borderRadius: "12px",
  },

  metricCardWide: {
    gridColumn: "span 3",
    background: "rgba(255,255,255,0.04)",
    padding: "16px",
    borderRadius: "12px",
  },

  big: {
    fontSize: "22px",
    marginTop: "8px",
  },
};