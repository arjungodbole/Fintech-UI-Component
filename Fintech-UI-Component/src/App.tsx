import { useState } from "react";
import type { StrategyOption } from "./components/StrategyCard/StrategyCardGroup";

import "./app.css";
import StrategyCardGroup from "./components/StrategyCard/StrategyCardGroup";

const OPTIONS: StrategyOption[] = [
  {
    id: "conservative",
    title: "Conservative",
    description: "Lower risk, steady growth; suitable for short horizons.",
    badge: "Most Popular",
  },
  {
    id: "balanced",
    title: "Balanced",
    description: "Moderate risk/return; a blend of stocks and bonds.",
  },
  {
    id: "aggressive",
    title: "Aggressive",
    description: "Higher risk, higher potential returns; long-term focus.",
    disabled: false,
  },
];

function App() {
  const [value, setValue] = useState<string | null>("balanced");

  return (
    <main style={{ padding: "24px", maxWidth: 920, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Choose your strategy</h1>
      <p style={{ marginTop: 0, color: "#475569" }}>
        Use arrow keys to move, and press Enter to select.
      </p>

      <StrategyCardGroup
        options={OPTIONS}
        value={value}
        onChange={(id) => setValue(id)}
        ariaLabel="Investment strategy"
      />

      <div style={{ marginTop: 24 }}>
        <strong>Selected:</strong> {value ?? "None"}
      </div>
    </main>
  );
}

export default App;
