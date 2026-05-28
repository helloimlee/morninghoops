import { useTheme } from "../../lib/theme.jsx";

function getInitials(name) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function PlayerAvatar({ name, pct, size = "compact" }) {
  const { t } = useTheme();
  const initials = getInitials(name);
  
  let bg = t.t3; // fallback
  if (pct !== null && pct !== undefined) {
    bg = pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red;
  }
  
  const dim = size === "compact" ? 48 : size === "wide" ? 64 : 56;

  return (
    <div style={{ 
      width: dim, 
      height: dim, 
      borderRadius: "50%", 
      background: bg, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      color: "#000",
      fontWeight: 700,
      fontSize: size === "compact" ? 'var(--type-body)' : 'var(--type-stat-md)',
      fontFamily: "'Outfit',sans-serif",
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}
