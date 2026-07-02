import { useEffect, useState } from "react";
import { P } from "../theme.js";
import { fetchAttemptDetail } from "../lib/api.js";
import { useAppState } from "../state/AppContext.jsx";

export default function AttemptDetailScreen() {
  const { state, dispatch } = useAppState();
  const { detailId } = state;
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!detailId) return;
    setLoading(true);
    setError(null);
    fetchAttemptDetail(detailId)
      .then(d => { setDetail(d); setLoading(false); })
      .catch(() => { setError("Impossible de charger le détail."); setLoading(false); });
  }, [detailId]);

  const goBack = () => dispatch({ type: "SET", payload: { screen: "history" } });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9CA3AF", fontSize: 14 }}>Chargement du détail…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <button onClick={goBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
          <p style={{ color: P.err.txt, fontSize: 14 }}>{error || "Aucune donnée trouvée."}</p>
        </div>
      </div>
    );
  }

  const cp = P[detail.subject] || P.maths;
  const fc = detail.result_ok ? P.ok : detail.is_half ? P.warn : P.err;
  const fmt = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" }}>
          <span style={{ fontSize: 20 }}>{detail.result_ok ? "✅" : detail.is_half ? "⚡" : "❌"}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>{detail.topic}</h2>
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 1.75rem" }}>
          {detail.mode === "quiz" ? "Quiz" : "Banque"} · {detail.subject} · {fmt(detail.created_at)}
          {detail.points > 0 && <span style={{ marginLeft: 8, fontWeight: 700, color: cp.txt }}>+{detail.points} pts</span>}
        </p>

        {/* Énoncé */}
        {detail.question && (
          <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9CA3AF" }}>📝 Énoncé</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#111827", margin: 0, whiteSpace: "pre-wrap" }}>{detail.question}</p>
          </div>
        )}

        {/* Ta réponse */}
        {(detail.photo_data || detail.student_answer) && (
          <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9CA3AF" }}>✍️ Ta réponse</div>
            {detail.photo_data
              ? <img src={detail.photo_data} alt="Copie de l'élève" style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #E5E7EB" }} />
              : <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0, whiteSpace: "pre-wrap" }}>{detail.student_answer}</p>
            }
          </div>
        )}

        {/* Correction */}
        {(detail.feedback || detail.correct_answer) && (
          <div style={{ background: fc.lit, border: `1.5px solid ${fc.pri}`, borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: fc.txt }}>📋 Correction</div>
            {detail.feedback && (
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0, marginBottom: detail.correct_answer ? 12 : 0, whiteSpace: "pre-wrap" }}>{detail.feedback}</p>
            )}
            {detail.correct_answer && (
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, color: "#9CA3AF" }}>Corrigé modèle</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: "#111827", margin: 0, whiteSpace: "pre-wrap" }}>{detail.correct_answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Badge verdict */}
        <div style={{ background: fc.lit, border: `1.5px solid ${fc.pri}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{detail.result_ok ? "✅" : detail.is_half ? "⚡" : "❌"}</span>
          <span style={{ fontWeight: 700, color: fc.txt, fontSize: 14 }}>
            {detail.result_ok ? "Réussi !" : detail.is_half ? "Presque !" : "À retravailler"}
          </span>
          {detail.points > 0 && (
            <span style={{ marginLeft: "auto", background: P.ok.pri, color: "white", borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 700 }}>+{detail.points} pts</span>
          )}
        </div>
      </div>
    </div>
  );
}
