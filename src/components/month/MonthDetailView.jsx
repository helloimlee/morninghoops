import { useTheme } from "../../lib/theme.jsx";
import { groupSessionsByWeek } from "../../lib/stats";
import GameRow from "./GameRow";
import WeekHeader from "./WeekHeader";

function getMonthMiniLeaderboard(monthSessions) {
  const players = {};
  monthSessions.forEach(s => {
    if (!s.winner) return;
    s.blue.forEach(p => {
      if (!players[p]) players[p] = { w: 0, l: 0 };
      if (s.winner === "blue") players[p].w++;
      else players[p].l++;
    });
    s.white.forEach(p => {
      if (!players[p]) players[p] = { w: 0, l: 0 };
      if (s.winner === "white") players[p].w++;
      else players[p].l++;
    });
  });

  const sorted = Object.entries(players)
    .filter(([, d]) => d.w + d.l >= 2) // Min 2 games for month leaderboard
    .map(([name, d]) => ({ name, w: d.w, l: d.l, pct: d.w / (d.w + d.l) }))
    .sort((a, b) => b.pct - a.pct || b.w - a.w)
    .slice(0, 5); // top 5
    
  return sorted;
}

export default function MonthDetailView({ month, sessions, bp, navigate }) {
  const { t } = useTheme();
  
  if (!month) return null;

  const monthSessions = sessions.filter(s => s.month === month.label);
  const monthDecided = monthSessions.filter(s => s.winner);
  const monthBW = monthDecided.filter(s => s.winner === "blue").length;
  const monthWW = monthDecided.filter(s => s.winner === "white").length;
  const weeks = groupSessionsByWeek(monthSessions);
  
  const miniLeaderboard = getMonthMiniLeaderboard(monthSessions);

  const L = { fontSize: 'var(--type-label-lg)', fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };
  const S = { fontFamily: "'Instrument Serif',serif" };
  const C = (x = {}) => ({ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 'var(--space-card-pad)', ...x });

  let globalIdx = 0;
  const totalGames = monthSessions.length;

  return (
    <div style={{ animation: "slideIn 0.3s ease-out" }}>
      <button 
        onClick={() => window.history.back()}
        style={{ 
          background: "transparent", 
          border: "none", 
          padding: "8px 0", 
          color: t.accent, 
          fontWeight: 600, 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: "var(--space-section)" }}>
        <div style={L}>{month.label} Recap</div>
        <h2 style={{ ...S, fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>{month.name}</h2>
        <div style={{ fontSize: 'var(--type-body-sm)', fontWeight: 600, color: t.t3, marginTop: 4 }}>Blue {monthBW} – White {monthWW} · {monthDecided.length} decided series</div>
      </div>
      
      {/* Month Leaderboard */}
      {miniLeaderboard.length > 0 && (
        <div style={{ marginBottom: 'var(--space-section)' }}>
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: t.t3, marginBottom: "var(--space-card-gap)" }}>Month Leaders</div>
          <div style={{ 
            display: "flex", 
            gap: "var(--space-card-gap)", 
            overflowX: "auto", 
            paddingBottom: "var(--space-card-gap)", 
            scrollbarWidth: "none", 
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch" 
          }}>
            {miniLeaderboard.map((p, i) => (
              <div key={p.name} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: "var(--radius-md)", padding: "var(--space-card-gap) var(--space-card-pad)", minWidth: 100 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--type-body-sm)' }}>{p.name}</div>
                  <div style={{ ...S, fontSize: 'var(--type-body)', color: p.pct >= 0.6 ? t.green : p.pct >= 0.45 ? t.gold : t.red }}>{Math.round(p.pct * 100)}%</div>
                </div>
                <div style={{ fontSize: 'var(--type-label)', color: t.t2, fontWeight: 600 }}>{p.w}-{p.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
        <div style={{ padding: 'var(--space-card-pad)', borderBottom: `1px solid ${t.border}`, fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.65 }}>{month.commentary}</div>
        {weeks.map((week, wIdx) => (
          <div key={wIdx}>
            <WeekHeader week={week} bp={bp} />
            {week.sessions.map((s) => {
              const idx = globalIdx++;
              return <GameRow key={idx} s={s} i={idx} len={totalGames} bp={bp} />;
            })}
          </div>
        ))}
        <div style={{ padding: 'var(--space-card-pad)', paddingLeft: 18, background: t.inset, borderLeft: `2px solid ${t.accent}`, fontSize: 'var(--type-body-sm)', color: t.t3, lineHeight: 1.65, borderTop: `1px solid ${t.border}` }}><span style={{ color: t.accent, fontWeight: 700 }}>Debrief: </span>{month.insight}</div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
