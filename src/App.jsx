import { useState } from "react";
import InputForm from "./components/InputForm";
import Results from "./components/Results";
import "./styles.css";

export default function App() {
  const [data, setData] = useState(null);

  const calculate = (inputs) => {
    const savings = Number(inputs.savings);
    const income = Number(inputs.income);
    const expenses = Number(inputs.expenses);
    const cost = Number(inputs.cost);
    const months = Number(inputs.months);

    const net = income - expenses;
    const runway = net < 0 ? savings / Math.abs(net) : 999;

    const totalAffordability =
      savings + net * months >= cost;

    let score =
      Math.max(0, Math.min(100,
        (savings / (cost + 1)) * 50 +
        (net > 0 ? 30 : 10) +
        (totalAffordability ? 30 : 0)
      ));

    setData({
      net,
      runway,
      totalAffordability,
      score: score.toFixed(1),
    });
  };

  return (
    <div className="container">
      <h1>CareerCash</h1>
      {!data ? (
        <InputForm onSubmit={calculate} />
      ) : (
        <Results data={data} reset={() => setData(null)} />
      )}
    </div>
  );
}