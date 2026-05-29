import { useTheme } from "../../lib/theme.jsx";
import Badge from "../ui/Badge";
import Dot from "../ui/Dot";

export default function GameRow({ s, i, len, bp }) {
  const { dark, t } = useTheme();
  
  const isCompact = bp === "compact";
  const isWide = bp === "wide";
  
  const noGame = s.blue.length === 0 && s.white.length === 0;
  const rowOpacity = !s.winner && !noGame ? 0.5 : noGame ? 0.35 : 1;
  const S = { fontFamily: "'Instrument Serif',serif" };

  if (isCompact) {
    return (
      <div>
        <div style={{ padding: '14px var(--space-card-pad)', borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", opacity: rowOpacity }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: noGame ? 0 : 6 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>{s.day}</div>
            {!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}
          </div>
          {noGame ? (
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", marginTop: 4 }}>{s.note || "No game"}</div>
          ) : (
            <div style={{ fontSize: 'var(--type-body-sm)', lineHeight: 1.7 }}>
              <span style={{ color: t.blue, fontWeight: 600 }}>{s.blue.join(' \u00b7 ')}</span>
              <span style={{ ...S, color: t.t3, fontStyle: "italic", margin: "0 6px" }}>vs</span>
              <span style={{ color: t.white, fontWeight: 600 }}>{s.white.join(' \u00b7 ')}</span>
            </div>
          )}
        </div>
        {s.note && !noGame && (
          <div style={{ padding: '0 var(--space-card-pad) 8px', borderLeft: `2px solid ${t.accent}`, marginLeft: 'var(--space-card-pad)', fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>
        )}
      </div>
    );
  }

  if (!isWide) {
    return (
      <div>
        <div style={{ padding: "var(--space-card-gap) var(--space-card-pad)", borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", opacity: rowOpacity }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: noGame ? 0 : "var(--space-card-gap)" }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--type-body-sm)' }}>{s.day}</div>
            {!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}
          </div>
          {noGame ? (
            <div style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", marginTop: "var(--space-card-gap)" }}>{s.note || "No game"}</div>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
                {s.blue.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="blue" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
              </div>
              <div style={{ ...S, fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", padding: "2px 0" }}>vs</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
                {s.white.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="white" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
              </div>
            </>
          )}
        </div>
        {s.note && !noGame && <div style={{ padding: "0 var(--space-card-pad) var(--space-card-gap) var(--space-card-pad)", fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>}
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "minmax(60px, max-content) 1fr auto 1fr minmax(60px, max-content)", 
        alignItems: "center", 
        padding: "var(--space-card-pad)", 
        borderBottom: i < len - 1 ? `1px solid ${t.border}` : "none", 
        gap: 'var(--space-card-gap)', 
        opacity: rowOpacity 
      }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--type-body-sm)' }}>{s.day}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
          {noGame ? <span style={{ fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic" }}>{s.note || "No game"}</span> : s.blue.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="blue" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
        </div>
        <div style={{ textAlign: "center", ...S, fontSize: 'var(--type-body-sm)', color: t.t3, fontStyle: "italic", minWidth: 24 }}>{noGame ? "" : "vs"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", lineHeight: 1.6 }}>
          {!noGame && s.white.map((p, j) => <span key={j} style={{ display: "inline-flex", alignItems: "center" }}><Dot team="white" dark={dark} /><span style={{ fontWeight: 500, fontSize: 'var(--type-body-sm)' }}>{p}</span></span>)}
        </div>
        <div style={{ textAlign: "right" }}>{!noGame && <Badge winner={s.winner} score={s.score} dark={dark} />}</div>
      </div>
      {s.note && !noGame && <div style={{ padding: `0 var(--space-card-pad) var(--space-card-gap) ${isCompact ? 'var(--space-card-pad)' : isWide ? 'max(90px, 15%)' : '48px'}`, fontSize: 'var(--type-label)', color: t.accent, fontWeight: 600, fontStyle: "italic", letterSpacing: '0.025em' }}>{s.note}</div>}
    </div>
  );
}
