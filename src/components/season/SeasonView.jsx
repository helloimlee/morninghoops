import { useTheme } from "../../lib/theme";
import { useRef } from "react";
import HeadToHead from "../home/HeadToHead";
import PlayerRecordsTable from "./PlayerRecordsTable";
import AttendanceTable from "./AttendanceTable";
import TylerLosses from "./TylerLosses";
import SevenSevenClub from "./SevenSevenClub";
import DynastySection from "./DynastySection";
import AlgorithmMatchup from "./AlgorithmMatchup";

export default function SeasonView({ stats, bp, statsMode, setStatsMode }) {
  const { t } = useTheme();
  const navRef = useRef(null);

  const { p: players, totalS, decided, playerLosses, uniqueCount, avgPerSession } = stats;

  const bW = decided.filter(s => s.winner === "blue").length;
  const wW = decided.filter(s => s.winner === "white").length;
  const uniquePlayersCount = uniqueCount;

  const handleScrollTo = (id, e) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Center the clicked button in the nav
      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-section)" }}>
        <div style={{
          fontSize: 'var(--type-label-lg)', 
          fontWeight: 800, 
          letterSpacing: 1.5, 
          textTransform: "uppercase", 
          color: t.accent, 
          marginBottom: "var(--space-card-gap)"
        }}>
          Full Season
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-headline)', color: t.text, margin: 0, fontWeight: 400 }}>Every Series. Every Roster.</h2>
        <div style={{ fontSize: 'var(--type-body)', color: t.t2, marginTop: "var(--space-card-gap)", lineHeight: 1.6, maxWidth: 'var(--space-prose-max)' }}>
          {decided.length} decided 7-game series. {uniquePlayersCount} players. Played by 1s and 2s. {bW > wW ? `Blue leads ${bW}–${wW}` : bW < wW ? `White leads ${wW}–${bW}` : `Tied ${bW}–${wW}`}. Every number below is real. The commentary, unfortunately, is also real.
        </div>
      </div>

      {/* SECTION JUMP NAV */}
      <nav 
        ref={navRef}
        style={{ 
          display: "flex", 
          gap: 'var(--space-card-gap)', 
          marginBottom: "var(--space-section)", 
          overflowX: "auto", 
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch", 
          paddingBottom: "var(--space-card-gap)", 
          scrollbarWidth: "none", 
          maskImage: "linear-gradient(to right, black 90%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, black 90%, transparent)",
          scrollSnapType: "x proximity",
          msOverflowStyle: "none"
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          nav::-webkit-scrollbar { display: none; }
        `}} />
        {[
          { label: "Overview", id: "season-overview" },
          { label: "Head to Head", id: "season-h2h" },
          { label: "Records", id: "season-records" },
          { label: "Attendance", id: "season-attendance" },
          { label: "Tyler Losses", id: "season-tyler" },
          { label: "7/7 Club", id: "season-club" },
          { label: "Dynasty", id: "season-dynasty" },
          { label: "Algorithm", id: "season-algorithm" },
        ].map((s, i) => (
          <button 
            key={i} 
            onClick={(e) => handleScrollTo(s.id, e)} 
            aria-label={`Jump to ${s.label} section`} 
            style={{ 
              background: t.inset, 
              border: `1px solid ${t.border}`, 
              padding: "var(--space-card-gap) var(--space-card-pad)", 
              cursor: "pointer", 
              fontSize: 'var(--type-body-sm)', 
              fontWeight: 600, 
              color: t.t3, 
              fontFamily: "'Outfit',sans-serif", 
              whiteSpace: "nowrap", 
              borderRadius: "var(--radius-sm)", 
              minHeight: 44, 
              flexShrink: 0,
              transition: "all .15s, transform 0.1s ease",
              scrollSnapAlign: "center"
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* HEADLINE STATS — editorial pull-quote */}
      <div id="season-overview" style={{ 
        fontFamily: "'Instrument Serif', serif", 
        fontSize: 'var(--type-title)', 
        fontStyle: "italic", 
        color: t.t2, 
        lineHeight: 1.7, 
        marginBottom: 'var(--space-section)', 
        padding: "var(--space-card-pad) 0 var(--space-card-pad) var(--space-card-pad)", 
        borderLeft: `2px solid ${t.accent}`, 
        maxWidth: 'var(--space-prose-max)', 
        scrollMarginTop: 64 
      }}>
        <span style={{ color: t.accent }}>{decided.length}</span> decided series across the full season. Blue <span style={{ color: t.accent }}>{bW}</span>, White <span style={{ color: t.accent }}>{wW}</span>. <span style={{ color: t.accent }}>{uniquePlayersCount}</span> players have stepped on the court, averaging <span style={{ color: t.accent }}>{avgPerSession}</span> per session. The spreadsheet is the source of truth. The dashboard is just the messenger.
      </div>

      <div id="season-h2h" style={{ scrollMarginTop: 64 }}>
        <HeadToHead
          stats={stats}
          bp={bp}
        />
      </div>

      <PlayerRecordsTable 
        players={players} 
        statsMode={statsMode} 
        setStatsMode={setStatsMode} 
        bp={bp} 
      />

      <AttendanceTable 
        players={players} 
        totalS={totalS} 
        bp={bp} 
      />

      <TylerLosses 
        playerLosses={playerLosses} 
        bp={bp} 
      />

      <SevenSevenClub 
        bp={bp} 
      />

      <DynastySection 
        bp={bp} 
      />

      <AlgorithmMatchup 
        players={players} 
        bp={bp} 
      />

    </div>
  );
}
