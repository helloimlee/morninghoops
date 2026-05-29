import { useTheme } from "../../lib/theme.jsx";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ compact }) {
  const { dark, setDark, t } = useTheme();
  
  return (
    <button 
      onClick={() => setDark(!dark)} 
      aria-label="Toggle dark/light mode" 
      style={{ 
        background: t.card, 
        border: `1px solid ${t.border}`, 
        borderRadius: "var(--radius-md)", 
        padding: compact ? "var(--space-card-gap) var(--space-card-pad)" : "var(--space-card-pad) calc(var(--space-card-pad) * 1.5)", 
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
        justifyContent: "center",
        transition: "all .15s, transform 0.1s ease"
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
