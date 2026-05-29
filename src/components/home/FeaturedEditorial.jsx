import { useTheme } from "../../lib/theme.jsx";
import { Trophy } from "lucide-react";

export default function FeaturedEditorial({ bp }) {
  const { t, dark } = useTheme();
  const isCompact = bp === "compact";

  return (
    <section style={{ 
      marginBottom: "var(--space-section)",
      background: dark ? "rgba(251,191,36,.06)" : "rgba(251,191,36,.04)",
      border: `1px solid ${dark ? "rgba(251,191,36,.25)" : "rgba(202,138,4,.2)"}`,
      borderRadius: 14,
      padding: "var(--space-card-pad)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ 
        fontSize: "var(--type-label)", 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        color: t.gold, 
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <Trophy size={16} strokeWidth={2.5} /> FEATURED STORY
      </div>
      
      <h2 style={{ 
        fontFamily: "'Instrument Serif', serif", 
        fontSize: "var(--type-title)", 
        color: t.text,
        margin: "0 0 12px 0"
      }}>
        The Dynasty reassembled after years apart and played like the intervening time was a clerical error.
      </h2>

      <p style={{ 
        fontSize: "var(--type-body)", 
        color: t.t2, 
        lineHeight: 1.7,
        margin: 0
      }}>
        On 5/4, The Dynasty reunited: Nathan, Wags, Lee & Cal reassembled on Blue, dismantled White 4-2, and won the in-season tournament. 
        The one that actually matters. The film room footage remains classified.
      </p>

      <div style={{ 
        marginTop: 16,
        paddingTop: 14,
        borderTop: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["NA", "WA", "LE", "CA"].map(init => (
            <div key={init} style={{ 
              width: 24, 
              height: 24, 
              borderRadius: "50%", 
              background: t.gold, 
              color: "#000", 
              fontSize: 10, 
              fontWeight: 800, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              {init}
            </div>
          ))}
        </div>
        <span style={{ fontSize: "var(--type-label)", fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: 1 }}>
          The Dynasty Returns
        </span>
      </div>
    </section>
  );
}
