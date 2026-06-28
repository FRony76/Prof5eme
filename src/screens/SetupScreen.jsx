import { P } from "../theme.js";
import { SUBS, LVL } from "../constants.js";
import Dot from "../components/Dot.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function SetupScreen() {
  const { state, dispatch } = useAppState();
  const { subj, topic, level } = state;
  const S = SUBS[subj];
  const c = P[subj];

  const cardStyle = (selected, color) => ({
    background: selected ? P[color]?.lit || "#F5F3FF" : "white",
    border: `1.5px solid ${selected ? (P[color]?.pri || "#7C3AED") : "#E5E7EB"}`,
    borderRadius: 8, padding: "10px 14px", cursor: "pointer",
    fontSize: 13, textAlign: "left", fontFamily: "inherit",
    color: selected ? (P[color]?.txt || "#5B21B6") : "#374151",
    fontWeight: selected ? 600 : 400, transition: "all 0.15s"
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, padding: "0 0 1.5rem", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 26 }}>{S.emoji}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>{S.label}</h2>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Thème</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.75rem" }}>
          {S.topics.map(t => (
            <button key={t} onClick={() => dispatch({ type: "SET", payload: { topic: t } })} style={cardStyle(topic === t, subj)}>{t}</button>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Niveau</p>
        <div style={{ display: "flex", gap: 8, marginBottom: "2rem" }}>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => dispatch({ type: "SET", payload: { level: n } })}
              style={{ flex: 1, padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", background: level === n ? c.lit : "white", border: `1.5px solid ${level === n ? c.pri : "#E5E7EB"}`, borderRadius: 8, transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
                {[1, 2, 3].map(i => <Dot key={i} filled={i <= n} color={level === n ? c.pri : c.med} />)}
              </div>
              <div style={{ fontSize: 12, color: level === n ? c.txt : "#6B7280", fontWeight: level === n ? 700 : 400 }}>{LVL[n]}</div>
            </button>
          ))}
        </div>

        <button onClick={() => dispatch({ type: "QUIZ_START" })} disabled={!topic}
          style={{ width: "100%", padding: "13px", background: topic ? c.pri : "#E5E7EB", border: "none", borderRadius: 8, color: topic ? "white" : "#9CA3AF", fontSize: 15, fontWeight: 700, cursor: topic ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {topic ? "▶ Commencer les défis" : "Choisis d'abord un thème"}
        </button>
      </div>
    </div>
  );
}
