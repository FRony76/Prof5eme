import { P } from "../theme.js";
import { useAppState } from "../state/AppContext.jsx";

export default function HistoryScreen() {
  const { state, dispatch } = useAppState();
  const { score, streak, historyData } = state;
  const recent = historyData?.recent || [];
  const byTopic = historyData?.byTopic || [];

  const fmt = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  const openDetail = (r) => {
    if (!r.id) return;
    dispatch({ type: "SET", payload: { detailId: r.id, screen: "attempt" } });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Mon historique</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Score cumulé et progression par thème</p>

        {/* Score + streak */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
          <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: P.maths.pri }}>{score}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>points cumulés</div>
          </div>
          <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: P.warn.pri }}>🔥 {streak}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>série en cours</div>
          </div>
        </div>

        {/* Progression par thème */}
        {byTopic.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Maîtrise par thème</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {byTopic.map((t, i) => {
                const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
                const cp = P[t.subject] || P.maths;
                return (
                  <div key={i} style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{t.topic}</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>{t.subject}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cp.txt }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#F3F4F6", borderRadius: 4, height: 6 }}>
                      <div style={{ background: pct >= 80 ? P.ok.pri : pct >= 50 ? P.warn.pri : P.err.pri, borderRadius: 4, height: 6, width: `${pct}%`, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{t.correct}/{t.total} réussies · {t.points} pts</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 20 dernières tentatives */}
        {recent.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Dernières tentatives</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recent.map((r, i) => {
                const cp = P[r.subject] || P.maths;
                const fc = r.result_ok ? P.ok : r.is_half ? P.warn : P.err;
                const clickable = !!r.id;
                return (
                  <div key={i}
                    onClick={() => openDetail(r)}
                    style={{ background: "white", border: `1.5px solid ${fc.pri}`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: clickable ? "pointer" : "default", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (clickable) e.currentTarget.style.background = "#F9FAFB"; }}
                    onMouseLeave={e => { if (clickable) e.currentTarget.style.background = "white"; }}>
                    <span style={{ fontSize: 14 }}>{r.result_ok ? "✅" : r.is_half ? "⚡" : "❌"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.topic}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.mode === "quiz" ? "Quiz" : "Banque"} · {r.subject} · {fmt(r.created_at)}</div>
                    </div>
                    {r.has_photo && <span style={{ fontSize: 13, flexShrink: 0 }} title="Photo de copie disponible">📷</span>}
                    {r.points > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: cp.txt, flexShrink: 0 }}>+{r.points} pts</span>}
                    {clickable && <span style={{ color: "#9CA3AF", fontSize: 14, flexShrink: 0 }}>→</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recent.length === 0 && byTopic.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 14, margin: 0 }}>Pas encore de tentatives enregistrées.<br />Fais un quiz ou utilise la banque d'exercices !</p>
          </div>
        )}
      </div>
    </div>
  );
}
