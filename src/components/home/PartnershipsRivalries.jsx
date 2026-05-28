import { useTheme } from "../../lib/theme.jsx";

export default function PartnershipsRivalries({ stats, bp }) {
  const { t } = useTheme();
  const { bestPairs, worstPairs, topRivals } = stats;
  const isCompact = bp === "compact";

  const sectionHeaderStyle = {
    fontSize: "var(--type-label)",
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: t.t3,
    marginBottom: 12,
    marginTop: 24
  };

  const cardStyle = {
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 14,
    overflow: "hidden"
  };

  const rowStyle = {
    padding: "10px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${t.border}`
  };

  return (
    <section style={{ marginBottom: "var(--space-section)" }}>
      <div style={sectionHeaderStyle}>Best Partnerships</div>
      <div style={cardStyle}>
        {bestPairs.slice(0, 3).map((pair, i) => (
          <div key={i} style={{ ...rowStyle, borderBottom: i === 2 ? "none" : rowStyle.borderBottom }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
               <span style={{ fontFamily: "'Instrument Serif', serif", color: t.green, fontSize: 18 }}>{i + 1}</span>
               <span style={{ fontWeight: 600, fontSize: "var(--type-body)" }}>{pair.a} + {pair.b}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", color: t.green, fontSize: 18 }}>{Math.round(pair.pct * 100)}%</div>
              <div style={{ fontSize: "var(--type-label)", color: t.t3, fontWeight: 600 }}>{pair.w}-{pair.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={sectionHeaderStyle}>Top Rivalries</div>
      <div style={cardStyle}>
        {topRivals.slice(0, 3).map((r, i) => (
          <div key={i} style={{ ...rowStyle, borderBottom: i === 2 ? "none" : rowStyle.borderBottom }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
               <span style={{ fontFamily: "'Instrument Serif', serif", color: t.accent, fontSize: 18 }}>{i + 1}</span>
               <span style={{ fontWeight: 600, fontSize: "var(--type-body)" }}>{r.pair[0]} vs {r.pair[1]}</span>
            </div>
            <div style={{ 
              fontFamily: "'Instrument Serif', serif", 
              color: t.accent, 
              fontSize: 18 
            }}>
              {r.count}x
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
