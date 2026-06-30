import { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const annualIncome = Number(income) || 0;
    const monthlyExpenses = Number(expenses) || 0;
    const savingsAmount = Number(savings) || 0;

    const monthlyIncome = annualIncome / 12;
    const moneyLeft = monthlyIncome - monthlyExpenses;

    let score = 50;

    if (monthlyIncome > 0) {
      score = Math.round(
        Math.max(
          0,
          Math.min(
            100,
            ((moneyLeft / monthlyIncome) * 50) + 50
          )
        )
      );
    } else if (monthlyExpenses === 0) {
      score = 100;
    } else if (savingsAmount > 0) {
      score = 25;
    } else {
      score = 0;
    }

    let rating = "Moderate Risk";

    if (score >= 75) {
      rating = "Strong";
    } else if (score < 40) {
      rating = "High Risk";
    }

    let duration;

    if (monthlyExpenses === 0) {
      duration = "Unlimited";
    } else if (moneyLeft < 0) {
      duration = `${Math.floor(
        savingsAmount / Math.abs(moneyLeft)
      )} month(s)`;
    } else {
      duration = "Unlimited";
    }

    setResult({
      score,
      moneyLeft: moneyLeft.toFixed(0),
      rating,
      duration,
    });
  };

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>CareerCash</h1>

        <p style={styles.tagline}>
          Financial readiness insights for career decisions.
        </p>

        <div style={styles.sidebarCard}>
          <h3>About CareerCash</h3>

          <p>
            CareerCash helps people understand whether
            their income, expenses, and savings support
            their career goals.
          </p>
        </div>
      </div>

      <div style={styles.main}>
        <h1 style={styles.title}>
          Career Financial Dashboard
        </h1>

        <p style={styles.subtitle}>
          Understand your financial readiness before
          committing to a career path.
        </p>

        <div style={styles.card}>
          <h2>Input Parameters</h2>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="number"
              min="0"
              placeholder="Annual Income ($)"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              min="0"
              placeholder="Expenses Per Month ($)"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              min="0"
              placeholder="Savings ($)"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
          </div>

          <button
            style={styles.button}
            onClick={calculate}
          >
            Generate CareerCash Score
          </button>
        </div>

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
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Money Left Over Each Month
                </div>

                <div style={styles.metricValue}>
                  ${result.moneyLeft}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Affordability Rating
                </div>

                <div style={styles.metricValue}>
                  {result.rating}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  How Long Money Left Over Might Last
                </div>

                <div style={styles.metricValue}>
                  {result.duration}
                </div>
              </div>
            </div>

            <div style={styles.insightCard}>
              <h2>CareerCash Insight</h2>

              <p>
                Your CareerCash Score is{" "}
                <strong>{result.score}/100</strong>.
                Based on your income, expenses,
                and savings, your affordability
                rating is{" "}
                <strong>{result.rating}</strong>.
              </p>
            </div>

            <div style={styles.footnoteCard}>
              <h3>
                How Affordability Rating Is Calculated
              </h3>

              <p>
                The CareerCash Score ranges from
                0–100 and compares annual income,
                monthly expenses, and available
                savings.
              </p>

              <ul>
                <li>
                  <strong>Strong</strong>:
                  Score 75–100
                </li>

                <li>
                  <strong>Moderate Risk</strong>:
                  Score 40–74
                </li>

                <li>
                  <strong>High Risk</strong>:
                  Score below 40
                </li>
              </ul>

              <p>
                Higher scores generally indicate
                that income covers expenses more
                comfortably. Savings can help
                extend financial stability when
                expenses exceed income.
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
    color: "#5A2A2A",
    marginBottom: "8px",
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
    fontSize: "28px",
    fontWeight: "bold",
    color: "#B03052",
  },

  insightCard: {
    marginTop: "24px",
    background: "#FFF7F8",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #F7D7DD",
  },

  footnoteCard: {
    marginTop: "24px",
    background: "#FFFDFB",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #F6E2C3",
  },
};