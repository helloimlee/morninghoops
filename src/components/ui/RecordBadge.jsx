import { useTheme } from "../../lib/theme.jsx";

export function RecordBadge({ w, l, pct }) {
  const { t } = useTheme();
  
  let color = t.t3;
  if (pct !== null && pct !== undefined) {
    color = pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red;
  }
  
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 64 }}>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'var(--type-title)', color: color, lineHeight: 1 }}>{w}-{l}</div>
      {pct !== null && pct !== undefined && (
        <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 2 }}>{pct}%</div>
      )}
    </div>
  );
}
