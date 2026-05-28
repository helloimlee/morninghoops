import { useTheme } from "../../lib/theme.jsx";

export default function ProgressBar({ pct, color, label }) {
  const { t } = useTheme();
  const safePct = pct !== null && pct !== undefined ? pct : 0;
  return (
    <div style={{ flex: 1, height: 6, background: t.inset, borderRadius: 3, overflow: "hidden" }} role="progressbar" aria-valuenow={safePct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div style={{ height: "100%", width: `${safePct}%`, background: color || t.green, borderRadius: 3 }} />
    </div>
  );
}
