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
          gap: "var(--space-card-gap)", 
          cursor: "pointer",
          fontWeight: 800,
          fontSize: "var(--type-body)",
          color: t.text
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>🏀</span>
        {!isDesktop && <span>Morning Hoops</span>}
        {isDesktop && <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "var(--type-title)", letterSpacing: -0.5 }}>Morning <em style={{ fontStyle: "italic", color: t.accent }}>Hoops</em></span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-card-pad)" }}>
        {isDesktop && (
          <nav style={{ display: "flex", gap: "var(--space-card-gap)" }}>
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
                  padding: "var(--space-card-gap) var(--space-card-pad)",
                  fontSize: "var(--type-label-lg)",
                  fontWeight: view === item.id ? 700 : 500,
                  color: view === item.id ? t.accent : t.t2,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  minHeight: 40,
                  transition: "all 0.15s, transform 0.1s ease"
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
