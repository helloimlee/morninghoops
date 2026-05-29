import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, useTheme } from "./lib/theme.jsx";
import { SESSIONS } from "./data/sessions";
import { MONTHS } from "./data/months";
import { CORRELATIONS } from "./data/players";
import { getStats } from "./lib/stats";
import Header from "./components/layout/Header";
import NavBar from "./components/layout/NavBar";
import HomeView from "./components/home/HomeView";
import MonthDetailView from "./components/month/MonthDetailView";
import PlayerDetailView from "./components/player/PlayerDetailView";
import SeasonView from "./components/season/SeasonView";
import InstallPrompt from "./components/ui/InstallPrompt";

function AppContent() {
  const [view, setView] = useState("home");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [statsMode, setStatsMode] = useState("series");
  const { t } = useTheme();

  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "regular";
    const w = window.innerWidth;
    return w < 480 ? "compact" : w < 768 ? "regular" : "wide";
  });

  // Base path for the app (from vite.config.js)
  const BASE = "/morninghoops";

  // Helper to parse current URL into view state
  const parseURL = () => {
    const path = window.location.pathname.replace(BASE, "").replace(/\/$/, "");
    if (!path || path === "") return { view: "home" };
    if (path === "/season") return { view: "season" };
    
    const monthMatch = path.match(/^\/month\/(.+)$/);
    if (monthMatch) return { view: "month", month: monthMatch[1] };
    
    const playerMatch = path.match(/^\/player\/(.+)$/);
    if (playerMatch) return { view: "player", player: decodeURIComponent(playerMatch[1]) };
    
    return { view: "home" };
  };

  // Helper to convert view state to URL path
  const viewToPath = (v, params = {}) => {
    let path = "";
    if (v === "home") path = "/";
    else if (v === "season") path = "/season";
    else if (v === "month" && params.month) path = `/month/${params.month}`;
    else if (v === "player" && params.player) path = `/player/${encodeURIComponent(params.player)}`;
    else path = "/";
    
    return BASE + (path === "/" ? "" : path);
  };

  // Synchronize state with URL on mount and back/forward
  useEffect(() => {
    const { view: v, month, player } = parseURL();
    setView(v);
    if (month) setSelectedMonth(month);
    if (player) setSelectedPlayer(player);

    const onPopState = () => {
      const { view: v, month, player } = parseURL();
      setView(v);
      if (month) setSelectedMonth(month);
      if (player) setSelectedPlayer(player);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setBp(w < 480 ? "compact" : w < 768 ? "regular" : "wide");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stats = useMemo(() => getStats(SESSIONS), []);

  const navigate = (v, params = {}) => {
    setView(v);
    if (params.month) setSelectedMonth(params.month);
    if (params.player) setSelectedPlayer(params.player);
    
    const newPath = viewToPath(v, params);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
    
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ 
      background: t.bg, 
      color: t.text, 
      fontFamily: "'Outfit',sans-serif", 
      minHeight: "var(--app-height)",
      transition: "background .3s, color .3s",
      display: "flex",
      flexDirection: "column",
      overscrollBehaviorY: "contain"
    }}>
      <Header view={view} navigate={navigate} bp={bp} />
      
      <main style={{ 
        flex: 1,
        maxWidth: "var(--content-max)", 
        margin: "0 auto", 
        width: "100%",
        padding: "var(--space-page-top) var(--page-pad-x-right) var(--page-pad-bot) var(--page-pad-x-left)" 
      }}>
        {view === "home" && (
          <div key="home" style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
            <HomeView 
              stats={stats} 
              bp={bp} 
              navigate={navigate} 
              statsMode={statsMode} 
              setStatsMode={setStatsMode} 
            />
          </div>
        )}
        {view === "month" && (
          <div key={`month-${selectedMonth}`} style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
            <MonthDetailView 
              month={MONTHS.find(m => m.id === selectedMonth)} 
              sessions={SESSIONS}
              bp={bp} 
              navigate={navigate} 
            />
          </div>
        )}
        {view === "player" && (
          <div key={`player-${selectedPlayer}`} style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
            <PlayerDetailView 
              playerName={selectedPlayer} 
              stats={stats} 
              sessions={SESSIONS}
              bp={bp} 
              navigate={navigate} 
            />
          </div>
        )}
        {view === "season" && (
          <div key="season" style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
            <SeasonView 
              stats={stats} 
              bp={bp} 
              statsMode={statsMode} 
              setStatsMode={setStatsMode} 
            />
          </div>
        )}
        {view !== "home" && view !== "month" && view !== "player" && view !== "season" && (
          <div style={{ textAlign: "center", padding: "100px 20px", color: t.t3 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "var(--type-headline)", color: t.text }}>Coming Soon</h2>
            <p>The {view} view is under construction as part of Phase 4 & 5.</p>
            <button 
              onClick={() => navigate("home")}
              style={{ 
                marginTop: 20,
                background: t.card,
                border: `1px solid ${t.border}`,
                padding: "8px 16px",
                borderRadius: 8,
                color: t.accent,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Back to Home
            </button>
          </div>
        )}
      </main>

      <NavBar view={view} navigate={navigate} bp={bp} />
      <InstallPrompt />
      
      <style dangerouslySetInnerHTML={{ __html: `
        button { transition: transform 0.1s ease-out; }
        button:active { transform: scale(0.97); }
        :focus-visible { outline: 2px solid #EF6234; outline-offset: 2px; }
        @media (hover: hover) {
          [data-stat-card]:hover { transform: scale(1.02); transition: transform 0.15s ease-out; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
      `}} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
