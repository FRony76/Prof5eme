import { P } from "../theme.js";
import { SUBS, LVL } from "../constants.js";
import { EXERCISES } from "../data/exercises.js";
import { callGemini, recordAttempt } from "../lib/api.js";
import PhotoCapture from "../components/PhotoCapture.jsx";
import { useAppState } from "../state/AppContext.jsx";

const FB_BORDER = { ok: "#B6E3CE", half: "#F2D9AC", err: "#F2C9BF" };

export default function BankView() {
  const { state, dispatch } = useAppState();
  const { subj, topic, bankIdx, bankShowHint, bankShowAnswer,
          bankAnswerMode, bankAnswer, bankPhoto, bankFeedback, bankChecking } = state;
  const list = EXERCISES[subj][topic];
  const bp = P[subj];
  const S = SUBS[subj];
  const ex = list[bankIdx];
  const lvlLabel = LVL[ex.lvl];

  const checkBankAnswer = async () => {
    const hasAnswer = bankAnswerMode === "photo" ? !!bankPhoto : !!bankAnswer.trim();
    if (!hasAnswer || bankChecking) return;
    dispatch({ type: "CHECK_BANK_START" });
    try {
      const system = "Tu corriges la réponse d'un élève de 5ème par rapport à un corrigé de référence. Bienveillant et pédagogue."
        + " Évalue selon TROIS critères : 1. RÉSULTAT — le résultat final est-il exact avec la bonne unité ? 2. FORMULE — l'élève a-t-il explicitement rappelé la ou les formules de cours ? Réponds null UNIQUEMENT si l'exercice ne nécessite aucune formule."
        + (bankAnswerMode === "photo" ? " 3. RÉDACTION — la réponse est-elle rédigée avec étapes ? En mode photo : si la formule est présente mais illisible, réponds false à formula_recalled et mentionne-le dans le feedback." : " 3. RÉDACTION — la réponse est-elle rédigée avec étapes et non un simple résultat brut ?")
        + " JSON VALIDE UNIQUEMENT, zéro backtick.";
      const userMsg = bankAnswerMode === "photo"
        ? `Exercice : "${ex.q}"\nCorrigé de référence : "${ex.a}"\nLa réponse de l'élève est la photo jointe (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo, en te basant sur le corrigé de référence.\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire, précise si un passage était illisible (une phrase par ligne, séparées par \\n)"}`
        : `Exercice : "${ex.q}"\nCorrigé de référence : "${ex.a}"\nRéponse élève : "${bankAnswer}"\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire (une phrase par ligne, séparées par \\n)"}`;
      const d = await callGemini(system, userMsg, bankAnswerMode === "photo" ? bankPhoto.base64 : null, bankAnswerMode === "photo" ? bankPhoto.mediaType : undefined);
      dispatch({ type: "CHECK_BANK_DONE", d });
      // fire-and-forget
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      recordAttempt({
        mode: "bank", subject: subj, topic, level: null,
        question: ex.q, answer_mode: bankAnswerMode, result_ok: resultOk, is_half: half,
        formula_ok: formulaOk === true ? true : formulaOk === false ? false : null,
        written_ok: writtenOk, points: 0,
        student_answer: bankAnswerMode === "text" ? bankAnswer : null,
        photo_data: bankAnswerMode === "photo" ? bankPhoto?.dataUrl : null,
        feedback: d.feedback,
        correct_answer: ex.a,
      });
    } catch {
      dispatch({ type: "CHECK_BANK_ERROR" });
    }
  };

  const nav = (idx) => dispatch({ type: "BANK_NAV", idx });

  const fc = bankFeedback ? (bankFeedback._ok ? P.ok : bankFeedback._half ? P.warn : P.err) : null;
  const fcBorder = bankFeedback ? (bankFeedback._ok ? FB_BORDER.ok : bankFeedback._half ? FB_BORDER.half : FB_BORDER.err) : null;

  return (
    <div style={{ animation: "revFade .4s ease both", maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })}
          style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer" }}>
          ← {S.label}
        </div>
        <span style={{ background: bp.lit, color: bp.txt, fontWeight: 700, fontSize: 12.5, padding: "5px 12px", borderRadius: 20 }}>{topic}</span>
        <span style={{ background: "#F1EFE8", color: "#6B6B7B", borderRadius: 20, padding: "5px 12px", fontSize: 12 }}>{"●".repeat(ex.lvl)}{"○".repeat(3 - ex.lvl)} {lvlLabel}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#9A9AAB" }}>Exercice {bankIdx + 1} / {list.length}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 280, justifyContent: "flex-end" }}>
          {list.map((_, i) => <div key={i} title={`Exercice ${i + 1}`} onClick={() => nav(i)} style={{ width: 8, height: 8, borderRadius: "50%", cursor: "pointer", background: i === bankIdx ? bp.pri : "#E1DDD2" }} />)}
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid #EAE7DE", borderRadius: 18, padding: "26px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9A9AAB" }}>📝 Exercice</div>
          <p style={{ fontSize: 16.5, lineHeight: 1.72, color: "#191927", fontWeight: 600, margin: 0, whiteSpace: "pre-wrap" }}>{ex.q}</p>
        </div>

        <div style={{ borderTop: "1px solid #EAE7DE", paddingTop: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9A9AAB" }}>🔎 Vérifie ta réponse</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button onClick={() => dispatch({ type: "SET", payload: { bankAnswerMode: "text" } })}
              style={{ padding: "8px 15px", background: bankAnswerMode === "text" ? bp.pri : "white", border: `1.5px solid ${bankAnswerMode === "text" ? bp.pri : "#E1DDD2"}`, borderRadius: 20, color: bankAnswerMode === "text" ? "white" : "#6B6B7B", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              ✍️ Texte
            </button>
            <button onClick={() => dispatch({ type: "SET", payload: { bankAnswerMode: "photo" } })}
              style={{ padding: "8px 15px", background: bankAnswerMode === "photo" ? bp.pri : "white", border: `1.5px solid ${bankAnswerMode === "photo" ? bp.pri : "#E1DDD2"}`, borderRadius: 20, color: bankAnswerMode === "photo" ? "white" : "#6B6B7B", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              📷 Photo
            </button>
          </div>

          {bankAnswerMode === "text" ? (
            <>
              <textarea value={bankAnswer} onChange={e => dispatch({ type: "SET", payload: { bankAnswer: e.target.value } })}
                placeholder="Écris ta réponse ici…" rows={3}
                style={{ width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, padding: "14px 16px", color: "#191927", fontSize: 14.5, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, marginBottom: 4 }}
              />
              <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#9A9AAB" }}>Rappelle la formule du cours et rédige ta démarche (résultat + unité).</p>
            </>
          ) : (
            <PhotoCapture photo={bankPhoto} setPhoto={p => dispatch({ type: "SET", payload: { bankPhoto: p } })} color={bp.pri} />
          )}

          {(() => { const canSubmit = (bankAnswerMode === "text" ? !!bankAnswer.trim() : !!bankPhoto) && !bankChecking; return (
            <button onClick={checkBankAnswer} disabled={!canSubmit}
              style={{ width: "100%", padding: "12px", background: canSubmit ? bp.pri : "#C7C3B8", border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontSize: 14.5, fontFamily: "inherit" }}>
              {bankChecking ? (bankAnswerMode === "photo" ? "Lecture de ta copie…" : "Correction en cours…") : "✓ Faire corriger ma réponse"}
            </button>
          ); })()}

          {bankFeedback && (
            <div style={{ background: fc.lit, border: `1.5px solid ${fcBorder}`, borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{bankFeedback._ok ? "✅" : bankFeedback._half ? "⚡" : "❌"}</span>
                <span style={{ fontWeight: 700, color: fc.txt, fontSize: 13 }}>{bankFeedback._ok ? "Excellent !" : bankFeedback._half ? "Presque !" : "Pas tout à fait…"}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#2A2A38", lineHeight: 1.6, marginBottom: (!bankFeedback._formulaOk || !bankFeedback._writtenOk) ? 8 : 0, whiteSpace: "pre-wrap" }}>{bankFeedback.feedback}</p>
              {(!bankFeedback._formulaOk || !bankFeedback._writtenOk) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {!bankFeedback._formulaOk && <span style={{ fontSize: 12, color: P.warn.txt }}>⚠️ Pense à rappeler la ou les formules du cours.</span>}
                  {!bankFeedback._writtenOk && <span style={{ fontSize: 12, color: P.warn.txt }}>⚠️ Rédige ta réponse : étapes + résultat avec l'unité.</span>}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => dispatch({ type: "SET", payload: { bankShowHint: !bankShowHint } })} style={{ padding: "10px 16px", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, color: "#6B6B7B", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            💡 {bankShowHint ? "Cacher l'indice" : "Voir l'indice"}
          </button>
          <button onClick={() => dispatch({ type: "SET", payload: { bankShowAnswer: !bankShowAnswer } })} style={{ padding: "10px 16px", background: bankShowAnswer ? bp.pri : "white", border: `1.5px solid ${bankShowAnswer ? bp.pri : "#E1DDD2"}`, borderRadius: 14, color: bankShowAnswer ? "white" : "#6B6B7B", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: bankShowAnswer ? 600 : 400 }}>
            ✓ {bankShowAnswer ? "Cacher le corrigé" : "Voir le corrigé"}
          </button>
        </div>

        {bankShowHint && (
          <div style={{ borderLeft: `3px solid ${bp.pri}`, padding: "10px 14px", fontSize: 13.5, color: bp.txt, background: bp.lit, borderRadius: "0 10px 10px 0" }}>
            💡 {ex.hint}
          </div>
        )}
        {bankShowAnswer && (
          <div style={{ borderTop: `1px solid ${bp.med}`, paddingTop: 18, background: bp.lit, margin: "0 -26px -26px", padding: "18px 26px 26px", borderRadius: "0 0 18px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: bp.txt }}>✓ Corrigé</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: bp.txt, fontWeight: 400, margin: 0, whiteSpace: "pre-wrap" }}>{ex.a}</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={() => nav(Math.max(0, bankIdx - 1))} disabled={bankIdx === 0}
          style={{ flex: 1, padding: "12px", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, color: bankIdx === 0 ? "#C7C3B8" : "#191927", cursor: bankIdx === 0 ? "not-allowed" : "pointer", fontSize: 14, fontFamily: "inherit" }}>
          ← Précédent
        </button>
        <button onClick={() => nav(Math.min(list.length - 1, bankIdx + 1))} disabled={bankIdx === list.length - 1}
          style={{ flex: 1, padding: "12px", background: bankIdx === list.length - 1 ? "#EFECE3" : bp.pri, border: "none", borderRadius: 14, color: bankIdx === list.length - 1 ? "#9A9AAB" : "white", cursor: bankIdx === list.length - 1 ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
          Suivant →
        </button>
      </div>
    </div>
  );
}
