import { useTheme } from "../../lib/theme.jsx";

export default function WeekHeader({ week, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const decided = week.blueWins + week.whiteWins;
  const tallyParts = [];
  
  if (week.blueWins > 0) tallyParts.push({ label: `Blue ${week.blueWins}`, color: t.blue });
  if (week.whiteWins > 0) tallyParts.push({ label: `White ${week.whiteWins}`, color: t.white });

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isCompact ? '8px var(--space-card-pad)' : "8px 16px",
      background: t.inset,
      borderTop: `1px solid ${t.border}`,
      borderBottom: `1px solid ${t.border}`,
      gap: 'var(--space-card-gap)',
    }}>
      <div style={{
        fontSize: 'var(--type-label)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: "uppercase",
        color: t.t3,
        whiteSpace: "nowrap",
      }}>
        Week {week.weekNum} · {week.startDate}–{week.endDate}
      </div>
      {decided > 0 && (
        <div style={{
          display: "flex",
          gap: 'var(--space-card-gap)',
          fontSize: 'var(--type-label)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          {tallyParts.map((tp, j) => (
            <span key={j} style={{ color: tp.color }}>{tp.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
