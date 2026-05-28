import { useTheme } from "../../lib/theme.jsx";

export function Footer() {
  const { t } = useTheme();
  return (
    <footer style={{ textAlign: "center", fontSize: 'var(--type-label)', color: t.t3, padding: "60px 20px 40px", lineHeight: 1.7, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <img 
        src={`${import.meta.env.BASE_URL}badge.png`} 
        alt="Amici's Pizza Memorial Gymnasium Seal" 
        style={{ 
          width: 180, 
          height: 180, 
          objectFit: "contain",
          opacity: 0.85,
          mixBlendMode: "luminosity"
        }} 
      />
      <div>
        <span style={{ color: t.accent }}>Morning Hoops</span> · 7-Game Series · Verified from spreadsheet<br />
        Played at 4:45 AM. Tyler is mortal. Gabe is unkillable. Cal is under investigation. The spreadsheet is gospel.<br />
        <span style={{ color: t.gold }}>The Dynasty's tournament trophy is non-negotiable.</span> Now featuring dynasty-level delusions of grandeur.
      </div>
    </footer>
  );
}
