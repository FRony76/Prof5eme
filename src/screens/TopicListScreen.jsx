import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { useAppState } from "../state/AppContext.jsx";

export default function TopicListScreen() {
  const { state, dispatch } = useAppState();
  const { subj } = state;
  const S = SUBS[subj];
  const c = P[subj];

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })}
          style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>
          ← Retour
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 28 }}>{S.emoji}</span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>{S.label}</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>Choisis un thème pour accéder aux activités</p>
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Thèmes</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {S.topics.map(t => (
            <button key={t}
              onClick={() => dispatch({ type: "SET", payload: { topic: t, screen: "topic" } })}
              style={{ padding: "14px 16px", background: "white", border: `1.5px solid ${c.med}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.pri; e.currentTarget.style.background = c.lit; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.med; e.currentTarget.style.background = "white"; }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.txt }}>{t}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
