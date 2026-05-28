import { useTheme } from "../../lib/theme.jsx";

export default function SectionDivider() {
  const { t } = useTheme();
  return (
    <div style={{ borderTop: `1px solid ${t.border}`, margin: 'var(--space-section) 0 20px', paddingTop: 20 }} />
  );
}
