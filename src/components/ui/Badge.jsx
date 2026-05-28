export default function Badge({ winner, score, dark }) {
  if (!winner) return <span style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)", color: dark ? "#71717A" : "#6B7280" }}>No result</span>;
  const b = winner === "blue";
  return <span style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: b ? (dark ? "rgba(91,141,239,.15)" : "rgba(59,107,245,.08)") : (dark ? "rgba(180,188,208,.1)" : "rgba(100,116,139,.08)"), color: b ? (dark ? "#5B8DEF" : "#3B6BF5") : (dark ? "#B4BCD0" : "#64748B") }}>{b ? "Blue" : "White"} {score || "W"}</span>;
}
