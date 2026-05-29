import { useTheme } from "../../lib/theme";
import SectionDivider from "../layout/SectionDivider";
import { FileSearch } from "lucide-react";

export default function TylerLosses({ playerLosses, bp }) {
  const { t, dark } = useTheme();
  const isCompact = bp === "compact";

  if (!playerLosses || !playerLosses["Tyler"] || playerLosses["Tyler"].length === 0) {
    return null;
  }

  const losses = playerLosses["Tyler"];
  const allLossTeammates = losses.flatMap(l => l.teammates);
  const freq = {};
  allLossTeammates.forEach(n => freq[n] = (freq[n]||0) + 1);
  const cursed = Object.entries(freq).filter(([,v]) => v === losses.length).map(([k]) => k);

  return (
    <>
      <SectionDivider />
      <div id="season-tyler" style={{
        fontSize: 'var(--type-label-lg)', 
        fontWeight: 800, 
        letterSpacing: 1.5, 
        textTransform: "uppercase", 
        color: t.accent, 
        marginBottom: 16, 
        scrollMarginTop: 64
      }}>
        The Tyler Losses Files
      </div>
      <div style={{ 
        padding: 'var(--space-card-pad)', 
        background: t.card, 
        borderRadius: 14, 
        border: `1px solid ${t.border}`,
        marginBottom: 'var(--space-section)', 
        borderColor: dark ? "rgba(248,113,113,.2)" : "rgba(248,113,113,.15)", 
        backgroundColor: dark ? "rgba(248,113,113,.03)" : "rgba(248,113,113,.02)" 
      }}>
        <div style={{ fontSize: 'var(--type-body)', color: t.t2, lineHeight: 1.6, marginBottom: 14 }}>
          Tyler has lost exactly {losses.length} series. Every single one is catalogued below. The group text demanded forensic accountability.
        </div>
        
        {losses.map((loss, i) => (
          <div key={i} style={{ padding: isCompact ? '10px 12px' : "12px 14px", background: dark ? 'rgba(239,68,68,.06)' : 'rgba(239,68,68,.05)', borderRadius: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{loss.day}</div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.red, fontWeight: 600 }}>Lost {loss.score}</div>
            </div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>Tyler{"'"}s teammates:</strong> {loss.teammates.join(", ") || "(solo, apparently)"}
            </div>
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>Opposing team:</strong> {loss.opponents.join(", ")}
            </div>
          </div>
        ))}

        {cursed.length > 0 && (
          <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.55, marginTop: 10, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
            <strong style={{ color: t.red }}>The Curse Suspects:</strong> {cursed.join(", ")} {cursed.length === 1 ? "has" : "have"} been on Tyler{"'"}s team for every single one of his losses. Cosmic coincidence or smoking gun? Jury{"'"}s out.
          </div>
        )}

        {/* ANALYST'S FINDINGS */}
        <div style={{ marginTop: 16, padding: isCompact ? '14px 14px' : '18px 20px', background: dark ? 'rgba(248,113,113,.06)' : 'rgba(239,68,68,.04)', borderRadius: 12, border: `1px solid ${dark ? "rgba(248,113,113,.18)" : "rgba(248,113,113,.15)"}` }}>
          <div style={{ fontSize: 'var(--type-label)', fontWeight: 800, letterSpacing: 1.5, color: t.red, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <FileSearch size={18} strokeWidth={2.5} /> ANALYST{"'"}S FINDINGS — CLASSIFIED
          </div>
          <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.7, marginBottom: 8, fontStyle: 'italic' }}>
            After exhaustive review of the Tyler Losses Files, the following conclusions have been entered into the permanent record:
          </div>
          <ul style={{ margin: 0, paddingLeft: isCompact ? 18 : 22, fontSize: 'var(--type-body-sm)', color: dark ? '#FCA5A5' : '#B91C1C', lineHeight: 1.75 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Mike</strong> appears in 5 of Tyler{"'"}s 7 losses. At some point this stops being a coincidence and starts being a strategy. If Mike texts {"\""}I{"'"}m on your team today{"\""} just fake an ankle injury in the parking lot.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Nathan</strong> is on the team that beats Tyler in 5 of the 7 losses. This isn{"'"}t a rivalry — it{"'"}s a restraining order that Tyler keeps violating by showing up to the gym.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Cal{"'"}s team</strong> has won against Tyler in 4 of 7 losses. Cal doesn{"'"}t even need to be on the same side of the court as Tyler to ruin his week. He just needs to exist in the building.
            </li>
            <li style={{ marginBottom: 8 }}>
              Tyler{"'"}s only sweep — <strong>4/29, lost 4-0</strong> — came when he had both Mike AND Ryan on his team. Pairing those two with Tyler should be classified as a Geneva Convention violation.
            </li>
            <li style={{ marginBottom: 8 }}>
              6 of 7 losses were by a score of <strong>4-3</strong>. Tyler doesn{"'"}t get blown out — he specializes in giving you hope and then methodically extinguishing it in Game 7. It{"'"}s almost a talent.
            </li>
            <li>
              Tyler lost <strong>4 times in May alone</strong> (5/1, 5/11, 5/13, 5/18) — more than March and April combined. His game isn{"'"}t declining. It{"'"}s in hospice.
            </li>
          </ul>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${dark ? "rgba(248,113,113,.12)" : "rgba(248,113,113,.1)"}`, fontSize: 'var(--type-body-sm)', color: t.red, fontStyle: 'italic', fontWeight: 600 }}>
            Case status: Open. Tyler remains at large. The losses continue to accumulate.
          </div>
        </div>
      </div>
    </>
  );
}
