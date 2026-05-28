import { useState } from "react";
import { useTheme } from "../../lib/theme.jsx";
import { TogglePill } from "../ui/TogglePill";
import ProgressBar from "../ui/ProgressBar";

export default function Leaderboard({ stats, bp, statsMode, setStatsMode, navigate }) {
  const { t } = useTheme();
  const { p: players } = stats;
  const isCompact = bp === "compact";
  const [listMode, setListMode] = useState("top"); // "top" | "bottom"

  const isByGames = statsMode === "games";
  const getW = (d) => isByGames ? d.gw : d.w;
  const getL = (d) => isByGames ? d.gl : d.l;

  const winSorted = Object.entries(players)
    .filter(([, d]) => getW(d) + getL(d) >= 3)
    .sort((a, b) => {
      const pctA = getW(a[1]) / (getW(a[1]) + getL(a[1]));
      const pctB = getW(b[1]) / (getW(b[1]) + getL(b[1]));
      return pctB - pctA;
    });

  const displayList = listMode === "top" 
    ? winSorted.slice(0, 5) 
    : [...winSorted].reverse().slice(0, 3);

  return (
    <section style={{ marginBottom: "var(--space-section)" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ 
          fontSize: "var(--type-label-lg)", 
          fontWeight: 700, 
          letterSpacing: 1.6, 
          textTransform: "uppercase", 
          color: t.t3 
        }}>
          Leaderboard
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          <TogglePill 
            value={listMode}
            onChange={setListMode}
            options={[
              { id: "top", label: "Top 5" },
              { id: "bottom", label: "Bottom 3" }
            ]}
          />
          <TogglePill 
            value={statsMode}
            onChange={setStatsMode}
            options={[
              { id: "series", label: "Series" },
              { id: "games", label: "Games" }
            ]}
          />
        </div>
      </div>

      <div style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: 14, 
        overflow: "hidden" 
      }}>
        {displayList.map(([name, d], i) => {
          const w = getW(d);
          const l = getL(d);
          const dec = w + l;
          const pct = Math.round((w / dec) * 100);
          const color = listMode === "top" ? t.green : t.red;
          const isLast = i === displayList.length - 1;

          return (
            <div 
              key={name}
              onClick={() => navigate("player", { player: name })}
              style={{ 
                padding: "12px var(--space-card-pad)", 
                borderBottom: isLast ? "none" : `1px solid ${t.border}`,
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: isCompact ? "1fr auto" : "24px 1fr 80px 1fr 60px",
                alignItems: "center",
                gap: 12
              }}
            >
              {!isCompact && (
                <div style={{ 
                  fontFamily: "'Instrument Serif', serif", 
                  fontSize: "var(--type-stat-md)", 
                  color: listMode === "top" ? t.accent : t.t3 
                }}>
                  {listMode === "top" ? i + 1 : winSorted.length - i}
                </div>
              )}
              
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--type-body)" }}>{name}</div>
                {isCompact && (
                   <div style={{ fontSize: "var(--type-body-sm)", color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
                )}
              </div>

              {!isCompact && (
                <div style={{ fontSize: "var(--type-body-sm)", color: t.t2, fontWeight: 600 }}>{w}-{l}</div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressBar pct={pct} color={color} label={`${name} win rate`} />
              </div>

              <div style={{ 
                fontFamily: "'Instrument Serif', serif", 
                fontSize: "var(--type-stat-md)", 
                color: color,
                textAlign: "right"
              }}>
                {pct}%
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button 
          onClick={() => navigate("season")}
          style={{ 
            background: "transparent", 
            border: "none", 
            color: t.accent, 
            fontSize: "var(--type-body-sm)", 
            fontWeight: 700, 
            cursor: "pointer",
            padding: "4px 8px"
          }}
        >
          View all records →
        </button>
      </div>
    </section>
  );
}
