import { useTheme } from "../../lib/theme.jsx";

export default function NavBar({ view, navigate, bp }) {
  const { t } = useTheme();
  if (bp === "wide") return null;

  const items = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "season", label: "Players", icon: "👤" }
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: `${t.card}ee`,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: `1px solid ${t.border}`,
      height: "calc(56px + env(safe-area-inset-bottom))",
      paddingBottom: "env(safe-area-inset-bottom)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around"
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => navigate(item.id)}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "33%",
            height: "100%",
            cursor: "pointer",
            color: view === item.id ? t.accent : t.t3,
            transition: "color 0.2s"
          }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
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
