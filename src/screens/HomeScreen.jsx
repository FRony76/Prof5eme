import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { useAppState } from "../state/AppContext.jsx";

export default function HomeScreen() {
  const { state, dispatch } = useAppState();
  const { score, streak, historyData, user } = state;
  const byTopic = historyData?.byTopic || [];
  const recent = historyData?.recent || [];
  const hasData = byTopic.length > 0;

  const subjectKeys = Object.keys(SUBS);
  const firstKey = subjectKeys[0];

  let sumCorrect = 0, sumTotal = 0;
  byTopic.forEach(t => { sumCorrect += t.correct || 0; sumTotal += t.total || 0; });
  const masteryGlobal = sumTotal > 0 ? Math.round((sumCorrect / sumTotal) * 100) : null;

  const last = recent[0] || null;
  const heroEntry = last ? byTopic.find(t => t.subject === last.subject && t.topic === last.topic) : null;
  const heroPct = heroEntry && heroEntry.total > 0 ? Math.round((heroEntry.correct / heroEntry.total) * 100) : null;

  const goContinue = () => {
    if (last) dispatch({ type: "SET", payload: { subj: last.subject, topic: last.topic, screen: "topic" } });
    else dispatch({ type: "SET", payload: { subj: firstKey, topic: null, screen: "topics" } });
  };

  const openSubject = (k) => dispatch({ type: "SET", payload: { subj: k, topic: null, screen: "topics" } });

  return (
    <div style={{ animation: "revFade .4s ease both" }}>
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 34, letterSpacing: "-1px", margin: 0 }}>Salut{user ? ` ${user}` : ""} 👋</div>
      <div style={{ color: "#6B6B7B", fontSize: 16, marginTop: 6 }}>
        {hasData ? <>Tu as travaillé <b style={{ color: "#191927" }}>{byTopic.length} thème{byTopic.length > 1 ? "s" : ""}</b>. On continue ?</> : "Choisis une matière pour commencer à réviser."}
      </div>

      {/* Carte reprendre */}
      <div className="rev-hero" style={{ marginTop: 26, background: "#5B5488", borderRadius: 22, padding: "30px 34px", color: "#F4F2EC", display: "flex", alignItems: "center", gap: 30, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%,#5B4FE9,transparent 70%)", opacity: 0.55 }} />
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "#9A9AAB" }}>
            {last ? "Reprendre là où tu t'es arrêté(e)" : "Commence ta première session"}
          </div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 26, marginTop: 8, letterSpacing: "-.5px" }}>
            {last ? last.topic : SUBS[firstKey].label}
          </div>
          <div style={{ color: "#B9B9C6", fontSize: 14.5, marginTop: 4 }}>
            {last ? SUBS[last.subject]?.label : "Découvre les thèmes disponibles"}
          </div>
          {heroPct != null && (
            <div style={{ height: 8, background: "#7B74B2", borderRadius: 20, marginTop: 16, maxWidth: 340, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${heroPct}%`, background: "#5B4FE9", borderRadius: 20 }} />
            </div>
          )}
        </div>
        <div onClick={goContinue}
          style={{ flex: "none", background: "#5B4FE9", color: "#fff", fontWeight: 700, fontSize: 15, padding: "15px 26px", borderRadius: 14, cursor: "pointer", whiteSpace: "nowrap", transition: "background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#4A3FD6"}
          onMouseLeave={e => e.currentTarget.style.background = "#5B4FE9"}>
          {last ? "Continuer →" : "Commencer →"}
        </div>
      </div>

      {/* Stats */}
      <div className="rev-grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, color: "#6B6B7B", fontWeight: 600 }}>Points cumulés</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 28, marginTop: 6 }}>{score}</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, color: "#6B6B7B", fontWeight: 600 }}>Série en cours</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 28, marginTop: 6 }}>{streak} <span style={{ fontSize: 16, color: "#9A9AAB" }}>jours</span></div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, color: "#6B6B7B", fontWeight: 600 }}>Maîtrise globale</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 28, marginTop: 6 }}>{masteryGlobal != null ? `${masteryGlobal}%` : "—"}</div>
        </div>
      </div>

      {/* Matières */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 34 }}>
        <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 21 }}>Tes matières</div>
      </div>
      <div className="rev-grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        {subjectKeys.map(k => {
          const s = SUBS[k];
          const p = P[k];
          let correct = 0, total = 0;
          byTopic.forEach(t => { if (t.subject === k) { correct += t.correct || 0; total += t.total || 0; } });
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
          return (
            <div key={k} onClick={() => openSubject(k)}
              style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: 20, cursor: "pointer", transition: "transform .15s,box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ flex: "none", width: 46, height: 46, borderRadius: 12, background: p.lit, color: p.pri, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>{s.mono}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{s.label}</div>
                  <div style={{ fontSize: 12.5, color: "#6B6B7B" }}>{s.topics.length} thèmes</div>
                </div>
              </div>
              <div style={{ height: 7, background: "#EFECE3", borderRadius: 20, marginTop: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: p.pri, borderRadius: 20, animation: "revBar .7s ease both" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5, color: "#6B6B7B" }}>
                <span>{total > 0 ? `${correct}/${total} réussies` : "Pas encore de données"}</span>
                <span style={{ fontWeight: 700, color: "#191927" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
