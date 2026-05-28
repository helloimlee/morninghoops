import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";

export default function AttendanceTable({ players, totalS, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const sorted = Object.entries(players).sort((a, b) => b[1].g - a[1].g);

  return (
    <>
      <SectionDivider />
      <div id="season-attendance" style={{
        fontSize: 'var(--type-label-lg)', 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: 16, 
        scrollMarginTop: 64
      }}>
        Attendance
      </div>
      <div style={{ 
        padding: 0, 
        overflow: "hidden", 
        background: t.card, 
        borderRadius: 14, 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)' 
      }}>
        {isCompact ? (
          /* Compact: card list sorted by sessions descending */
          sorted.map(([name, d], i, arr) => {
            const rate = Math.round(d.g / totalS * 100);
            const dec = d.w + d.l;
            const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
            const tier = rate >= 90 ? ["IRON", t.accent] : rate >= 70 ? ["REG", t.green] : rate >= 40 ? ["PT", t.blue] : rate >= 15 ? ["DROP", t.gold] : ["1x", t.t3];
            return (
              <div key={name} style={{ padding: '12px var(--space-card-pad)', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 'var(--space-card-gap)' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{name}</span>
                    <span style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1] }}>{tier[0]}</span>
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-md)', color: tier[1] }}>{rate}%</div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 'var(--type-body-sm)', color: t.t2 }}>
                  <span>{d.g}/{totalS} games</span>
                  <span style={{ color: t.blue }}>{d.bt}B</span>
                  <span style={{ color: t.white }}>{d.wt}W</span>
                  {dec > 0 && <span style={{ marginLeft: "auto", fontWeight: 600 }}>{d.w}-{d.l} ({wpct}%)</span>}
                </div>
              </div>
            );
          })
        ) : (
          /* Regular/Wide: table */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 'var(--type-body-sm)' }}>
              <thead>
                <tr style={{ background: t.inset, borderBottom: `1px solid ${t.border}` }}>
                  {["Player", "Games", "Rate", "Blue", "White", "W-L", "Win%"].map(h => (
                    <th key={h} style={{ 
                      padding: "10px 8px", 
                      fontSize: 'var(--type-label)', 
                      fontWeight: 700, 
                      letterSpacing: 1, 
                      color: t.t3, 
                      textAlign: h === "Player" ? "left" : "center", 
                      ...(h === "Player" ? { paddingLeft: 16, minWidth: 80 } : {}) 
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(([name, d]) => {
                  const rate = Math.round(d.g / totalS * 100);
                  const dec = d.w + d.l;
                  const wpct = dec > 0 ? Math.round(d.w / dec * 100) : null;
                  const tier = rate >= 90 ? ["IRON", t.accent] : rate >= 70 ? ["REG", t.green] : rate >= 40 ? ["PT", t.blue] : rate >= 15 ? ["DROP", t.gold] : ["1x", t.t3];
                  return (
                    <tr key={name} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: "9px 16px", fontWeight: 600, fontSize: 'var(--type-body)' }}>
                        {name}
                        <span style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: `${tier[1]}18`, color: tier[1], marginLeft: 8 }}>{tier[0]}</span>
                      </td>
                      <td style={{ textAlign: "center", color: t.t2 }}>{d.g}/{totalS}</td>
                      <td style={{ textAlign: "center", fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-md)', color: tier[1] }}>{rate}%</td>
                      <td style={{ textAlign: "center", color: t.blue, fontWeight: 600 }}>{d.bt}</td>
                      <td style={{ textAlign: "center", color: t.white, fontWeight: 600 }}>{d.wt}</td>
                      <td style={{ textAlign: "center", fontSize: 'var(--type-body-sm)', fontWeight: 600, color: dec > 0 ? t.t2 : t.t3 }}>{dec > 0 ? `${d.w}-${d.l}` : "\u2014"}</td>
                      <td style={{ textAlign: "center", fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-body)', color: wpct !== null ? (wpct >= 60 ? t.green : wpct >= 45 ? t.gold : t.red) : t.t3 }}>{wpct !== null ? `${wpct}%` : "\u2014"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
