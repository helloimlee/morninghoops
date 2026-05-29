import { useTheme } from "../../lib/theme.jsx";
import { MONTHS } from "../../data/months";
import { SESSIONS } from "../../data/sessions";
import { ArrowRight } from "lucide-react";

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
      className="interactive-card"
      role="button"
      tabIndex={0}
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-card-pad)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-card-gap)",
        transition: "transform 0.2s, background 0.2s",
        minHeight: 120
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
          color: t.t3,
          opacity: 0.5,
          display: "flex",
          alignItems: "center"
        }}>
          <ArrowRight size={20} strokeWidth={2} />
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "var(--space-card-gap)", 
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
        paddingTop: "var(--space-card-gap)"
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
        marginBottom: "var(--space-card-pad)"
      }}>
        The Season Timeline
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isCompact ? "1fr" : isWide ? "1fr 1fr 1fr" : "1fr 1fr",
        gap: "var(--space-card-gap)",
        overflowX: isCompact ? "auto" : "visible",
        overscrollBehaviorX: "contain",
        WebkitOverflowScrolling: "touch",
        paddingBottom: isCompact ? "var(--space-card-gap)" : 0
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
