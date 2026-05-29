import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";
import { Trophy, Crown } from "lucide-react";

export default function DynastySection({ bp }) {
  const { t, dark } = useTheme();
  const isCompact = bp === "compact";
  const isRegular = bp === "regular";

  return (
    <>
      <SectionDivider />
      <div id="season-dynasty" style={{
        fontSize: 'var(--type-label-lg)', 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: 16, 
        scrollMarginTop: 64,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <Trophy size={20} strokeWidth={2.5} /> The Dynasty
      </div>
      <div style={{ 
        padding: 'var(--space-card-pad)', 
        background: t.card, 
        borderRadius: 14, 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)', 
        borderColor: dark ? "rgba(251,191,36,.25)" : "rgba(202,138,4,.2)", 
        backgroundColor: dark ? "rgba(251,191,36,.06)" : "rgba(202,138,4,.04)" 
      }}>
        <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.7, marginBottom: 18, maxWidth: 'var(--space-prose-max)' }}>
          Years ago, four men — Nathan, Wags, Lee & Cal — formed a fixed squad and proceeded to go undefeated across dozens of series. Nobody knows how. Science has no explanation. The film room footage is classified. They disbanded, went their separate ways, and the league moved on. Until May, when they reassembled twice on Blue and reminded everyone why the word {"\""}dynasty{"\""} exists.
        </div>

        {/* ROSTER CARD */}
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr 1fr" : isRegular ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { name: "Nathan", role: "Structural Beam" },
            { name: "Wags", role: "Solid Citizen" },
            { name: "Lee", role: "7/7 Club" },
            { name: "Cal", role: "Flamethrower" },
          ].map(m => (
            <div key={m.name} style={{ padding: "14px", background: dark ? 'rgba(251,191,36,.08)' : 'rgba(251,191,36,.06)', borderRadius: 10, border: `1px solid ${dark ? "rgba(251,191,36,.18)" : "rgba(251,191,36,.22)"}`, textAlign: "center" }}>
              <div style={{ color: t.gold, marginBottom: 8, display: "flex", justifyContent: "center" }}>
                <Crown size={24} strokeWidth={2.5} />
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-title)', color: t.text, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 'var(--type-label)', color: t.t3, marginTop: 2 }}>{m.role}</div>
            </div>
          ))}
        </div>

        {/* RECENT RESULTS */}
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 18 }}>
          {/* MAY 4TH RESULT */}
          <div style={{ background: dark ? 'rgba(251,191,36,.05)' : 'rgba(251,191,36,.04)', borderRadius: 10, padding: 'var(--space-card-pad)', border: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}` }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 6 }}>REUNION RESULT · MON 5/4</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-lg)', color: t.text, lineHeight: 1.2 }}>Dynasty 4, White 2</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 8, lineHeight: 1.6 }}>
              The Dynasty reassembled after years apart and played like the intervening time was a clerical error. Clinical. Surgical. Mildly disrespectful.
            </div>
          </div>

          {/* MAY 28TH RESULT */}
          <div style={{ background: dark ? 'rgba(251,191,36,.05)' : 'rgba(251,191,36,.04)', borderRadius: 10, padding: 'var(--space-card-pad)', border: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}` }}>
            <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 6 }}>DEFENSE RESULT · THU 5/28</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'var(--type-stat-lg)', color: t.text, lineHeight: 1.2 }}>Dynasty 4, White 3</div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, marginTop: 8, lineHeight: 1.6 }}>
              In the "Gaybe Gym," the Dynasty survived a 4-3 thriller against Jared, Cody, Ryan, and Gabe. The brotherhood remains undefeated (2-0) in the modern era.
            </div>
          </div>
        </div>

        {/* IN-SEASON TOURNAMENT */}
        <div style={{ background: dark ? 'rgba(251,191,36,.05)' : 'rgba(251,191,36,.04)', borderRadius: 10, padding: 'var(--space-card-pad)', border: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.15)"}`, marginBottom: 18 }}>
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.gold, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Trophy size={18} strokeWidth={2.5} /> IN-SEASON TOURNAMENT CHAMPIONS
          </div>
          <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.7 }}>
            The Dynasty didn{"'"}t just win the series — they won the in-season tournament. This is the one that actually matters. The regular season is just cardio. The tournament is where legacies are made, and The Dynasty{"'"}s legacy was already extensive before they added {"\""}tournament champions{"\""} to the résumé. The trophy is theirs. It is non-negotiable.
          </div>
        </div>

        {/* CLOSING QUIP */}
        <div style={{ fontSize: 'var(--type-body)', color: t.accent, lineHeight: 1.7, fontStyle: "italic", maxWidth: 'var(--space-prose-max)', borderTop: `1px solid ${dark ? "rgba(251,191,36,.12)" : "rgba(251,191,36,.1)"}`, paddingTop: 14 }}>
          Whether The Dynasty{"'"}s return is a nostalgia tour or a permanent restructuring of Morning Hoops power dynamics is unclear. What IS clear is that the unit is 2-0 since reassembling, and the league remains on notice. The film room footage remains classified. The investigation is ongoing. The trophy is not.
        </div>
      </div>
    </>
  );
}
