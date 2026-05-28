import { useTheme } from "../../lib/theme.jsx";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Header({ view, navigate, bp }) {
  const { t } = useTheme();
  const isDesktop = bp === "wide";

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: `${t.bg}cc`,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${t.border}`,
      height: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--space-page-x)"
    }}>
      <div 
        onClick={() => navigate("home")}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          cursor: "pointer",
          fontWeight: 800,
          fontSize: "var(--type-body)",
          color: t.text
        }}
      >
        <span style={{ fontSize: 20 }}>🏀</span>
        {!isDesktop && <span>Morning Hoops</span>}
        {isDesktop && <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: -0.5 }}>Morning <em style={{ fontStyle: "italic", color: t.accent }}>Hoops</em></span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isDesktop && (
          <nav style={{ display: "flex", gap: 8 }}>
            {[
              { id: "home", label: "Home" },
              { id: "season", label: "Players" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  background: view === item.id ? t.inset : "transparent",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: "var(--type-label-lg)",
                  fontWeight: view === item.id ? 700 : 500,
                  color: view === item.id ? t.accent : t.t2,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
        <ThemeToggle compact />
      </div>
    </header>
  );
}
