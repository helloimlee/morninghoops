import { useTheme } from "../../lib/theme.jsx";

export default function HeroHeader({ stats, bp }) {
  const { t } = useTheme();
  const isCompact = bp === "compact";
  const { totalS, uniqueCount, decided } = stats;
  
  const bW = decided.filter(s => s.winner === "blue").length;
  const wW = decided.filter(s => s.winner === "white").length;

  return (
    <header style={{ 
      paddingBottom: "var(--space-section)", 
      textAlign: isCompact ? "left" : "center" 
    }}>
      <div style={{ 
        fontSize: "var(--type-label-lg)", 
        fontWeight: 700, 
        letterSpacing: 2, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: "var(--space-card-gap)" 
      }}>
        4:45 AM · Middle School Gym · 3 Months Deep
      </div>
      
      <h1 style={{ 
        fontFamily: "'Instrument Serif', serif", 
        fontSize: "var(--type-display)", 
        fontWeight: 400, 
        letterSpacing: -1, 
        lineHeight: 1.05, 
        margin: `0 0 var(--space-card-gap) 0`
      }}>
        Morning <em style={{ fontStyle: "italic", color: t.accent }}>Hoops</em>
      </h1>
      
      <p style={{ 
        fontSize: "var(--type-body)", 
        color: t.t2, 
        maxWidth: "var(--type-body-max-w)", 
        margin: isCompact ? "0 0 var(--space-card-pad) 0" : "0 auto var(--space-card-pad)", 
        lineHeight: "var(--type-body-lh)" 
      }}>
        A group of grown adults wake up before the sun to play 7-game series where children learn fractions. 
        Tyler is mortal. Gabe is everywhere. Cal is occasionally in Florida. Sean is asleep.
      </p>

      <div style={{ 
        display: "flex", 
        gap: "var(--space-card-gap)", 
        fontSize: "var(--type-body-sm)", 
        fontWeight: 600, 
        color: t.t3,
        justifyContent: isCompact ? "flex-start" : "center"
      }}>
        <span>{decided.length} series decided</span>
        <span>·</span>
        <span>{uniqueCount} players</span>
        <span>·</span>
        <span style={{ color: bW > wW ? t.blue : t.white }}>
          {bW > wW ? `Blue leads ${bW}-${wW}` : wW > bW ? `White leads ${wW}-${bW}` : `Tied ${bW}-${wW}`}
        </span>
      </div>
    </header>
  );
}
