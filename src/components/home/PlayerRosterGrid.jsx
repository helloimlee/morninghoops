import { useTheme } from "../../lib/theme.jsx";
import { PlayerAvatar } from "../ui/PlayerAvatar";
import { RecordBadge } from "../ui/RecordBadge";
import { CORRELATIONS } from "../../data/players";

export default function PlayerRosterGrid({ stats, bp, navigate }) {
  const { t } = useTheme();
  const { p: playerStats } = stats;
  const isCompact = bp === "compact";
  const isWide = bp === "wide";

  // Sort players by win rate (series)
  const sortedPlayers = [...CORRELATIONS].sort((a, b) => {
    const statA = playerStats[a.name];
    const statB = playerStats[b.name];
    if (!statA || !statB) return 0;
    const totalA = statA.w + statA.l;
    const totalB = statB.w + statB.l;
    const pctA = totalA > 0 ? statA.w / totalA : 0;
    const pctB = totalB > 0 ? statB.w / totalB : 0;
    return pctB - pctA;
  });

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
        Player Roster
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isCompact ? "1fr 1fr" : isWide ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr",
        gap: "var(--space-card-gap)"
      }}>
        {sortedPlayers.map(player => {
          const stats = playerStats[player.name];
          if (!stats) return null;
          const dec = stats.w + stats.l;
          const pct = dec > 0 ? Math.round((stats.w / dec) * 100) : 0;

          return (
            <div 
              key={player.name}
              onClick={() => navigate("player", { player: player.name })}
              style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 14,
                padding: 12,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 8,
                transition: "transform 0.15s ease-out"
              }}
              data-stat-card=""
            >
              <PlayerAvatar name={player.name} pct={pct} size="compact" />
              
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--type-body)" }}>{player.name}</div>
                <div style={{ fontSize: "var(--type-label)", color: t.accent, fontWeight: 600 }}>{player.tag.split(" / ")[0]}</div>
              </div>

              <RecordBadge w={stats.w} l={stats.l} pct={pct} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
