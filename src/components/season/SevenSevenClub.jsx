import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";

export default function SevenSevenClub({ bp }) {
  const { t, dark } = useTheme();
  const isCompact = bp === "compact";
  const isRegular = bp === "regular";

  return (
    <>
      <SectionDivider />
      <div id="season-club" style={{
        fontSize: 'var(--type-label-lg)', 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: 16, 
        scrollMarginTop: 64
      }}>
        The 7/7 Club
      </div>
      <div style={{ 
        padding: 'var(--space-card-pad)', 
        background: t.card, 
        borderRadius: 14, 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)', 
        borderColor: dark ? "rgba(251,191,36,.2)" : "rgba(202,138,4,.15)", 
        backgroundColor: dark ? "rgba(251,191,36,.04)" : "rgba(202,138,4,.03)" 
      }}>
        <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>
          Three players have shot perfect from the field in a single game and scored every one of their team{"'"}s seven points. This club is exclusive, unintentional, and possibly cursed.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : isRegular ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>FOUNDING MEMBER</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-title)', color: t.text }}>Gabe</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Mon 3/23 · Game 1<br />Three threes and a layup. Was mortal again by Game 2.</div>
          </div>
          <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>SECOND MEMBER</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-title)', color: t.text }}>Tyler</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Fri 3/27 · Game 2<br />Capped a 4-0 sweep. Tyler does this kind of thing.</div>
          </div>
          <div style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.06)' : 'rgba(251,191,36,.05)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.15)" : "rgba(251,191,36,.2)"}` }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 4 }}>NEWEST MEMBER</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-title)', color: t.text }}>Lee</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 4, lineHeight: 1.5 }}>Fri 5/1 · Pivotal Game 5<br />Three threes and a layup in a pivotal Game 5. Blue won the series 4-3.</div>
          </div>
        </div>
      </div>
    </>
  );
}
