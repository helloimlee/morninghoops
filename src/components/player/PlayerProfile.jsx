import { useTheme } from "../../lib/theme.jsx";

export default function PlayerProfile({ name, tag, desc, record, pct, bp }) {
  const { t } = useTheme();
  const S = { fontFamily: "'Instrument Serif',serif" };
  const isCompact = bp === "compact";
  const barColor = pct !== null ? (pct >= 60 ? t.green : pct >= 45 ? t.gold : t.red) : t.t3;

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 'var(--space-card-pad)' }}>
      <div style={{ display: "flex", alignItems: isCompact ? "baseline" : "center", gap: 14, marginBottom: isCompact ? 6 : 0, flexDirection: isCompact ? "column" : "row" }}>
        {isCompact ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ ...S, fontSize: 'var(--type-title)', color: barColor, flexShrink: 0 }}>{record}</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>
              {name}
              <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 6 }}>{tag}</span>
            </div>
          </div>
        ) : (
          <>
            <div style={{ ...S, fontSize: 'var(--type-title)', color: barColor, minWidth: 64, textAlign: "center" }}>{record}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--type-body)' }}>
                {name} <span style={{ fontSize: 'var(--type-label)', fontWeight: 600, color: t.accent, marginLeft: 4 }}>{tag}</span>
              </div>
              <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.5, marginTop: 2 }}>{desc}</div>
            </div>
          </>
        )}
      </div>
      {isCompact && <div style={{ fontSize: 'var(--type-body-sm)', color: t.t2, lineHeight: 1.55 }}>{desc}</div>}
    </div>
  );
}
