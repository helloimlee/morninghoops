import { useTheme } from "../../lib/theme.jsx";
import { useRef, useEffect } from "react";

export default function NavBar({ view, navigate, bp }) {
  const { t } = useTheme();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [view]);

  if (bp === "wide") return null;

  const items = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "season", label: "Players", icon: "👤" }
  ];

  return (
    <nav 
      ref={navRef}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: `${t.card}ee`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${t.border}`,
        height: "calc(4.5rem + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        nav::-webkit-scrollbar { display: none; }
      `}} />
      {items.map(item => (
        <button
          key={item.id}
          data-active={view === item.id}
          onClick={() => navigate(item.id)}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-card-gap)",
            width: items.length > 3 ? "33%" : "50%",
            minWidth: "80px",
            height: "100%",
            cursor: "pointer",
            color: view === item.id ? t.accent : t.t3,
            transition: "color 0.2s, transform 0.1s ease",
            scrollSnapAlign: "center",
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
          <span style={{ 
            fontSize: "var(--type-label)", 
            fontWeight: view === item.id ? 700 : 500,
            fontFamily: "'Outfit', sans-serif"
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
