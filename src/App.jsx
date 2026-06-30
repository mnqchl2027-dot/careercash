import { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const i = Number(income);
    const e = Number(expenses);
    const s = Number(savings || 0);

    if (!i || !e) return;

    const surplus = i - e;

    const score = Math.max(
      0,
      Math.min(100, Math.round((surplus / i) * 100 + 50))
    );

    let rating = "Moderate Risk";

    if (score >= 75) {
      rating = "Strong";
    } else if (score < 40) {
      rating = "High Risk";
    }

    const cushion =
      surplus < 0
        ? Math.floor(s / Math.abs(surplus))
        : "Unlimited";

    setResult({
      score,
      surplus,
      rating,
      cushion,
    });
  };

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>CareerCash</h1>

        <p style={styles.tagline}>
          Financial readiness insights for career decisions.
        </p>

        <div style={styles.sidebarCard}>
          <h3>About</h3>
          <p>
            CareerCash helps users evaluate whether a career path is
            financially sustainable based on income, expenses, and savings.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.title}>Career Financial Dashboard</h1>

        <p style={styles.subtitle}>
          Understand your financial readiness before committing to a career path.
        </p>

        {/* Inputs */}
        <div style={styles.card}>
          <h2>Input Parameters</h2>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="number"
              placeholder="Monthly Income ($)"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Expenses ($)"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Savings ($)"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={calculate}>
            Generate CareerCash Score
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            <div style={styles.grid}>
              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  CareerCash Score
                </div>

                <div style={styles.metricValue}>
                  {result.score}/100
                </div>

                <div style={styles.metricDescription}>
                  Financial readiness score
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Monthly Surplus / Deficit
                </div>

                <div style={styles.metricValue}>
                  ${result.surplus}
                </div>

                <div style={styles.metricDescription}>
                  Income minus expenses
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Affordability Rating
                </div>

                <div style={styles.metricValue}>
                  {result.rating}
                </div>

                <div style={styles.metricDescription}>
                  Strong / Moderate Risk / High Risk
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Months of Financial Cushion
                </div>

                <div style={styles.metricValue}>
                  {result.cushion}
                </div>

                <div style={styles.metricDescription}>
                  Based on savings entered
                </div>
              </div>
            </div>

            <div style={styles.insightCard}>
              <h2>CareerCash Insight</h2>

              <p>
                Your current financial profile produces a CareerCash
                Score of <strong>{result.score}/100</strong>.
                Your monthly surplus/deficit is{" "}
                <strong>${result.surplus}</strong> and your
                affordability rating is{" "}
                <strong>{result.rating}</strong>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8F2EA",
    fontFamily: "Arial, sans-serif",
    color: "#6B2D3A",
  },

  sidebar: {
    width: "280px",
    background: "#FFF7F7",
    padding: "24px",
    borderRight: "2px solid #F7D7DD",
  },

  logo: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#B03052",
    marginBottom: "12px",
  },

  tagline: {
    color: "#7A5B5B",
    marginBottom: "24px",
  },

  sidebarCard: {
    background: "#FFFDFB",
    padding: "18px",
    borderRadius: "18px",
    border: "2px solid #F6E2C3",
  },

  main: {
    flex: 1,
    padding: "32px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "8px",
    color: "#5A2A2A",
  },

  subtitle: {
    color: "#8A6E6E",
    marginBottom: "24px",
  },

  card: {
    background: "#FFFDFB",
    borderRadius: "24px",
    padding: "24px",
    border: "2px solid #F6E2C3",
    marginBottom: "24px",
  },

  inputRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "16px",
  },

  input: {
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #F7D7DD",
    fontSize: "16px",
  },

  button: {
    marginTop: "20px",
    padding: "14px 24px",
    borderRadius: "14px",
    border: "none",
    background: "#FFD54F",
    color: "#5A3A00",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },

  metricCard: {
    background: "#FFFDFB",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #F6E2C3",
    textAlign: "center",
  },

  metricTitle: {
    fontSize: "18px",
    color: "#A33A5E",
    marginBottom: "10px",
  },

  metricValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#B03052",
  },

  metricDescription: {
    marginTop: "10px",
    color: "#7A6A6A",
    fontSize: "14px",
  },

  insightCard: {
    marginTop: "24px",
    background: "#FFF7F8",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #F7D7DD",
  },
};