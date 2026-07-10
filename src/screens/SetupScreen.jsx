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
    <div style={{ animation: "revFade .4s ease both", maxWidth: 560 }}>
      <div onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })}
        style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
        ← {S.label}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, marginBottom: 26 }}>
        <div style={{ flex: "none", width: 52, height: 52, borderRadius: 14, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>{S.mono}</div>
        <div>
          <div style={{ fontSize: 13, color: "#6B6B7B" }}>{S.label}</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 24, letterSpacing: "-.5px" }}>S'entraîner</div>
        </div>
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: "#9A9AAB", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Thème</p>
      <div style={{ background: c.lit, border: `1.5px solid ${c.pri}`, borderRadius: 14, padding: "12px 16px", marginBottom: 28, fontSize: 14, fontWeight: 600, color: c.txt }}>
        {topic}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: "#9A9AAB", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Niveau</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => dispatch({ type: "SET", payload: { level: n } })}
            style={{ flex: 1, padding: "14px 10px", cursor: "pointer", fontFamily: "inherit", background: level === n ? c.lit : "#fff", border: `1.5px solid ${level === n ? c.pri : "#EAE7DE"}`, borderRadius: 14, transition: "all 0.15s" }}
            onMouseEnter={e => { if (level !== n) e.currentTarget.style.borderColor = c.med; }}
            onMouseLeave={e => { if (level !== n) e.currentTarget.style.borderColor = "#EAE7DE"; }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
              {[1, 2, 3].map(i => <Dot key={i} filled={i <= n} color={level === n ? c.pri : c.med} />)}
            </div>
            <div style={{ fontSize: 12.5, color: level === n ? c.txt : "#6B6B7B", fontWeight: level === n ? 700 : 500 }}>{LVL[n]}</div>
          </button>
        ))}
      </div>

      <button onClick={() => dispatch({ type: "QUIZ_START" })}
        style={{ width: "100%", padding: "15px", background: c.pri, border: "none", borderRadius: 14, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        ▶ Commencer les défis
      </button>
    </div>
  );
}
