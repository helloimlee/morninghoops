import { useTheme } from "../../lib/theme.jsx";
import { StatPill } from "../ui/StatPill";

export default function QuickStats({ stats, bp }) {
  const { t } = useTheme();
  const { decided, avgPerSession } = stats;
  const isCompact = bp === "compact";
  const isWide = bp === "wide";

  const bW = decided.filter(s => s.winner === "blue").length;
  const wW = decided.filter(s => s.winner === "white").length;
  const sweeps = decided.filter(s => s.score === "4-0").length;

  const data = [
    { value: bW, label: "Blue Wins", color: t.blue },
    { value: wW, label: "White Wins", color: t.white },
    { value: sweeps, label: "Sweeps", color: t.accent },
    { value: avgPerSession, label: "Avg/Session", color: t.green }
  ];

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", 
      gap: "var(--space-card-gap)",
      marginBottom: "var(--space-section)"
    }}>
      {data.map((item, i) => (
        <StatPill 
          key={i}
          value={item.value}
          label={item.label}
          color={item.color}
          compact={isCompact}
        />
      ))}
    </div>
  );
}
