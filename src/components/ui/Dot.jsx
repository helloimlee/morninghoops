import { useTheme } from "../../lib/theme.jsx";

export default function Dot({ team }) {
  const { t, dark } = useTheme();
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: team === "blue" ? t.blue : t.t3, marginRight: 5, flexShrink: 0, position: "relative" }}>
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}>
        {team === "blue" ? "Blue team" : "White team"}
      </span>
    </span>
  );
}
