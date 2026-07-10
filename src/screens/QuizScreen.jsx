import { useRef, useEffect } from "react";
import { P } from "../theme.js";
import { SUBS, LVL, LVL_D } from "../constants.js";
import { callGemini, recordAttempt } from "../lib/api.js";
import PhotoCapture from "../components/PhotoCapture.jsx";
import { useAppState } from "../state/AppContext.jsx";

const FB_BORDER = { ok: "#B6E3CE", half: "#F2D9AC", err: "#F2C9BF" };

export default function QuizScreen() {
  const { state, dispatch } = useAppState();
  const { subj, topic, level, qData, answer, answerMode, photo,
          showHint, feedback, loading, score, streak, count, phase, celebrated } = state;
  const S = SUBS[subj];
  const c = P[subj];
  const fbc = feedback ? (feedback._ok ? P.ok : feedback._half ? P.warn : P.err) : null;
  const fbBorder = feedback ? (feedback._ok ? FB_BORDER.ok : feedback._half ? FB_BORDER.half : FB_BORDER.err) : null;
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
- MISE EN FORME de "question" : va à la ligne (\\n) entre la mise en situation, chaque donnée importante et la ou les questions posées ; si plusieurs sous-questions, les écrire a) b) c) chacune sur sa propre ligne

JSON EXACT : {"question":"énoncé complet avec toutes les données","hint":"quelle(s) formule(s) et méthode(s) utiliser","answer_guide":"formule(s) de cours utilisées + démarche complète rédigée pas à pas + résultat final avec unité"}`
      : `Génère 1 question de ${SUBS[subj].label} niveau ${level}/3 (${LVL[level]}: ${LVL_D[level]}) sur le thème "${topic}".
JSON EXACT : {"question":"énoncé complet, avec un retour à la ligne (\\n) entre la situation, les données et la question ; sous-questions a) b) chacune sur sa ligne","hint":"indice utile sans donner la réponse","answer_guide":"formule(s) de cours attendue(s) + démarche rédigée pas à pas + résultat final avec unité"}`;
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
        ? `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nLa réponse de l'élève est la photo jointe (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo.\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire, précise si un passage était illisible (une phrase par ligne, séparées par \\n)","correct_answer":"rédaction modèle complète si faux ou partiel, avec un retour à la ligne (\\n) entre la formule, chaque étape du calcul et le résultat final avec unité"}`
        : `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nRéponse élève : "${answer}"\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire (une phrase par ligne, séparées par \\n)","correct_answer":"rédaction modèle complète si faux ou partiel, avec un retour à la ligne (\\n) entre la formule, chaque étape du calcul et le résultat final avec unité"}`;
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
      recordAttempt({
        mode: "quiz", subject: subj, topic, level, question: qData?.question,
        answer_mode: answerMode, result_ok: resultOk, is_half: half,
        formula_ok: formulaOk === true ? true : formulaOk === false ? false : null,
        written_ok: writtenOk, points: pts,
        student_answer: answerMode === "text" ? answer : null,
        photo_data: answerMode === "photo" ? photo?.dataUrl : null,
        feedback: d.feedback,
        correct_answer: d.correct_answer,
      });
    } catch {
      dispatch({ type: "VALIDATE_ERROR" });
    }
  };

  useEffect(() => { genQuestion(); }, []);

  return (
    <div style={{ animation: "revFade .4s ease both", maxWidth: 680, margin: "0 auto" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%{transform:scale(0.97)}55%{transform:scale(1.03)}100%{transform:scale(1)}}`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })} style={{ fontSize: 20, color: "#6B6B7B", cursor: "pointer" }}>✕</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {streak >= 2 && <span style={{ background: P.warn.lit, border: `1px solid ${P.warn.pri}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: P.warn.txt }}>🔥 ×{streak}</span>}
          <span style={{ background: "#fff", border: "1px solid #E1DDD2", borderRadius: 20, padding: "6px 14px", fontSize: 14, fontWeight: 700, color: "#191927" }}><span style={{ color: "#E0972B" }}>◆</span> {score} pts</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ background: c.lit, color: c.txt, fontWeight: 700, fontSize: 12.5, padding: "5px 12px", borderRadius: 20 }}>{S.mono} {topic}</span>
        <span style={{ background: "#F1EFE8", color: "#6B6B7B", borderRadius: 20, padding: "5px 12px", fontSize: 12 }}>{"●".repeat(level)}{"○".repeat(3 - level)} {LVL[level]}</span>
        {count > 0 && <span style={{ background: "#F1EFE8", color: "#6B6B7B", borderRadius: 20, padding: "5px 12px", fontSize: 12 }}>Défi #{count + 1}</span>}
      </div>

      <div style={{ background: "#fff", border: "1px solid #EAE7DE", borderRadius: 18, padding: "28px 26px", marginBottom: 20, minHeight: 120 }}>
        {loading && !qData
          ? <div style={{ textAlign: "center", padding: "1.5rem 0" }}><div style={{ fontSize: 28, marginBottom: 8, color: c.pri }}>{S.mono}</div><p style={{ color: "#9A9AAB", fontSize: 14, margin: 0 }}>Génération du défi…</p></div>
          : <>
              <p style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 24, letterSpacing: "-.5px", lineHeight: 1.3, color: "#191927", margin: 0, whiteSpace: "pre-wrap" }}>{qData?.question}</p>
              {showHint && qData?.hint && (
                <div style={{ marginTop: "1rem", borderLeft: `3px solid ${c.pri}`, padding: "10px 14px", fontSize: 13.5, color: c.txt, background: c.lit, borderRadius: "0 10px 10px 0", animation: "slideUp 0.2s ease", whiteSpace: "pre-wrap" }}>
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
              style={{ padding: "8px 15px", background: answerMode === "text" ? c.pri : "white", border: `1.5px solid ${answerMode === "text" ? c.pri : "#E1DDD2"}`, borderRadius: 20, color: answerMode === "text" ? "white" : "#6B6B7B", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              ✍️ Texte
            </button>
            <button onClick={() => dispatch({ type: "SET", payload: { answerMode: "photo" } })}
              style={{ padding: "8px 15px", background: answerMode === "photo" ? c.pri : "white", border: `1.5px solid ${answerMode === "photo" ? c.pri : "#E1DDD2"}`, borderRadius: 20, color: answerMode === "photo" ? "white" : "#6B6B7B", fontWeight: 600, cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              📷 Photo
            </button>
          </div>

          {answerMode === "text" ? (
            <>
              <textarea ref={taRef} value={answer} onChange={e => dispatch({ type: "SET", payload: { answer: e.target.value } })}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) validate(); }}
                placeholder="Écris ta réponse ici… (Ctrl+Entrée pour valider)" rows={3}
                style={{ width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, padding: "14px 16px", color: "#191927", fontSize: 14.5, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, marginBottom: 4, transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = c.pri}
                onBlur={e => e.target.style.borderColor = "#E1DDD2"}
              />
              <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#9A9AAB" }}>Rappelle la formule du cours et rédige ta démarche (résultat + unité).</p>
            </>
          ) : (
            <PhotoCapture photo={photo} setPhoto={p => dispatch({ type: "SET", payload: { photo: p } })} color={c.pri} />
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => dispatch({ type: "SET", payload: { showHint: !showHint } })}
              style={{ padding: "12px 18px", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, color: "#6B6B7B", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              💡 {showHint ? "Cacher" : "Indice"}
            </button>
            {(() => { const canSubmit = answerMode === "text" ? !!answer.trim() : !!photo; return (
              <button onClick={validate} disabled={!canSubmit}
                style={{ flex: 1, padding: "12px", background: canSubmit ? c.pri : "#C7C3B8", border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontSize: 14.5, fontFamily: "inherit", transition: "background 0.2s" }}>
                Valider
              </button>
            ); })()}
          </div>
        </div>
      )}
      {loading && phase === "q" && qData && <p style={{ textAlign: "center", color: "#9A9AAB", fontSize: 13, margin: "0.5rem 0" }}>{answerMode === "photo" ? "Lecture de ta copie…" : "Correction en cours…"}</p>}

      {phase === "fb" && feedback && (
        <div style={{ animation: celebrated ? "bounce 0.35s ease" : "slideUp 0.25s ease" }}>
          <div style={{ background: fbc.lit, border: `1.5px solid ${fbBorder}`, borderRadius: 16, padding: "20px 22px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{feedback._ok ? "✅" : feedback._half ? "⚡" : "❌"}</span>
              <span style={{ fontWeight: 700, color: fbc.txt, fontSize: 15 }}>{feedback._ok ? "Excellent !" : feedback._half ? "Presque !" : "Pas tout à fait…"}</span>
              {feedback._pts > 0 && <span style={{ marginLeft: "auto", background: P.ok.pri, color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>+{feedback._pts} pts</span>}
            </div>
            <p style={{ color: "#2A2A38", fontSize: 14.5, lineHeight: 1.7, margin: 0, marginBottom: ((!feedback._ok && feedback.correct_answer) || (!feedback._formulaOk || !feedback._writtenOk)) ? 10 : 0, whiteSpace: "pre-wrap" }}>{feedback.feedback}</p>
            {(!feedback._formulaOk || !feedback._writtenOk) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: (!feedback._ok && feedback.correct_answer) ? 8 : 0 }}>
                {!feedback._formulaOk && <span style={{ fontSize: 12.5, color: P.warn.txt }}>⚠️ Pense à rappeler la ou les formules du cours.</span>}
                {!feedback._writtenOk && <span style={{ fontSize: 12.5, color: P.warn.txt }}>⚠️ Rédige ta réponse : étapes + résultat avec l'unité.</span>}
              </div>
            )}
            {!feedback._ok && feedback.correct_answer && (
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 14, padding: "12px 14px", fontSize: 13 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, color: "#9A9AAB" }}>Réponse modèle</div>
                <p style={{ color: "#191927", fontWeight: 600, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{feedback.correct_answer}</p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })} style={{ padding: "12px 18px", background: "white", border: "1.5px solid #E1DDD2", borderRadius: 14, color: "#6B6B7B", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Retour</button>
            <button onClick={genQuestion} style={{ flex: 1, padding: "12px", background: c.pri, border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14.5, fontFamily: "inherit" }}>Défi suivant →</button>
          </div>
        </div>
      )}
    </div>
  );
}
