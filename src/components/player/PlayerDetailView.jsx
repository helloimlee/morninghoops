import { useTheme } from "../../lib/theme.jsx";
import { CORRELATIONS } from "../../data/players";
import PlayerProfile from "./PlayerProfile";
import PlayerRoast from "./PlayerRoast";

export default function PlayerDetailView({ playerName, stats, sessions, bp, navigate }) {
  const { t } = useTheme();

  if (!playerName || !stats.p[playerName]) return null;

  const playerStats = stats.p[playerName];
  const profile = CORRELATIONS.find(c => c.name === playerName);
  const teammateReport = stats.teammateReport[playerName] || { best: null, worst: null, all: [] };

  const dec = playerStats.w + playerStats.l;
  const record = dec > 0 ? `${playerStats.w}-${playerStats.l}` : "\u2014";
  const pct = dec > 0 ? Math.round(playerStats.w / dec * 100) : null;

  // Recent results (last 5 sessions player appeared in)
  const recentSessions = sessions.filter(s => s.blue.includes(playerName) || s.white.includes(playerName)).slice(-5).reverse();

  const L = { fontSize: 'var(--type-label-lg)', fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: t.t3, marginBottom: 14 };
  const C = (x = {}) => ({ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 'var(--space-card-pad)', ...x });
  const S = { fontFamily: "'Instrument Serif',serif" };

  return (
    <div style={{ animation: "slideUp 0.3s ease-out" }}>
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

      <div style={{ marginBottom: 'var(--space-section)' }}>
        <PlayerProfile 
          name={playerName} 
          tag={profile?.tag} 
          desc={profile?.desc} 
          record={record} 
          pct={pct} 
          bp={bp} 
        />
        <PlayerRoast roast={profile?.roast} />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 'var(--space-card-gap)', marginBottom: 'var(--space-section)' }}>
        <div data-stat-card="" style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: 12 }}>
          <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: t.blue, lineHeight: 1 }}>{playerStats.bt}</div>
          <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>Blue Games</div>
        </div>
        <div data-stat-card="" style={{ textAlign: "center", background: t.inset, borderRadius: 8, padding: 12 }}>
          <div style={{ ...S, fontSize: 'var(--type-stat-lg)', color: t.white, lineHeight: 1 }}>{playerStats.wt}</div>
          <div style={{ fontSize: 'var(--type-label)', color: t.t3, fontWeight: 600, marginTop: 3 }}>White Games</div>
        </div>
      </div>

      <div style={L}>Teammate Report</div>
      <div style={{ ...C(), marginBottom: 'var(--space-section)' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, color: t.green, marginBottom: 4 }}>BEST TEAMMATE</div>
          {teammateReport.best ? (
            <div style={{ fontSize: 'var(--type-body)', color: t.t2 }}>
              <strong style={{ color: t.text }}>{teammateReport.best.partner}</strong> ({teammateReport.best.w}-{teammateReport.best.l} together, {Math.round(teammateReport.best.pct * 100)}%)
            </div>
          ) : (
            <div style={{ fontSize: 'var(--type-body)', color: t.t3, fontStyle: "italic" }}>Not enough data</div>
          )}
        </div>
        
        <div>
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1, color: t.red, marginBottom: 4 }}>WORST TEAMMATE</div>
          {teammateReport.worst ? (
            <div style={{ fontSize: 'var(--type-body)', color: t.t2 }}>
              <strong style={{ color: t.text }}>{teammateReport.worst.partner}</strong> ({teammateReport.worst.w}-{teammateReport.worst.l} together, {Math.round(teammateReport.worst.pct * 100)}%)
            </div>
          ) : (
            <div style={{ fontSize: 'var(--type-body)', color: t.t3, fontStyle: "italic" }}>Not enough data</div>
          )}
        </div>
      </div>

      <div style={L}>Recent Results</div>
      <div style={{ ...C({ padding: 0, overflow: "hidden" }), marginBottom: 'var(--space-section)' }}>
        {recentSessions.length > 0 ? (
          recentSessions.map((s, i) => {
            const isBlue = s.blue.includes(playerName);
            const teamStr = isBlue ? "Blue" : "White";
            const teamColor = isBlue ? t.blue : t.white;
            let result = "—";
            let resColor = t.t3;
            if (s.winner) {
              const won = s.winner === (isBlue ? "blue" : "white");
              result = won ? "W" : "L";
              resColor = won ? t.green : t.red;
            }
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: '12px var(--space-card-pad)', borderBottom: i < recentSessions.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--type-body)' }}>{s.day}</div>
                  <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3 }}>Played on <span style={{ color: teamColor, fontWeight: 500 }}>{teamStr}</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {s.winner && <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, fontWeight: 600 }}>{s.score}</div>}
                  <div style={{ ...S, fontSize: 'var(--type-stat-md)', color: resColor }}>{result}</div>
                </div>
              </div>
            );
          })
        ) : (
           <div style={{ padding: 'var(--space-card-pad)', color: t.t3, fontStyle: "italic", fontSize: 'var(--type-body-sm)' }}>No recent sessions.</div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
