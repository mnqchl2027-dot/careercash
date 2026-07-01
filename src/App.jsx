import { useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [income, setIncome] = useState("");
  const [bonusIncome, setBonusIncome] = useState("");
  const [housingExpenses, setHousingExpenses] = useState("");
  const [foodExpenses, setFoodExpenses] = useState("");
  const [transportExpenses, setTransportExpenses] = useState("");
  const [utilities, setUtilities] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [debt, setDebt] = useState("");
  const [result, setResult] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }
    
    if (!email.includes("@")) {
      setLoginError("Please enter a valid email");
      return;
    }
    
    if (password.length < 6) {
      setLoginError("Password must be at least 6 characters");
      return;
    }
    
    // Simulate login (in production, this would call a backend API)
    localStorage.setItem("user", JSON.stringify({ email, loginTime: new Date() }));
    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setResult(null);
    // Reset all inputs
    setIncome("");
    setBonusIncome("");
    setHousingExpenses("");
    setFoodExpenses("");
    setTransportExpenses("");
    setUtilities("");
    setOtherExpenses("");
    setSavings("");
    setDebt("");
  };

  const calculate = () => {
    const annualIncome = Number(income) || 0;
    const bonus = Number(bonusIncome) || 0;
    const housing = Number(housingExpenses) || 0;
    const food = Number(foodExpenses) || 0;
    const transport = Number(transportExpenses) || 0;
    const utilCost = Number(utilities) || 0;
    const other = Number(otherExpenses) || 0;
    const savingsAmount = Number(savings) || 0;
    const debtAmount = Number(debt) || 0;

    const totalMonthlyExpenses = housing + food + transport + utilCost + other;
    const monthlyIncome = (annualIncome + bonus) / 12;
    const moneyLeft = monthlyIncome - totalMonthlyExpenses;
    const debtToIncomeRatio = debtAmount > 0 ? (debtAmount / monthlyIncome) * 100 : 0;

    let score = 50;

    if (monthlyIncome > 0) {
      const expenseRatio = (totalMonthlyExpenses / monthlyIncome) * 100;
      const baseScore = Math.max(0, Math.min(100, 100 - expenseRatio));
      
      let adjustedScore = baseScore;
      if (debtToIncomeRatio > 50) {
        adjustedScore -= 20;
      } else if (debtToIncomeRatio > 30) {
        adjustedScore -= 10;
      }

      if (savingsAmount > 0 && savingsAmount >= monthlyIncome * 3) {
        adjustedScore += 10;
      }

      score = Math.round(Math.max(0, Math.min(100, adjustedScore)));
    } else if (totalMonthlyExpenses === 0) {
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
    if (totalMonthlyExpenses === 0) {
      duration = "Unlimited";
    } else if (moneyLeft < 0) {
      const monthsOfCoverage = Math.floor(savingsAmount / Math.abs(moneyLeft));
      duration = monthsOfCoverage > 0 ? `${monthsOfCoverage} month(s)` : "< 1 month";
    } else {
      duration = "Unlimited";
    }

    setResult({
      score,
      moneyLeft: moneyLeft.toFixed(0),
      rating,
      duration,
      totalExpenses: totalMonthlyExpenses.toFixed(0),
      debtRatio: debtToIncomeRatio.toFixed(1),
      monthlyIncome: monthlyIncome.toFixed(0),
    });
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginLogo}>CareerCash</h1>
          <p style={styles.loginSubtitle}>Financial readiness for your career</p>
          
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.formGroup}>
              <label style={styles.loginLabel}>Email Address</label>
              <input
                style={styles.loginInput}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.loginLabel}>Password</label>
              <input
                style={styles.loginInput}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div style={styles.errorMessage}>{loginError}</div>
            )}

            <button style={styles.loginButton} type="submit">
              Sign In
            </button>
          </form>

          <p style={styles.loginFooter}>
            Demo: Use any email and password (min 6 chars)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>CareerCash</h1>

        <p style={styles.tagline}>
          Financial readiness insights for career decisions.
        </p>

        <div style={styles.sidebarCard}>
          <h3 style={styles.sidebarCardTitle}>About CareerCash</h3>

          <p style={styles.sidebarCardText}>
            CareerCash helps people understand whether their income, expenses, 
            and savings support their career goals through a comprehensive 
            financial readiness analysis.
          </p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div style={styles.main}>
        <h1 style={styles.title}>
          Career Financial Dashboard
        </h1>

        <p style={styles.subtitle}>
          Understand your financial readiness before committing to a career path.
        </p>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Income</h2>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Income ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 75000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Bonus/Other Income ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={bonusIncome}
                onChange={(e) => setBonusIncome(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Monthly Expenses</h2>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Housing/Rent ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 1500"
                value={housingExpenses}
                onChange={(e) => setHousingExpenses(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Food/Groceries ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 400"
                value={foodExpenses}
                onChange={(e) => setFoodExpenses(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Transportation ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 300"
                value={transportExpenses}
                onChange={(e) => setTransportExpenses(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Utilities ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 150"
                value={utilities}
                onChange={(e) => setUtilities(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Other Expenses ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 300"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Financial Health</h2>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Total Savings ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 15000"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Total Debt ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 8000"
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          style={styles.button}
          onClick={calculate}
        >
          Generate CareerCash Score
        </button>

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
                  Affordability Rating
                </div>

                <div style={styles.metricValue}>
                  {result.rating}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Monthly Income
                </div>

                <div style={styles.metricValue}>
                  ${result.monthlyIncome}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Total Monthly Expenses
                </div>

                <div style={styles.metricValue}>
                  ${result.totalExpenses}
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
                  Debt-to-Income Ratio
                </div>

                <div style={styles.metricValue}>
                  {result.debtRatio}%
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Emergency Fund Duration
                </div>

                <div style={styles.metricValue}>
                  {result.duration}
                </div>
              </div>
            </div>

            <div style={styles.insightCard}>
              <h2 style={styles.cardTitle}>CareerCash Insight</h2>

              <p style={styles.insightText}>
                Your CareerCash Score is <strong>{result.score}/100</strong>, 
                indicating a <strong>{result.rating}</strong> financial position. 
                With a monthly surplus of <strong>${result.moneyLeft}</strong> and a 
                debt-to-income ratio of <strong>{result.debtRatio}%</strong>, you can 
                expect your emergency fund to last <strong>{result.duration}</strong>.
              </p>
            </div>

            <div style={styles.footnoteCard}>
              <h3 style={styles.footnoteTitle}>
                How Your Score Is Calculated
              </h3>

              <p style={styles.footnoteText}>
                The CareerCash Score (0–100) evaluates your financial readiness by analyzing 
                your income, monthly expenses, savings, and debt levels.
              </p>

              <ul style={styles.list}>
                <li>
                  <strong>Strong (75–100):</strong> Low debt, positive monthly cash flow, 
                  emergency savings
                </li>

                <li>
                  <strong>Moderate Risk (40–74):</strong> Manageable expenses, moderate debt, 
                  building savings
                </li>

                <li>
                  <strong>High Risk (Below 40):</strong> High debt-to-income ratio or 
                  negative cash flow
                </li>
              </ul>

              <p style={styles.footnoteText}>
                A strong score indicates you can comfortably support career transitions. 
                Improving your score means growing savings and reducing debt.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  // Login Styles
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F8F2EA 0%, #FFF7F7 100%)",
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
  },

  loginBox: {
    background: "#FFFDFB",
    borderRadius: "16px",
    border: "2px solid #F6E2C3",
    padding: "40px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 40px rgba(107, 45, 58, 0.1)",
  },

  loginLogo: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#B03052",
    margin: "0 0 8px 0",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  },

  loginSubtitle: {
    fontSize: "14px",
    color: "#8A6E6E",
    textAlign: "center",
    marginBottom: "28px",
    fontWeight: "400",
  },

  loginForm: {
    display: "flex",
    flexDirection: "column",
  },

  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },

  loginLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6B3A4A",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.2px",
  },

  loginInput: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "2px solid #F7D7DD",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  },

  loginButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#FFD54F",
    color: "#5A3A00",
    fontWeight: "600",
    letterSpacing: "0.2px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    marginTop: "8px",
    transition: "background 0.2s ease, transform 0.1s ease",
  },

  errorMessage: {
    background: "#FFE5E5",
    border: "2px solid #F7D7DD",
    borderRadius: "8px",
    color: "#B03052",
    padding: "10px 12px",
    fontSize: "12px",
    marginBottom: "12px",
    fontWeight: "500",
  },

  loginFooter: {
    fontSize: "11px",
    color: "#8A6E6E",
    textAlign: "center",
    marginTop: "20px",
    fontWeight: "400",
  },

  // Dashboard Styles
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8F2EA",
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    color: "#6B2D3A",
    fontSize: "13px",
  },

  sidebar: {
    width: "240px",
    background: "#FFF7F7",
    padding: "24px 20px",
    borderRight: "2px solid #F7D7DD",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#B03052",
    margin: "0 0 6px 0",
    fontFamily: "'Inter', sans-serif",
  },

  tagline: {
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.3px",
    color: "#7A5B5B",
    marginBottom: "20px",
    lineHeight: "1.4",
  },

  sidebarCard: {
    background: "#FFFDFB",
    padding: "14px",
    borderRadius: "10px",
    border: "2px solid #F6E2C3",
    marginBottom: "auto",
  },

  sidebarCardTitle: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    color: "#8B3A52",
    margin: "0 0 8px 0",
  },

  sidebarCardText: {
    fontSize: "11px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    color: "#7A5B5B",
    lineHeight: "1.5",
    margin: 0,
  },

  logoutButton: {
    marginTop: "20px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "2px solid #F7D7DD",
    background: "#FFF7F7",
    color: "#B03052",
    fontWeight: "600",
    letterSpacing: "0.2px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    transition: "background 0.2s ease, color 0.2s ease",
  },

  main: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "-0.8px",
    color: "#5A2A2A",
    margin: "0 0 6px 0",
    fontFamily: "'Inter', sans-serif",
  },

  subtitle: {
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "0.3px",
    color: "#8A6E6E",
    marginBottom: "24px",
    lineHeight: "1.5",
  },

  card: {
    background: "#FFFDFB",
    borderRadius: "12px",
    padding: "20px",
    border: "2px solid #F6E2C3",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "-0.2px",
    color: "#5A2A2A",
    margin: "0 0 16px 0",
    fontFamily: "'Inter', sans-serif",
  },

  inputRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "12px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  label: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    color: "#6B3A4A",
    marginBottom: "6px",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "2px solid #F7D7DD",
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  button: {
    marginTop: "6px",
    marginBottom: "28px",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#FFD54F",
    color: "#5A3A00",
    fontWeight: "600",
    letterSpacing: "0.2px",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    transition: "background 0.2s ease, transform 0.1s ease",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },

  metricCard: {
    background: "#FFFDFB",
    borderRadius: "12px",
    padding: "18px",
    border: "2px solid #F6E2C3",
    textAlign: "center",
  },

  metricTitle: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    color: "#A33A5E",
    marginBottom: "10px",
    textTransform: "uppercase",
  },

  metricValue: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.4px",
    color: "#B03052",
    fontFamily: "'Inter', sans-serif",
  },

  insightCard: {
    marginBottom: "20px",
    background: "#FFF7F8",
    borderRadius: "12px",
    padding: "20px",
    border: "2px solid #F7D7DD",
  },

  insightText: {
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    lineHeight: "1.6",
    color: "#6B2D3A",
    margin: 0,
  },

  footnoteCard: {
    background: "#FFFDFB",
    borderRadius: "12px",
    padding: "20px",
    border: "2px solid #F6E2C3",
  },

  footnoteTitle: {
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "-0.2px",
    color: "#5A2A2A",
    margin: "0 0 12px 0",
    fontFamily: "'Inter', sans-serif",
  },

  footnoteText: {
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    lineHeight: "1.6",
    color: "#6B2D3A",
    marginBottom: "12px",
  },

  list: {
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    lineHeight: "1.6",
    color: "#6B2D3A",
    textAlign: "left",
    margin: "12px 0",
    paddingLeft: "20px",
  },
};
