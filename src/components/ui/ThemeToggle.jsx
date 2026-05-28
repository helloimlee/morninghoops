import { useTheme } from "../../lib/theme.jsx";

export function ThemeToggle({ compact }) {
  const { dark, setDark, t } = useTheme();
  
  return (
    <button 
      onClick={() => setDark(!dark)} 
      aria-label="Toggle dark/light mode" 
      style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: 8, 
        padding: compact ? "6px 10px" : "8px 14px", 
        cursor: "pointer", 
        color: t.t2, 
        fontSize: compact ? 'var(--type-label)' : 'var(--type-label-lg)', 
        fontWeight: 600, 
        fontFamily: "'Outfit',sans-serif", 
        display: "flex", 
        alignItems: "center", 
        gap: 'var(--space-card-gap)', 
        minHeight: 44,
        minWidth: 44,
        justifyContent: "center"
      }}
    >
      {dark ? "☀️" : "🌙"} {dark ? "Light" : "Dark"}
    </button>
  );
}
