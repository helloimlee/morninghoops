import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";
import ProgressBar from "../ui/ProgressBar";

export default function PlayerRecordsTable({ players, statsMode, setStatsMode, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const isByGames = statsMode === "games";

  const getW = (d) => isByGames ? d.gw : d.w;
  const getL = (d) => isByGames ? d.gl : d.l;
  const winSorted = Object.entries(players)
    .filter(([, d]) => getW(d) + getL(d) >= 3)
    .sort((a, b) => (getW(b[1]) / (getW(b[1]) + getL(b[1]))) - (getW(a[1]) / (getW(a[1]) + getL(a[1]))));

  return (
    <>
      <SectionDivider />
      <div id="season-records" style={{ scrollMarginTop: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{
            fontSize: 'var(--type-label-lg)', 
            fontWeight: 800, 
            letterSpacing: 1.5, 
            textTransform: "uppercase", 
            color: t.accent
          }}>
            Player {isByGames ? "Game" : "Series"} Records
          </div>
          <div style={{ display: "flex", background: t.inset, borderRadius: 999, padding: 3, border: `1px solid ${t.border}` }}>
            {[{ id: "series", label: "Series" }, { id: "games", label: "Games" }].map(m => (
              <button 
                key={m.id} 
                onClick={() => setStatsMode(m.id)} 
                style={{ 
                  background: statsMode === m.id ? t.card : "transparent", 
                  border: statsMode === m.id ? `1px solid ${t.border}` : "1px solid transparent", 
                  borderRadius: 999, 
                  padding: "5px 12px", 
                  cursor: "pointer", 
                  fontSize: 'var(--type-label)', 
                  fontWeight: statsMode === m.id ? 700 : 500, 
                  color: statsMode === m.id ? t.accent : t.t3, 
                  fontFamily: "'Outfit',sans-serif", 
                  transition: "all .15s, transform 0.1s ease", 
                  whiteSpace: "nowrap", 
                  minHeight: 44,
                  minWidth: 64
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ 
        padding: 0, 
        overflow: "hidden", 
        background: t.card, 
        borderRadius: "var(--radius-lg)", 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)' 
      }}>
        <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.5 }}>
          {isByGames ? "Individual game record within each series. Toggle to Series to see best-of-7 wins." : "Series record. Minimum 3 decided series, because judging someone on two games is tempting but statistically irresponsible."}
        </div>
        {winSorted.map(([name, d], i) => {
          const w = getW(d); 
          const l = getL(d); 
          const dec = w + l; 
          const pct = Math.round(w / dec * 100);
          const barColor = pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red;
          
          if (isCompact) {
            return (
              <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{name}</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-md)', color: barColor }}>{pct}%</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-card-gap)" }}>
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600, minWidth: 44 }}>{w}-{l}</div>
                  <ProgressBar pct={pct} color={barColor} label={`${name} win rate: ${pct}%`} />
                </div>
              </div>
            );
          }
          return (
            <div key={name} style={{ 
              display: "grid", 
              gridTemplateColumns: "minmax(100px, 1.2fr) 80px 3fr 60px", 
              alignItems: "center", 
              padding: "var(--space-card-gap) var(--space-card-pad)", 
              borderBottom: i < winSorted.length - 1 ? `1px solid ${t.border}` : "none", 
              gap: "var(--space-card-gap)" 
            }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</div>
              <div style={{ fontSize: 'var(--type-body)', color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
              <ProgressBar pct={pct} color={barColor} label={`${name} win rate: ${pct}%`} />
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-md)', color: barColor, textAlign: "right" }}>{pct}%</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
