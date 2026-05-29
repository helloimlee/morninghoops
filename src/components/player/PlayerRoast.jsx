import { useTheme } from "../../lib/theme.jsx";
import { Flame } from "lucide-react";

export default function PlayerRoast({ roast }) {
  const { dark, t } = useTheme();
  
  if (!roast) return null;
  
  return (
    <div style={{ 
      marginTop: 12, 
      padding: '12px 14px', 
      background: dark ? 'rgba(248,113,113,.06)' : 'rgba(239,68,68,.04)', 
      borderRadius: 8, 
      borderLeft: `3px solid ${t.red}` 
    }}>
      <div style={{ 
        fontSize: 'var(--type-label)', 
        fontWeight: 800, 
        letterSpacing: 1.2, 
        color: t.red, 
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        gap: 6
      }}>
        <Flame size={16} strokeWidth={2.5} /> SCOUTING REPORT
      </div>
      <div style={{ 
        fontSize: 'var(--type-body-sm)', 
        color: dark ? '#FCA5A5' : '#B91C1C', 
        lineHeight: 1.55, 
        fontStyle: 'italic' 
      }}>
        {roast}
      </div>
    </div>
  );
}
