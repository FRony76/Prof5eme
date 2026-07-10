import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { useAppState } from "../state/AppContext.jsx";

export default function TopicListScreen() {
  const { state, dispatch } = useAppState();
  const { subj, historyData } = state;
  const S = SUBS[subj];
  const c = P[subj];
  const byTopic = historyData?.byTopic || [];

  return (
    <div style={{ animation: "revFade .4s ease both" }}>
      <div onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })}
        style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
        ← Tableau de bord
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
        <div style={{ flex: "none", width: 60, height: 60, borderRadius: 16, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>{S.mono}</div>
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 30, letterSpacing: "-.8px" }}>{S.label}</div>
          <div style={{ color: "#6B6B7B", fontSize: 15, marginTop: 2 }}>{S.topics.length} thèmes</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
        {S.topics.map((t, i) => {
          const entry = byTopic.find(bt => bt.subject === subj && bt.topic === t);
          const pct = entry && entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : null;
          return (
            <div key={t}
              onClick={() => dispatch({ type: "SET", payload: { topic: t, screen: "topic" } })}
              style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #EAE7DE", borderRadius: 16, padding: "16px 18px", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.pri; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#EAE7DE"; }}>
              <div style={{ flex: "none", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, background: c.lit, color: c.pri }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16.5 }}>{t}</div>
              </div>
              {pct != null && (
                <div style={{ fontWeight: 700, fontSize: 14, color: c.txt }}>{pct}%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
