import { useTheme } from "../../lib/theme.jsx";
import { MONTHS } from "../../data/months";
import { SESSIONS } from "../../data/sessions";

export default function MonthPreviewCard({ month, navigate, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const isWide = bp === "wide";

  const monthSessions = SESSIONS.filter(s => s.month === month.label);
  const decided = monthSessions.filter(s => s.winner);
  const bW = decided.filter(s => s.winner === "blue").length;
  const wW = decided.filter(s => s.winner === "white").length;
  const sweeps = decided.filter(s => s.score === "4-0").length;

  return (
    <div 
      onClick={() => navigate("month", { month: month.id })}
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: "var(--space-card-pad)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "transform 0.2s, background 0.2s"
      }}
      data-stat-card=""
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ 
            fontSize: "var(--type-label)", 
            fontWeight: 800, 
            letterSpacing: 1.2, 
            textTransform: "uppercase", 
            color: t.accent 
          }}>
            {month.label}
          </div>
          <div style={{ 
            fontFamily: "'Instrument Serif', serif", 
            fontSize: "var(--type-title)", 
            color: t.text,
            marginTop: 2
          }}>
            {month.name}
          </div>
        </div>
        <div style={{ 
          fontSize: 18,
          color: t.t3,
          opacity: 0.5
        }}>
          →
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 12, 
        fontSize: "var(--type-body-sm)", 
        fontWeight: 600,
        color: t.t2
      }}>
        <span style={{ color: bW >= wW ? t.blue : t.white }}>
          Blue {bW}–{wW} White
        </span>
        <span>·</span>
        <span>{monthSessions.length} sessions</span>
      </div>

      <div style={{ 
        fontSize: "var(--type-body-sm)", 
        color: t.t3, 
        fontStyle: "italic",
        lineHeight: 1.5,
        borderTop: `1px solid ${t.border}`,
        paddingTop: 10
      }}>
        "{month.commentary.substring(0, isCompact ? 60 : 80)}..."
      </div>
    </div>
  );
}

export function MonthPreviewGrid({ navigate, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const isWide = bp === "wide";

  return (
    <section style={{ marginBottom: "var(--space-section)" }}>
      <div style={{ 
        fontSize: "var(--type-label-lg)", 
        fontWeight: 700, 
        letterSpacing: 1.6, 
        textTransform: "uppercase", 
        color: t.t3,
        marginBottom: 16
      }}>
        The Season Timeline
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isCompact ? "1fr" : isWide ? "1fr 1fr 1fr" : "1fr 1fr",
        gap: "var(--space-card-gap)",
        overflowX: isCompact ? "auto" : "visible",
        WebkitOverflowScrolling: "touch",
        paddingBottom: isCompact ? 10 : 0
      }}>
        {MONTHS.map(month => (
          <MonthPreviewCard 
            key={month.id} 
            month={month} 
            navigate={navigate} 
            bp={bp} 
          />
        ))}
      </div>
    </section>
  );
}
