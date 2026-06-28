import { useRef, useEffect } from "react";
import { P } from "../theme.js";
import { SUBS, LVL, LVL_D } from "../constants.js";
import { callGemini, recordAttempt } from "../lib/api.js";
import PhotoCapture from "../components/PhotoCapture.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function QuizScreen() {
  const { state, dispatch } = useAppState();
  const { subj, topic, level, qData, answer, answerMode, photo,
          showHint, feedback, loading, score, streak, count, phase, celebrated } = state;
  const S = SUBS[subj];
  const c = P[subj];
  const fbc = feedback ? (feedback._ok ? P.ok : feedback._half ? P.warn : P.err) : null;
  const taRef = useRef(null);

  const genQuestion = async () => {
    dispatch({ type: "QUIZ_NEXT" });
    const sys = "Tu es un professeur expert de 5ème en France. RÉPONDS EN JSON VALIDE UNIQUEMENT, zéro backtick, zéro texte autour.";
    const msg = subj === "mixte"
      ? `Génère 1 problème COMPLEXE et ORIGINAL combinant des notions de MATHÉMATIQUES et de PHYSIQUE-CHIMIE du programme de 5ème.
Thème : "${topic}"  —  Niveau : ${level}/3 (${LVL[level]})

Exigences :
- Situation concrète et réaliste avec données numériques précises
- L'élève doit identifier quels outils mathématiques utiliser dans quel contexte physique
- ${level === 1 ? "2 étapes de raisonnement" : level === 2 ? "3 à 4 étapes, formule(s) physique ET calcul mathématique" : "4 à 5 étapes, raisonnement rigoureux, plusieurs formules, résultat avec unité"}
- Le problème doit être RÉSOLVABLE avec le programme de 5ème uniquement

JSON EXACT : {"question":"énoncé complet avec toutes les données","hint":"quelle(s) formule(s) et méthode(s) utiliser","answer_guide":"formule(s) de cours utilisées + démarche complète rédigée pas à pas + résultat final avec unité"}`
      : `Génère 1 question de ${SUBS[subj].label} niveau ${level}/3 (${LVL[level]}: ${LVL_D[level]}) sur le thème "${topic}".
JSON EXACT : {"question":"énoncé complet","hint":"indice utile sans donner la réponse","answer_guide":"formule(s) de cours attendue(s) + démarche rédigée pas à pas + résultat final avec unité"}`;
    try {
      const d = await callGemini(sys, msg);
      dispatch({ type: "QUIZ_LOADED", qData: d });
    } catch {
      dispatch({ type: "QUIZ_LOADED", qData: { question: "Erreur de chargement. Clique sur « Défi suivant ».", hint: "", answer_guide: "" } });
    }
    setTimeout(() => taRef.current?.focus(), 100);
  };

  const validate = async () => {
    const hasAnswer = answerMode === "photo" ? !!photo : !!answer.trim();
    if (!hasAnswer || loading) return;
    dispatch({ type: "VALIDATE_START" });
    try {
      const system = "Tu corriges la réponse d'un élève de 5ème. Bienveillant et pédagogue."
        + " Évalue selon TROIS critères : 1. RÉSULTAT — le résultat final est-il exact avec la bonne unité ? 2. FORMULE — l'élève a-t-il explicitement rappelé la ou les formules de cours ? Réponds null UNIQUEMENT si la question ne nécessite aucune formule."
        + (answerMode === "photo" ? " 3. RÉDACTION — la réponse est-elle rédigée avec étapes ? En mode photo : si la formule est présente mais illisible, réponds false à formula_recalled et mentionne-le dans le feedback." : " 3. RÉDACTION — la réponse est-elle rédigée avec étapes et non un simple résultat brut ?")
        + " JSON VALIDE UNIQUEMENT, zéro backtick.";
      const userMsg = answerMode === "photo"
        ? `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nLa réponse de l'élève est la photo jointe (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo.\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire, précise si un passage était illisible","correct_answer":"rédaction modèle complète : formule(s) + étapes + résultat avec unité, si faux ou partiel"}`
        : `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nRéponse élève : "${answer}"\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire","correct_answer":"rédaction modèle complète : formule(s) + étapes + résultat avec unité, si faux ou partiel"}`;
      const d = await callGemini(system, userMsg, answerMode === "photo" ? photo.base64 : null, answerMode === "photo" ? photo.mediaType : undefined);
      dispatch({ type: "VALIDATE_DONE", d, level });
      // fire-and-forget : un échec ne bloque pas l'UX
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      const streakBonus = ok && state.streak >= 2 ? 5 : 0;
      const pts  = ok ? level * 10 + streakBonus + 2 : half ? level * 3 : 0;
      recordAttempt({ mode: "quiz", subject: subj, topic, level, question: qData?.question,
        answer_mode: answerMode, result_ok: resultOk, is_half: half,
        formula_ok: formulaOk === true ? true : formulaOk === false ? false : null,
        written_ok: writtenOk, points: pts });
    } catch {
      dispatch({ type: "VALIDATE_ERROR" });
    }
  };

  useEffect(() => { genQuestion(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%{transform:scale(0.97)}55%{transform:scale(1.03)}100%{transform:scale(1)}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <button onClick={() => dispatch({ type: "SET", payload: { screen: "setup" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Thème</button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {streak >= 2 && <span style={{ background: P.warn.lit, border: `1px solid ${P.warn.pri}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: P.warn.txt }}>🔥 ×{streak}</span>}
            <span style={{ background: c.lit, border: `1.5px solid ${c.med}`, borderRadius: 20, padding: "4px 14px", fontSize: 14, fontWeight: 700, color: c.txt }}>{score} pts</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ background: c.lit, color: c.txt, border: `1px solid ${c.med}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{S.emoji} {topic}</span>
          <span style={{ background: "#F3F4F6", color: "#6B7280", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>{"●".repeat(level)}{"○".repeat(3 - level)} {LVL[level]}</span>
          {count > 0 && <span style={{ background: "#F3F4F6", color: "#6B7280", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>Défi #{count + 1}</span>}
        </div>

        <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem", minHeight: 110 }}>
          {loading && !qData
            ? <div style={{ textAlign: "center", padding: "1.5rem 0" }}><div style={{ fontSize: 28, marginBottom: 8 }}>{S.emoji}</div><p style={{ color: "#9CA3AF", fontSize: 14, margin: 0 }}>Génération du défi…</p></div>
            : <>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#111827", margin: 0 }}>{qData?.question}</p>
                {showHint && qData?.hint && (
                  <div style={{ marginTop: "1rem", borderLeft: `3px solid ${c.pri}`, padding: "8px 12px", fontSize: 13, color: c.txt, background: c.lit, borderRadius: "0 6px 6px 0", animation: "slideUp 0.2s ease" }}>
                    💡 {qData.hint}
                  </div>
                )}
              </>
          }
        </div>

        {phase === "q" && qData && !loading && (
          <div style={{ animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <button onClick={() => dispatch({ type: "SET", payload: { answerMode: "text" } })}
                style={{ padding: "7px 14px", background: answerMode === "text" ? c.pri : "white", border: `1.5px solid ${answerMode === "text" ? c.pri : "#E5E7EB"}`, borderRadius: 20, color: answerMode === "text" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                ✍️ Texte
              </button>
              <button onClick={() => dispatch({ type: "SET", payload: { answerMode: "photo" } })}
                style={{ padding: "7px 14px", background: answerMode === "photo" ? c.pri : "white", border: `1.5px solid ${answerMode === "photo" ? c.pri : "#E5E7EB"}`, borderRadius: 20, color: answerMode === "photo" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                📷 Photo
              </button>
            </div>

            {answerMode === "text" ? (
              <>
                <textarea ref={taRef} value={answer} onChange={e => dispatch({ type: "SET", payload: { answer: e.target.value } })}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) validate(); }}
                  placeholder="Écris ta réponse ici… (Ctrl+Entrée pour valider)" rows={3}
                  style={{ width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "12px 14px", color: "#111827", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, marginBottom: 4, transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = c.pri}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                />
                <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#9CA3AF" }}>Rappelle la formule du cours et rédige ta démarche (résultat + unité).</p>
              </>
            ) : (
              <PhotoCapture photo={photo} setPhoto={p => dispatch({ type: "SET", payload: { photo: p } })} color={c.pri} />
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => dispatch({ type: "SET", payload: { showHint: !showHint } })}
                style={{ padding: "10px 16px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                💡 {showHint ? "Cacher" : "Indice"}
              </button>
              {(() => { const canSubmit = answerMode === "text" ? !!answer.trim() : !!photo; return (
                <button onClick={validate} disabled={!canSubmit}
                  style={{ flex: 1, padding: "10px", background: canSubmit ? c.pri : "#E5E7EB", border: "none", borderRadius: 8, color: canSubmit ? "white" : "#9CA3AF", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontSize: 14, fontFamily: "inherit", transition: "background 0.2s" }}>
                  ✈ Valider
                </button>
              ); })()}
            </div>
          </div>
        )}
        {loading && phase === "q" && qData && <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, margin: "0.5rem 0" }}>{answerMode === "photo" ? "Lecture de ta copie…" : "Correction en cours…"}</p>}

        {phase === "fb" && feedback && (
          <div style={{ animation: celebrated ? "bounce 0.35s ease" : "slideUp 0.25s ease" }}>
            <div style={{ background: fbc.lit, border: `1.5px solid ${fbc.pri}`, borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{feedback._ok ? "✅" : feedback._half ? "⚡" : "❌"}</span>
                <span style={{ fontWeight: 700, color: fbc.txt, fontSize: 15 }}>{feedback._ok ? "Excellent !" : feedback._half ? "Presque !" : "Pas tout à fait…"}</span>
                {feedback._pts > 0 && <span style={{ marginLeft: "auto", background: P.ok.pri, color: "white", borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 700 }}>+{feedback._pts} pts</span>}
              </div>
              <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: ((!feedback._ok && feedback.correct_answer) || (!feedback._formulaOk || !feedback._writtenOk)) ? 10 : 0 }}>{feedback.feedback}</p>
              {(!feedback._formulaOk || !feedback._writtenOk) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: (!feedback._ok && feedback.correct_answer) ? 8 : 0 }}>
                  {!feedback._formulaOk && <span style={{ fontSize: 12.5, color: P.warn.txt }}>⚠️ Pense à rappeler la ou les formules du cours.</span>}
                  {!feedback._writtenOk && <span style={{ fontSize: 12.5, color: P.warn.txt }}>⚠️ Rédige ta réponse : étapes + résultat avec l'unité.</span>}
                </div>
              )}
              {!feedback._ok && feedback.correct_answer && (
                <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "10px 12px", fontSize: 13 }}>
                  <span style={{ color: "#9CA3AF" }}>Réponse : </span>
                  <span style={{ color: "#111827", fontWeight: 600 }}>{feedback.correct_answer}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => dispatch({ type: "SET", payload: { screen: "setup" } })} style={{ padding: "10px 16px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Changer</button>
              <button onClick={genQuestion} style={{ flex: 1, padding: "10px", background: c.pri, border: "none", borderRadius: 8, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Défi suivant →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
