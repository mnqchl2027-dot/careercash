import { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const i = Number(income);
    const c = Number(cost);

    if (!i || !c) {
      setResult(null);
      return;
    }

    const remaining = i - c;
    const score = ((remaining / i) * 100).toFixed(0);

    let status = "Neutral";
    if (score >= 50) status = "Safe";
    else if (score >= 0) status = "Risky";
    else status = "Not Affordable";

    setResult({ remaining, score, status });
  };

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>CareerCash</h2>
        <p style={styles.tagline}>Financial readiness for your career path</p>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.title}>Dashboard</h1>

        {/* Input Card */}
        <div style={styles.card}>
          <h3>Career Inputs</h3>

          <input
            style={styles.input}
            placeholder="Monthly income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Monthly career cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />

          <button style={styles.button} onClick={calculate}>
            Calculate Readiness
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.grid}>
            <div style={styles.metricCard}>
              <h4>Remaining Budget</h4>
              <p>${result.remaining}</p>
            </div>

            <div style={styles.metricCard}>
              <h4>Readiness Score</h4>
              <p>{result.score}%</p>
            </div>

            <div style={styles.metricCard}>
              <h4>Status</h4>
              <p>{result.status}</p>
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
    background: "#0f172a",
    color: "white",
  },
  sidebar: {
    width: "250px",
    background: "#111827",
    padding: "20px",
  },
  logo: {
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    padding: "10px 15px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
  },
  metricCard: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
  },
};