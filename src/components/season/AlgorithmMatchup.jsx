import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";

export default function AlgorithmMatchup({ players, bp }) {
  const { t, dark } = useTheme();
  const isCompact = bp === "compact";

  const candidates = Object.entries(players)
    .filter(([, d]) => d.w + d.l >= 5)
    .map(([n, d]) => ({ name: n, wpct: d.w / (d.w + d.l), games: d.g }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 8);

  if (candidates.length < 8) return null;

  const sorted2 = [...candidates].sort((a, b) => b.wpct - a.wpct);
  const teamA = [], teamB = [];
  let sumA = 0, sumB = 0;
  
  sorted2.forEach(p => {
    if (sumA <= sumB) { teamA.push(p); sumA += p.wpct; }
    else { teamB.push(p); sumB += p.wpct; }
  });
  
  const predA = (sumA / teamA.length * 100).toFixed(0);
  const predB = (sumB / teamB.length * 100).toFixed(0);
  const diff = Math.abs(parseFloat(predA) - parseFloat(predB)).toFixed(0);

  const renderTeamPanel = (team, label, color, pred) => (
    <div style={{ padding: 'var(--space-card-pad)', background: t.inset, borderRadius: 10 }}>
      <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color, marginBottom: 8 }}>{label} · AVG {pred}%</div>
      {team.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 'var(--type-body)' }}>
          <span style={{ fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: t.t3, fontSize: 'var(--type-body-sm)' }}>{Math.round(p.wpct * 100)}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SectionDivider />
      <div id="season-algorithm" style={{
        fontSize: 'var(--type-label-lg)', 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: 16, 
        scrollMarginTop: 64
      }}>
        The Algorithm{"'"}s Matchup
      </div>
      <div style={{ 
        padding: 'var(--space-card-pad)', 
        background: t.card, 
        borderRadius: 14, 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)', 
        borderColor: dark ? "rgba(52,211,153,.2)" : "rgba(22,163,74,.15)", 
        backgroundColor: dark ? "rgba(52,211,153,.03)" : "rgba(22,163,74,.02)" 
      }}>
        <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>
          <strong style={{ color: t.green }}>Computed from actual data.</strong> Top 8 players by games played, sorted by win percentage, greedy-balanced to minimize predicted differential. No vibes, no feelings, just math at 4:45 AM.
        </div>
        {isCompact ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {renderTeamPanel(teamA, "TEAM A", t.accent, predA)}
            <div style={{ textAlign: "center", fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", padding: "4px 0" }}>vs</div>
            {renderTeamPanel(teamB, "TEAM B", t.blue, predB)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {renderTeamPanel(teamA, "TEAM A", t.accent, predA)}
            {renderTeamPanel(teamB, "TEAM B", t.blue, predB)}
          </div>
        )}
        <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.55, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.border}`, fontStyle: "italic" }}>
          Predicted differential: {diff} percentage points. Closer to zero = closer to fair. Someone on this list is a ceiling. Someone else is an anchor. The spreadsheet knows. The spreadsheet always knows.
        </div>
      </div>
    </>
  );
}
