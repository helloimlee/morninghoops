import { useTheme } from "../../lib/theme.jsx";

export function TogglePill({ options, value, onChange }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", background: t.inset, borderRadius: 999, padding: 3, border: `1px solid ${t.border}` }}>
      {options.map(o => (
        <button 
          key={o.id} 
          onClick={() => onChange(o.id)} 
          style={{ 
            background: value === o.id ? t.card : "transparent", 
            border: value === o.id ? `1px solid ${t.border}` : "1px solid transparent", 
            borderRadius: 999, 
            padding: "5px 12px", 
            cursor: "pointer", 
            fontSize: 'var(--type-label)', 
            fontWeight: value === o.id ? 700 : 500, 
            color: value === o.id ? t.accent : t.t3, 
            fontFamily: "'Outfit',sans-serif", 
            transition: "all .15s, transform 0.1s ease", 
            whiteSpace: "nowrap", 
            minHeight: 44,
            minWidth: 44
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
