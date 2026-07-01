import { useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [income, setIncome] = useState("");
  const [bonusIncome, setBonusIncome] = useState("");
  const [housingExpenses, setHousingExpenses] = useState("");
  const [foodExpenses, setFoodExpenses] = useState("");
  const [transportExpenses, setTransportExpenses] = useState("");
  const [utilities, setUtilities] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [scholarships, setScholarships] = useState("");
  const [gifts, setGifts] = useState("");
  const [debt, setDebt] = useState("");
  const [tuitionCost, setTuitionCost] = useState("");
  const [result, setResult] = useState(null);

  const handleSignUp = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!fullName || !email || !password || !confirmPassword) {
      setAuthError("Please fill in all fields");
      return;
    }
    
    if (!email.includes("@")) {
      setAuthError("Please enter a valid email");
      return;
    }
    
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.find(u => u.email === email)) {
      setAuthError("An account with this email already exists");
      return;
    }
    
    // Create new account
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password, // Note: In production, never store plain passwords - use bcrypt/hashing
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    setAuthSuccess("Account created successfully! Please log in.");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    
    setTimeout(() => {
      setIsSignUp(false);
      setAuthSuccess("");
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!email || !password) {
      setAuthError("Please fill in all fields");
      return;
    }
    
    if (!email.includes("@")) {
      setAuthError("Please enter a valid email");
      return;
    }
    
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }
    
    // Check credentials against stored users
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = existingUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setAuthError("Invalid email or password");
      return;
    }
    
    // Successful login
    localStorage.setItem("currentUser", JSON.stringify({ 
      id: user.id,
      fullName: user.fullName,
      email: user.email, 
      loginTime: new Date() 
    }));
    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setResult(null);
    setSidebarOpen(false);
    // Reset all inputs
    setIncome("");
    setBonusIncome("");
    setHousingExpenses("");
    setFoodExpenses("");
    setTransportExpenses("");
    setUtilities("");
    setOtherExpenses("");
    setSavings("");
    setScholarships("");
    setGifts("");
    setDebt("");
    setTuitionCost("");
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
    const scholarshipsAmount = Number(scholarships) || 0;
    const giftsAmount = Number(gifts) || 0;
    const debtAmount = Number(debt) || 0;
    const annualTuition = Number(tuitionCost) || 0;

    // Convert annual tuition to monthly
    const monthlyTuition = annualTuition / 12;

    // Calculate total educational resources (annual savings + scholarships + gifts should cover annual tuition)
    const totalEducationalResources = savingsAmount + scholarshipsAmount + giftsAmount;
    const educationalCoverage = totalEducationalResources >= annualTuition;

    const totalMonthlyExpenses = housing + food + transport + utilCost + other + monthlyTuition;
    const monthlyIncome = (annualIncome + bonus) / 12;
    const moneyLeft = monthlyIncome - totalMonthlyExpenses;
    const debtToIncomeRatio = debtAmount > 0 ? (debtAmount / monthlyIncome) * 100 : 0;

    let score = 50;

    if (monthlyIncome > 0) {
      const expenseRatio = (totalMonthlyExpenses / monthlyIncome) * 100;
      const baseScore = Math.max(0, Math.min(100, 100 - expenseRatio));
      
      let adjustedScore = baseScore;
      
      // Penalty for high debt-to-income ratio
      if (debtToIncomeRatio > 50) {
        adjustedScore -= 20;
      } else if (debtToIncomeRatio > 30) {
        adjustedScore -= 10;
      }

      // Penalty if educational costs are not covered
      if (!educationalCoverage) {
        adjustedScore -= 15;
      }

      // Bonus for adequate savings
      if (savingsAmount > 0 && savingsAmount >= monthlyIncome * 3) {
        adjustedScore += 10;
      }

      // Bonus for scholarships and gifts
      if ((scholarshipsAmount + giftsAmount) > 0) {
        adjustedScore += 5;
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
      monthlyTuition: monthlyTuition.toFixed(0),
      educationalResources: totalEducationalResources.toFixed(0),
      annualTuition: annualTuition.toFixed(0),
      educationalCoverage: educationalCoverage
    });
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginLogo}>CareerCash</h1>
          <p style={styles.loginSubtitle}>Financial readiness for your career</p>
          
          {isSignUp ? (
            // Sign Up Form
            <form onSubmit={handleSignUp} style={styles.loginForm}>
              <div style={styles.formGroup}>
                <label style={styles.loginLabel}>Full Name</label>
                <input
                  style={styles.loginInput}
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

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

              <div style={styles.formGroup}>
                <label style={styles.loginLabel}>Confirm Password</label>
                <input
                  style={styles.loginInput}
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {authError && (
                <div style={styles.errorMessage}>{authError}</div>
              )}

              {authSuccess && (
                <div style={styles.successMessage}>{authSuccess}</div>
              )}

              <button style={styles.loginButton} type="submit">
                Create Account
              </button>

              <button
                style={styles.toggleButton}
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setAuthError("");
                  setAuthSuccess("");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                Already have an account? Sign In
              </button>
            </form>
          ) : (
            // Sign In Form
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

              {authError && (
                <div style={styles.errorMessage}>{authError}</div>
              )}

              {authSuccess && (
                <div style={styles.successMessage}>{authSuccess}</div>
              )}

              <button style={styles.loginButton} type="submit">
                Sign In
              </button>

              <button
                style={styles.toggleButton}
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setAuthError("");
                  setAuthSuccess("");
                  setEmail("");
                  setPassword("");
                }}
              >
                Don't have an account? Create one
              </button>
            </form>
          )}

          <p style={styles.loginFooter}>
            {isSignUp ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <div style={styles.app}>
      {/* Mobile Header */}
      <div style={styles.mobileHeader}>
        <button 
          style={styles.menuButton} 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1 style={styles.mobileHeaderLogo}>CareerCash</h1>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{...styles.sidebar, ...(sidebarOpen ? styles.sidebarOpen : {})}}>
        <h1 style={styles.logo}>CareerCash</h1>

        <p style={styles.tagline}>
          Financial readiness insights for career decisions.
        </p>

        <div style={styles.sidebarCard}>
          <h3 style={styles.sidebarCardTitle}>Welcome</h3>

          <p style={styles.sidebarCardText}>
            Hello, <strong>{currentUser.fullName}</strong>! CareerCash helps you understand whether your income, expenses, 
            and savings support your career goals.
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
          <h2 style={styles.cardTitle}>Education Costs & Support</h2>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Tuition Cost ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 25000"
                value={tuitionCost}
                onChange={(e) => setTuitionCost(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Scholarships ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 10000"
                value={scholarships}
                onChange={(e) => setScholarships(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Gifts/Grants ($)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={gifts}
                onChange={(e) => setGifts(e.target.value)}
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
                  Monthly Tuition
                </div>

                <div style={styles.metricValue}>
                  ${result.monthlyTuition}
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

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Education Coverage
                </div>

                <div style={{
                  ...styles.metricValue,
                  color: result.educationalCoverage ? "#2D7A2D" : "#B03052"
                }}>
                  {result.educationalCoverage ? "✓ Covered" : "✗ Shortfall"}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Annual Tuition
                </div>

                <div style={styles.metricValue}>
                  ${result.annualTuition}
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricTitle}>
                  Educational Resources
                </div>

                <div style={styles.metricValue}>
                  ${result.educationalResources}
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

              <p style={styles.insightText}>
                {result.educationalCoverage ? (
                  <>
                    <strong style={{ color: "#2D7A2D" }}>✓ Educational costs are covered:</strong> Your annual tuition of <strong>${result.annualTuition}</strong> is fully supported by your savings, scholarships, and gifts totaling <strong>${result.educationalResources}</strong>.
                  </>
                ) : (
                  <>
                    <strong style={{ color: "#B03052" }}>✗ Educational costs shortfall:</strong> Your annual tuition of <strong>${result.annualTuition}</strong> exceeds your available education support (<strong>${result.educationalResources}</strong>) by <strong>${(result.annualTuition - result.educationalResources).toLocaleString()}</strong>.
                  </>
                )}
              </p>
            </div>

            <div style={styles.footnoteCard}>
              <h3 style={styles.footnoteTitle}>
                How Your Score Is Calculated
              </h3>

              <p style={styles.footnoteText}>
                The CareerCash Score (0–100) evaluates your financial readiness by analyzing 
                your income, monthly expenses (including tuition), savings, scholarships, gifts, and debt levels.
              </p>

              <ul style={styles.list}>
                <li>
                  <strong>Strong (75–100):</strong> Low debt, positive monthly cash flow, 
                  emergency savings, and educational costs covered
                </li>

                <li>
                  <strong>Moderate Risk (40–74):</strong> Manageable expenses, moderate debt, 
                  building savings
                </li>

                <li>
                  <strong>High Risk (Below 40):</strong> High debt-to-income ratio, 
                  negative cash flow, or insufficient educational funding
                </li>
              </ul>

              <p style={styles.footnoteText}>
                A strong score indicates you can comfortably support career transitions. 
                Improving your score means growing savings, reducing debt, and ensuring 
                educational costs are adequately covered through scholarships, gifts, and savings.
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
    padding: "16px",
  },

  loginBox: {
    background: "#FFFDFB",
    borderRadius: "16px",
    border: "2px solid #F6E2C3",
    padding: "40px 24px",
    width: "100%",
    maxWidth: "400px",
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
    marginBottom: "18px",
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

  toggleButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "2px solid #F7D7DD",
    background: "transparent",
    color: "#B03052",
    fontWeight: "600",
    letterSpacing: "0.2px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    marginTop: "12px",
    transition: "background 0.2s ease, color 0.2s ease",
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

  successMessage: {
    background: "#E5F7E5",
    border: "2px solid #C3E6C3",
    borderRadius: "8px",
    color: "#2D7A2D",
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

  mobileHeader: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "56px",
    background: "#FFF7F7",
    borderBottom: "2px solid #F7D7DD",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 100,
    "@media (maxWidth: 768px)": {
      display: "flex",
    },
  },

  menuButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#B03052",
    cursor: "pointer",
    padding: "8px",
    fontWeight: "bold",
  },

  mobileHeaderLogo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#B03052",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },

  sidebarOverlay: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 90,
    "@media (maxWidth: 768px)": {
      display: "block",
    },
  },

  sidebar: {
    width: "240px",
    background: "#FFF7F7",
    padding: "24px 20px",
    borderRight: "2px solid #F7D7DD",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    "@media (maxWidth: 768px)": {
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      zIndex: 95,
      transform: "translateX(-100%)",
      transition: "transform 0.3s ease",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
    },
  },

  sidebarOpen: {
    "@media (maxWidth: 768px)": {
      transform: "translateX(0)",
    },
  },

  logo: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#B03052",
    margin: "0 0 6px 0",
    fontFamily: "'Inter', sans-serif",
    "@media (maxWidth: 768px)": {
      fontSize: "24px",
      marginTop: "16px",
    },
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
    "@media (maxWidth: 768px)": {
      padding: "80px 16px 32px 16px",
    },
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "-0.8px",
    color: "#5A2A2A",
    margin: "0 0 6px 0",
    fontFamily: "'Inter', sans-serif",
    "@media (maxWidth: 768px)": {
      fontSize: "28px",
      letterSpacing: "-0.5px",
    },
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
    "@media (maxWidth: 768px)": {
      padding: "16px",
    },
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "-0.2px",
    color: "#5A2A2A",
    margin: "0 0 16px 0",
    fontFamily: "'Inter', sans-serif",
    "@media (maxWidth: 768px)": {
      fontSize: "14px",
    },
  },

  inputRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "12px",
    "@media (maxWidth: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "12px",
    },
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
    width: "100%",
    "@media (maxWidth: 768px)": {
      marginBottom: "24px",
    },
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
    "@media (maxWidth: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "12px",
    },
  },

  metricCard: {
    background: "#FFFDFB",
    borderRadius: "12px",
    padding: "18px",
    border: "2px solid #F6E2C3",
    textAlign: "center",
    "@media (maxWidth: 768px)": {
      padding: "14px",
    },
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
    "@media (maxWidth: 768px)": {
      fontSize: "18px",
    },
  },

  insightCard: {
    marginBottom: "20px",
    background: "#FFF7F8",
    borderRadius: "12px",
    padding: "20px",
    border: "2px solid #F7D7DD",
    "@media (maxWidth: 768px)": {
      padding: "16px",
    },
  },

  insightText: {
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    lineHeight: "1.6",
    color: "#6B2D3A",
    margin: "0 0 12px 0",
  },

  footnoteCard: {
    background: "#FFFDFB",
    borderRadius: "12px",
    padding: "20px",
    border: "2px solid #F6E2C3",
    "@media (maxWidth: 768px)": {
      padding: "16px",
    },
  },

  footnoteTitle: {
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "-0.2px",
    color: "#5A2A2A",
    margin: "0 0 12px 0",
    fontFamily: "'Inter', sans-serif",
    "@media (maxWidth: 768px)": {
      fontSize: "12px",
    },
  },

  footnoteText: {
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.2px",
    lineHeight: "1.6",
    color: "#6B2D3A",
    marginBottom: "12px",
    "@media (maxWidth: 768px)": {
      fontSize: "11px",
    },
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
    "@media (maxWidth: 768px)": {
      fontSize: "11px",
      paddingLeft: "16px",
    },
  },
};
