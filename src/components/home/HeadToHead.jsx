import { useTheme } from "../../lib/theme.jsx";

export default function HeadToHead({ stats, bp }) {
  const { t } = useTheme();
  const { decided } = stats;
  const isCompact = bp === "compact";

  const bW = decided.filter(s => s.winner === "blue").length;
  const wW = decided.filter(s => s.winner === "white").length;
  const total = bW + wW;
  const bPct = total > 0 ? Math.round((bW / total) * 100) : 50;
  const wPct = total > 0 ? 100 - bPct : 50;

  const sweeps = decided.filter(s => s.score === "4-0").length;
  const blowouts = decided.filter(s => s.score === "4-1").length;
  const comfortable = decided.filter(s => s.score === "4-2").length;
  const nailbiters = decided.filter(s => s.score === "4-3").length;
  const unknown = decided.filter(s => s.score === "W").length;

  const cardStyle = {
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 14,
    padding: "var(--space-card-pad)",
    marginBottom: "var(--space-section)",
    position: "relative",
    overflow: "hidden"
  };

  const bigNumStyle = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "var(--type-stat-hero)",
    lineHeight: 1
  };

  const distribution = [
    { label: "Sweeps", count: sweeps, color: t.accent, code: "4-0" },
    { label: "Blowouts", count: blowouts, color: t.green, code: "4-1" },
    { label: "Comfortable", count: comfortable, color: t.gold, code: "4-2" },
    { label: "Nail-biters", count: nailbiters, color: t.red, code: "4-3" }
  ];

  if (unknown > 0) {
    distribution.push({ label: "Unknown", count: unknown, color: t.t3, code: "W" });
  }

  return (
    <section style={cardStyle}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-end", 
        marginBottom: 16 
      }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ ...bigNumStyle, color: t.blue }}>{bW}</div>
          <div style={{ fontSize: "var(--type-label)", fontWeight: 700, color: t.t3, textTransform: "uppercase", letterSpacing: 1 }}>Blue Wins</div>
        </div>
        
        {!isCompact && (
          <div style={{ 
            fontFamily: "'Instrument Serif', serif", 
            fontSize: "var(--type-title)", 
            color: t.t3, 
            fontStyle: "italic",
            paddingBottom: 4
          }}>
            vs
          </div>
        )}

        <div style={{ textAlign: "right" }}>
          <div style={{ ...bigNumStyle, color: t.white }}>{wW}</div>
          <div style={{ fontSize: "var(--type-label)", fontWeight: 700, color: t.t3, textTransform: "uppercase", letterSpacing: 1 }}>White Wins</div>
        </div>
      </div>

      <div style={{ 
        height: 8, 
        borderRadius: 4, 
        overflow: "hidden", 
        display: "flex", 
        background: t.inset,
        marginBottom: 24
      }} role="progressbar" aria-label={`Blue ${bPct}%, White ${wPct}%`}>
        <div style={{ width: `${bPct}%`, background: t.blue, transition: "width 0.5s ease-out" }} />
        <div style={{ width: `${wPct}%`, background: t.white, transition: "width 0.5s ease-out" }} />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isCompact ? "1fr 1fr" : `repeat(${distribution.length}, 1fr)`, 
        gap: 12 
      }}>
        {distribution.map(item => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ 
              fontFamily: "'Instrument Serif', serif", 
              fontSize: "var(--type-stat-md)", 
              color: item.color 
            }}>
              {item.count}
            </div>
            <div style={{ 
              fontSize: "var(--type-label)", 
              color: t.t3, 
              fontWeight: 600,
              whiteSpace: "nowrap"
            }}>
              {item.label} ({item.code})
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
