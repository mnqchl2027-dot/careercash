import { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const i = Number(income);
    const c = Number(cost);

    if (!i || !c) {
      setResult("Enter valid numbers");
      return;
    }

    const remaining = i - c;
    const percent = ((remaining / i) * 100).toFixed(1);

    setResult(`You have $${remaining} left (${percent}% remaining)`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>CareerCash</h1>

      <input
        placeholder="Monthly income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Career cost / expenses"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />

      <br /><br />

      <button onClick={calculate}>Calculate</button>

      <h2>{result}</h2>
    </div>
  );
}