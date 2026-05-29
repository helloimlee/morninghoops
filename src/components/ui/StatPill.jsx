import { useTheme } from "../../lib/theme.jsx";

export function StatPill({ value, label, color, compact }) {
  const { t } = useTheme();
  return (
    <div data-stat-card="" style={{ textAlign: "center", background: t.inset, borderRadius: "var(--radius-md)", padding: compact ? 'var(--space-card-gap) var(--space-card-pad)' : "var(--space-card-pad)" }}>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'var(--type-stat-lg)', color: color || t.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: "var(--space-card-gap)" }}>{label}</div>
    </div>
  );
}
