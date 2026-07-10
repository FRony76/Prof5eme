import { useEffect, useState } from "react";
import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { fetchAttemptDetail } from "../lib/api.js";
import { useAppState } from "../state/AppContext.jsx";

const FB_BORDER = { ok: "#B6E3CE", half: "#F2D9AC", err: "#F2C9BF" };

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
      <div style={{ animation: "revFade .4s ease both", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
        <p style={{ color: "#9A9AAB", fontSize: 14 }}>Chargement du détail…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div style={{ animation: "revFade .4s ease both", maxWidth: 720, margin: "0 auto" }}>
        <div onClick={goBack} style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>← Ta progression</div>
        <p style={{ color: P.err.txt, fontSize: 14 }}>{error || "Aucune donnée trouvée."}</p>
      </div>
    );
  }

  const cp = P[detail.subject] || P.maths;
  const fc = detail.result_ok ? P.ok : detail.is_half ? P.warn : P.err;
  const fcBorder = detail.result_ok ? FB_BORDER.ok : detail.is_half ? FB_BORDER.half : FB_BORDER.err;
  const fmt = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div style={{ animation: "revFade .4s ease both", maxWidth: 720, margin: "0 auto" }}>
      <div onClick={goBack} style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>← Ta progression</div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
        <span style={{ color: fc.pri, fontWeight: 800, fontSize: 22 }}>{detail.result_ok ? "✓" : detail.is_half ? "⚡" : "✕"}</span>
        <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 26, letterSpacing: "-.5px" }}>{detail.topic}</div>
      </div>
      <p style={{ fontSize: 13, color: "#9A9AAB", margin: "6px 0 24px" }}>
        {detail.mode === "quiz" ? "Quiz" : "Banque"} · {SUBS[detail.subject]?.label || detail.subject} · {fmt(detail.created_at)}
        {detail.points > 0 && <span style={{ marginLeft: 8, fontWeight: 700, color: cp.txt }}>+{detail.points} pts</span>}
      </p>

      {/* Énoncé */}
      {detail.question && (
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "20px 22px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9A9AAB" }}>📝 Énoncé</div>
          <p style={{ fontSize: 15.5, lineHeight: 1.72, color: "#191927", margin: 0, whiteSpace: "pre-wrap" }}>{detail.question}</p>
        </div>
      )}

      {/* Ta réponse */}
      {(detail.photo_data || detail.student_answer) && (
        <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "20px 22px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9A9AAB" }}>✍️ Ta réponse</div>
          {detail.photo_data
            ? <img src={detail.photo_data} alt="Copie de l'élève" style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #EAE7DE" }} />
            : <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#2A2A38", margin: 0, whiteSpace: "pre-wrap" }}>{detail.student_answer}</p>
          }
        </div>
      )}

      {/* Correction */}
      {(detail.feedback || detail.correct_answer) && (
        <div style={{ background: fc.lit, border: `1.5px solid ${fcBorder}`, borderRadius: 18, padding: "20px 22px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: fc.txt }}>📋 Correction</div>
          {detail.feedback && (
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#2A2A38", margin: 0, marginBottom: detail.correct_answer ? 12 : 0, whiteSpace: "pre-wrap" }}>{detail.feedback}</p>
          )}
          {detail.correct_answer && (
            <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, color: "#9A9AAB" }}>Corrigé modèle</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#191927", margin: 0, whiteSpace: "pre-wrap" }}>{detail.correct_answer}</p>
            </div>
          )}
        </div>
      )}

      {/* Badge verdict */}
      <div style={{ background: fc.lit, border: `1.5px solid ${fcBorder}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: fc.pri, fontWeight: 800, fontSize: 18 }}>{detail.result_ok ? "✓" : detail.is_half ? "⚡" : "✕"}</span>
        <span style={{ fontWeight: 700, color: fc.txt, fontSize: 14 }}>
          {detail.result_ok ? "Réussi !" : detail.is_half ? "Presque !" : "À retravailler"}
        </span>
        {detail.points > 0 && (
          <span style={{ marginLeft: "auto", background: P.ok.pri, color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>+{detail.points} pts</span>
        )}
      </div>
    </div>
  );
}
