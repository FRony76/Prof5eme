import { P } from "../theme.js";
import { SUBS, LVL } from "../constants.js";
import Dot from "../components/Dot.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function SetupScreen() {
  const { state, dispatch } = useAppState();
  const { subj, topic, level } = state;
  const S = SUBS[subj];
  const c = P[subj];

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })}
          style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, padding: "0 0 1.5rem", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          ← Retour
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 26 }}>{S.emoji}</span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>{S.label}</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>S'entraîner</p>
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Thème</p>
        <div style={{ background: c.lit, border: `1.5px solid ${c.pri}`, borderRadius: 8, padding: "10px 14px", marginBottom: "1.75rem", fontSize: 13, fontWeight: 600, color: c.txt }}>
          {topic}
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

        <button onClick={() => dispatch({ type: "QUIZ_START" })}
          style={{ width: "100%", padding: "13px", background: c.pri, border: "none", borderRadius: 8, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ▶ Commencer les défis
        </button>
      </div>
    </div>
  );
}
