import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { computeWeekActivity } from "../components/AppShell.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function HistoryScreen() {
  const { state, dispatch } = useAppState();
  const { score, streak, historyData } = state;
  const recent = historyData?.recent || [];
  const byTopic = historyData?.byTopic || [];
  const weekDots = computeWeekActivity(historyData);

  const fmt = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  const openDetail = (r) => {
    if (!r.id) return;
    dispatch({ type: "SET", payload: { detailId: r.id, screen: "attempt" } });
  };

  // Agrégat de maîtrise par matière (uniquement celles ayant des données)
  const bySubject = Object.keys(SUBS).map(k => {
    let correct = 0, total = 0;
    byTopic.forEach(t => { if (t.subject === k) { correct += t.correct || 0; total += t.total || 0; } });
    return { key: k, label: SUBS[k].label, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
  }).filter(s => s.total > 0);

  return (
    <div style={{ animation: "revFade .4s ease both" }}>
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 30, letterSpacing: "-.8px" }}>Ta progression</div>
      <div style={{ color: "#6B6B7B", fontSize: 15.5, marginTop: 5 }}>Continue comme ça, tu es sur la bonne voie.</div>

      <div className="rev-progcols" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginTop: 26 }}>
        {/* Maîtrise par matière */}
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 20, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Maîtrise par matière</div>
          {bySubject.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
              {bySubject.map(s => (
                <div key={s.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 7 }}>
                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: "#6B6B7B", fontWeight: 700 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 9, background: "#EFECE3", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: P[s.key]?.pri || "#5B4FE9", borderRadius: 20, animation: "revBar .7s ease both" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#9A9AAB", marginTop: 16, lineHeight: 1.5 }}>Pas encore de données : lance-toi sur un premier quiz pour voir ta maîtrise apparaître ici.</div>
          )}
        </div>

        {/* Points & série */}
        <div style={{ background: "#5B5488", color: "#F4F2EC", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Points &amp; série</div>
          <div style={{ display: "flex", gap: 22, marginTop: 18 }}>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 28 }}>{score}</div>
              <div style={{ fontSize: 12.5, color: "#B9B9C6" }}>points cumulés</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 28 }}>✺ {streak}</div>
              <div style={{ fontSize: 12.5, color: "#B9B9C6" }}>jours d'affilée</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 18 }}>
            {weekDots.map((d, i) => (
              <div key={i} title={d.day} style={{ width: 24, height: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: d.active ? "#8C84D6" : "#7B74B2", color: d.active ? "#fff" : "#E4E1F2" }}>
                {d.day}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", paddingTop: 18, fontSize: 13, color: "#B9B9C6" }}>Chaque jour travaillé compte pour ta série 🔥</div>
        </div>
      </div>

      {/* Maîtrise par thème */}
      {byTopic.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 32, marginBottom: 14 }}>Maîtrise par thème</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {byTopic.map((t, i) => {
              const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
              const barColor = pct >= 80 ? P.ok.pri : pct >= 50 ? P.warn.pri : P.err.pri;
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 14, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{t.topic}</span>
                      <span style={{ fontSize: 12, color: "#9A9AAB", marginLeft: 8 }}>{SUBS[t.subject]?.label || t.subject}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#191927" }}>{pct}%</span>
                  </div>
                  <div style={{ background: "#EFECE3", borderRadius: 20, height: 7, overflow: "hidden" }}>
                    <div style={{ background: barColor, borderRadius: 20, height: "100%", width: `${pct}%`, animation: "revBar .7s ease both" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#9A9AAB", marginTop: 6 }}>{t.correct}/{t.total} réussies · {t.points} pts</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Dernières tentatives */}
      {recent.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 32, marginBottom: 14 }}>Dernières tentatives</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recent.map((r, i) => {
              const fc = r.result_ok ? P.ok : r.is_half ? P.warn : P.err;
              const clickable = !!r.id;
              return (
                <div key={i}
                  onClick={() => openDetail(r)}
                  style={{ background: "#fff", border: "1px solid #EAE7DE", borderLeft: `4px solid ${fc.pri}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: clickable ? "pointer" : "default", transition: "transform .15s,box-shadow .15s" }}
                  onMouseEnter={e => { if (clickable) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,.06)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span style={{ color: fc.pri, fontWeight: 800, fontSize: 16 }}>{r.result_ok ? "✓" : r.is_half ? "⚡" : "✕"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.topic}</div>
                    <div style={{ fontSize: 12, color: "#9A9AAB" }}>{r.mode === "quiz" ? "Quiz" : "Banque"} · {SUBS[r.subject]?.label || r.subject} · {fmt(r.created_at)}</div>
                  </div>
                  {r.has_photo && <span style={{ fontSize: 13, flexShrink: 0 }} title="Photo de copie disponible">📷</span>}
                  {r.points > 0 && <span style={{ fontSize: 12.5, fontWeight: 700, color: "#191927", whiteSpace: "nowrap", flexShrink: 0 }}>+{r.points} pts</span>}
                  {clickable && <span style={{ color: "#9A9AAB", fontSize: 15, flexShrink: 0 }}>→</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {recent.length === 0 && byTopic.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#9A9AAB" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◈</div>
          <p style={{ fontSize: 14, margin: 0 }}>Pas encore de tentatives enregistrées.<br />Fais un quiz ou utilise la banque d'exercices !</p>
        </div>
      )}
    </div>
  );
}
