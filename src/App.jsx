import { useState, useRef, useEffect } from "react";
import { P } from "./theme.js";
import { APP_VERSION, SUBS, LVL, LVL_D } from "./constants.js";
import { CARDS } from "./data/cards.js";
import { EXERCISES } from "./data/exercises.js";
import { callGemini } from "./lib/api.js";
import PhotoCapture from "./components/PhotoCapture.jsx";
import Dot from "./components/Dot.jsx";
import CourseView from "./components/CourseView.jsx";
import LoginScreen from "./components/LoginScreen.jsx";

export default function App() {
  const [authed, setAuthed] = useState(null); // null = en cours de vérification
  const [screen, setScreen] = useState("home");
  const [subj, setSubj] = useState(null);
  const [topic, setTopic] = useState(null);
  const [level, setLevel] = useState(2);
  const [qData, setQData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answerMode, setAnswerMode] = useState("text");
  const [photo, setPhoto] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("q");
  const [celebrated, setCelebrated] = useState(false);
  const [cardsSubj, setCardsSubj] = useState("maths");
  const [cardsTopic, setCardsTopic] = useState(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [bankSubj, setBankSubj] = useState("maths");
  const [bankTopic, setBankTopic] = useState(null);
  const [bankIdx, setBankIdx] = useState(0);
  const [bankShowHint, setBankShowHint] = useState(false);
  const [bankShowAnswer, setBankShowAnswer] = useState(false);
  const [bankAnswerMode, setBankAnswerMode] = useState("text");
  const [bankAnswer, setBankAnswer] = useState("");
  const [bankPhoto, setBankPhoto] = useState(null);
  const [bankFeedback, setBankFeedback] = useState(null);
  const [bankChecking, setBankChecking] = useState(false);
  const taRef = useRef(null);

  // Vérifie la session au montage et écoute les expirations émises par callGemini
  useEffect(() => {
    let alive = true;
    fetch("/api/session", { headers: { Accept: "application/json" } })
      .then(r => (r.ok ? r.json() : { authed: false }))
      .then(d => { if (alive) setAuthed(!!d.authed); })
      .catch(() => { if (alive) setAuthed(false); });
    const onExpired = () => setAuthed(false);
    window.addEventListener("auth-expired", onExpired);
    return () => { alive = false; window.removeEventListener("auth-expired", onExpired); };
  }, []);

  const logout = async () => {
    try { await fetch("/api/logout", { method: "POST" }); } catch { /* ignore */ }
    setAuthed(false);
  };

  const S = subj ? SUBS[subj] : null;
  const c = subj ? P[subj] : null;
  const fbc = feedback ? (feedback._ok ? P.ok : feedback._half ? P.warn : P.err) : null;

  const genQuestion = async () => {
    setLoading(true); setQData(null); setFeedback(null);
    setAnswer(""); setAnswerMode("text"); setPhoto(null); setShowHint(false); setPhase("q"); setCelebrated(false);
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
      setQData(d);
    } catch { setQData({ question: "Erreur de chargement. Clique sur « Défi suivant ».", hint: "", answer_guide: "" }); }
    setLoading(false);
    setTimeout(() => taRef.current?.focus(), 100);
  };

  const validate = async () => {
    const hasAnswer = answerMode === "photo" ? !!photo : !!answer.trim();
    if (!hasAnswer || loading) return;
    setLoading(true);
    try {
      const system = "Tu corriges la réponse d'un élève de 5ème. Bienveillant et pédagogue."
        + " Évalue selon TROIS critères : 1. RÉSULTAT — le résultat final est-il exact avec la bonne unité ? 2. FORMULE — l'élève a-t-il explicitement rappelé la ou les formules de cours ? Réponds null UNIQUEMENT si la question ne nécessite aucune formule."
        + (answerMode === "photo" ? " 3. RÉDACTION — la réponse est-elle rédigée avec étapes ? En mode photo : si la formule est présente mais illisible, réponds false à formula_recalled et mentionne-le dans le feedback." : " 3. RÉDACTION — la réponse est-elle rédigée avec étapes et non un simple résultat brut ?")
        + " JSON VALIDE UNIQUEMENT, zéro backtick.";
      const userMsg = answerMode === "photo"
        ? `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nLa réponse de l'élève est la photo jointe (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo.\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire, précise si un passage était illisible","correct_answer":"rédaction modèle complète : formule(s) + étapes + résultat avec unité, si faux ou partiel"}`
        : `Question : "${qData.question}"\nGuide : "${qData.answer_guide}"\nRéponse élève : "${answer}"\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire","correct_answer":"rédaction modèle complète : formule(s) + étapes + résultat avec unité, si faux ou partiel"}`;
      const d = await callGemini(system, userMsg, answerMode === "photo" ? photo.base64 : null, answerMode === "photo" ? photo.mediaType : undefined);
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      const streakBonus = ok && streak >= 2 ? 5 : 0;
      const pts = ok ? level * 10 + streakBonus + 2 : half ? level * 3 : 0;
      d._ok = ok; d._half = half; d._pts = pts;
      d._formulaOk = formulaOk; d._writtenOk = writtenOk;
      setFeedback(d); setPhase("fb"); setCount(k => k + 1);
      if (ok) { setScore(s => s + pts); setStreak(s => s + 1); setCelebrated(true); }
      else { if (half) setScore(s => s + pts); setStreak(0); }
    } catch { setFeedback({ _ok: false, _half: false, feedback: "Erreur de correction.", correct_answer: "" }); setPhase("fb"); }
    setLoading(false);
  };

  const checkBankAnswer = async (ex) => {
    const hasAnswer = bankAnswerMode === "photo" ? !!bankPhoto : !!bankAnswer.trim();
    if (!hasAnswer || bankChecking) return;
    setBankChecking(true);
    try {
      const system = "Tu corriges la réponse d'un élève de 5ème par rapport à un corrigé de référence. Bienveillant et pédagogue."
        + " Évalue selon TROIS critères : 1. RÉSULTAT — le résultat final est-il exact avec la bonne unité ? 2. FORMULE — l'élève a-t-il explicitement rappelé la ou les formules de cours ? Réponds null UNIQUEMENT si l'exercice ne nécessite aucune formule."
        + (bankAnswerMode === "photo" ? " 3. RÉDACTION — la réponse est-elle rédigée avec étapes ? En mode photo : si la formule est présente mais illisible, réponds false à formula_recalled et mentionne-le dans le feedback." : " 3. RÉDACTION — la réponse est-elle rédigée avec étapes et non un simple résultat brut ?")
        + " JSON VALIDE UNIQUEMENT, zéro backtick.";
      const userMsg = bankAnswerMode === "photo"
        ? `Exercice : "${ex.q}"\nCorrigé de référence : "${ex.a}"\nLa réponse de l'élève est la photo jointe (copie manuscrite). Analyse la démarche et le résultat visibles sur la photo, en te basant sur le corrigé de référence.\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire, précise si un passage était illisible"}`
        : `Exercice : "${ex.q}"\nCorrigé de référence : "${ex.a}"\nRéponse élève : "${bankAnswer}"\nJSON : {"result_correct":true,"formula_recalled":true,"well_written":true,"feedback":"2-3 phrases encourageantes qui disent précisément ce qui manque si nécessaire"}`;
      const d = await callGemini(system, userMsg, bankAnswerMode === "photo" ? bankPhoto.base64 : null, bankAnswerMode === "photo" ? bankPhoto.mediaType : undefined);
      const resultOk  = d.result_correct === true || d.result_correct === "true";
      const formulaOk = d.formula_recalled !== false && d.formula_recalled !== "false";
      const writtenOk = d.well_written === true || d.well_written === "true";
      const ok   = resultOk && formulaOk && writtenOk;
      const half = !ok && resultOk;
      setBankFeedback({ _ok: ok, _half: half, feedback: d.feedback, _formulaOk: formulaOk, _writtenOk: writtenOk });
    } catch {
      setBankFeedback({ _ok: false, _half: false, feedback: "Erreur de correction, réessaie." });
    }
    setBankChecking(false);
  };

  const resetBankCheck = () => { setBankAnswer(""); setBankPhoto(null); setBankFeedback(null); setBankAnswerMode("text"); };

  const px = "2rem 1.5rem";
  const cardStyle = (selected, color) => ({
    background: selected ? P[color]?.lit || "#F5F3FF" : "white",
    border: `1.5px solid ${selected ? (P[color]?.pri || "#7C3AED") : "#E5E7EB"}`,
    borderRadius: 8, padding: "10px 14px", cursor: "pointer",
    fontSize: 13, textAlign: "left", fontFamily: "inherit",
    color: selected ? (P[color]?.txt || "#5B21B6") : "#374151",
    fontWeight: selected ? 600 : 400, transition: "all 0.15s"
  });

  // ── AUTHENTIFICATION ────────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", color: "#9CA3AF", fontSize: 14 }}>
        Chargement…
      </div>
    );
  }
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  // ── BANK VIEW (liste d'exercices) ──────────────────────────────────────────
  if (screen === "bank-view") {
    const list = EXERCISES[bankSubj][bankTopic];
    const bp = P[bankSubj];
    const ex = list[bankIdx];
    const lvlLabel = LVL[ex.lvl];
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button onClick={() => setScreen("bank")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Retour</button>
            <span style={{ background: bp.lit, color: bp.txt, border: `1px solid ${bp.med}`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{bankTopic}</span>
            <span style={{ background: "#F3F4F6", color: "#6B7280", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>{"●".repeat(ex.lvl)}{"○".repeat(3 - ex.lvl)} {lvlLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Exercice {bankIdx + 1} / {list.length}</p>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 280, justifyContent: "flex-end" }}>
              {list.map((e, i) => <div key={i} title={`Exercice ${i + 1}`} onClick={() => { setBankIdx(i); setBankShowHint(false); setBankShowAnswer(false); resetBankCheck(); }} style={{ width: 8, height: 8, borderRadius: "50%", cursor: "pointer", background: i === bankIdx ? bp.pri : "#E5E7EB" }} />)}
            </div>
          </div>

          <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "1.75rem", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9CA3AF" }}>📝 Exercice</div>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#111827", fontWeight: 600, margin: 0, whiteSpace: "pre-wrap" }}>{ex.q}</p>
            </div>

            <div style={{ borderTop: "1.5px solid #F3F4F6", paddingTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: "#9CA3AF" }}>🔎 Vérifie ta réponse</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <button onClick={() => setBankAnswerMode("text")}
                  style={{ padding: "7px 14px", background: bankAnswerMode === "text" ? bp.pri : "white", border: `1.5px solid ${bankAnswerMode === "text" ? bp.pri : "#E5E7EB"}`, borderRadius: 20, color: bankAnswerMode === "text" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                  ✍️ Texte
                </button>
                <button onClick={() => setBankAnswerMode("photo")}
                  style={{ padding: "7px 14px", background: bankAnswerMode === "photo" ? bp.pri : "white", border: `1.5px solid ${bankAnswerMode === "photo" ? bp.pri : "#E5E7EB"}`, borderRadius: 20, color: bankAnswerMode === "photo" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                  📷 Photo
                </button>
              </div>

              {bankAnswerMode === "text" ? (
                <>
                  <textarea value={bankAnswer} onChange={e => setBankAnswer(e.target.value)}
                    placeholder="Écris ta réponse ici…" rows={3}
                    style={{ width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "12px 14px", color: "#111827", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, marginBottom: 4 }}
                  />
                  <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#9CA3AF" }}>Rappelle la formule du cours et rédige ta démarche (résultat + unité).</p>
                </>
              ) : (
                <PhotoCapture photo={bankPhoto} setPhoto={setBankPhoto} color={bp.pri} />
              )}

              {(() => { const canSubmitBank = (bankAnswerMode === "text" ? !!bankAnswer.trim() : !!bankPhoto) && !bankChecking; return (
              <button onClick={() => checkBankAnswer(ex)} disabled={!canSubmitBank}
                style={{ width: "100%", padding: "10px", background: canSubmitBank ? bp.pri : "#E5E7EB", border: "none", borderRadius: 8, color: canSubmitBank ? "white" : "#9CA3AF", fontWeight: 700, cursor: canSubmitBank ? "pointer" : "not-allowed", fontSize: 14, fontFamily: "inherit" }}>
                {bankChecking ? (bankAnswerMode === "photo" ? "Lecture de ta copie…" : "Correction en cours…") : "✓ Faire corriger ma réponse"}
              </button>
              ); })()}

              {bankFeedback && (() => {
                const fc = bankFeedback._ok ? P.ok : bankFeedback._half ? P.warn : P.err;
                return (
                  <div style={{ background: fc.lit, border: `1.5px solid ${fc.pri}`, borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{bankFeedback._ok ? "✅" : bankFeedback._half ? "⚡" : "❌"}</span>
                      <span style={{ fontWeight: 700, color: fc.txt, fontSize: 13 }}>{bankFeedback._ok ? "Excellent !" : bankFeedback._half ? "Presque !" : "Pas tout à fait…"}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: (!bankFeedback._formulaOk || !bankFeedback._writtenOk) ? 8 : 0 }}>{bankFeedback.feedback}</p>
                    {(!bankFeedback._formulaOk || !bankFeedback._writtenOk) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {!bankFeedback._formulaOk && <span style={{ fontSize: 12, color: P.warn.txt }}>⚠️ Pense à rappeler la ou les formules du cours.</span>}
                        {!bankFeedback._writtenOk && <span style={{ fontSize: 12, color: P.warn.txt }}>⚠️ Rédige ta réponse : étapes + résultat avec l'unité.</span>}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setBankShowHint(h => !h)} style={{ padding: "9px 14px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                💡 {bankShowHint ? "Cacher l'indice" : "Voir l'indice"}
              </button>
              <button onClick={() => setBankShowAnswer(a => !a)} style={{ padding: "9px 14px", background: bankShowAnswer ? bp.pri : "white", border: `1.5px solid ${bankShowAnswer ? bp.pri : "#E5E7EB"}`, borderRadius: 8, color: bankShowAnswer ? "white" : "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: bankShowAnswer ? 600 : 400 }}>
                ✓ {bankShowAnswer ? "Cacher le corrigé" : "Voir le corrigé"}
              </button>
            </div>

            {bankShowHint && (
              <div style={{ borderLeft: `3px solid ${bp.pri}`, padding: "8px 12px", fontSize: 13, color: bp.txt, background: bp.lit, borderRadius: "0 6px 6px 0" }}>
                💡 {ex.hint}
              </div>
            )}
            {bankShowAnswer && (
              <div style={{ borderTop: `1.5px solid ${bp.med}`, paddingTop: 16, background: bp.lit, margin: "0 -1.75rem -1.75rem", padding: "16px 1.75rem 1.75rem" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, color: bp.txt }}>✓ Corrigé</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: bp.txt, fontWeight: 400, margin: 0, whiteSpace: "pre-wrap" }}>{ex.a}</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
            <button onClick={() => { setBankIdx(i => Math.max(0, i - 1)); setBankShowHint(false); setBankShowAnswer(false); resetBankCheck(); }} disabled={bankIdx === 0}
              style={{ flex: 1, padding: "11px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: bankIdx === 0 ? "#D1D5DB" : "#374151", cursor: bankIdx === 0 ? "not-allowed" : "pointer", fontSize: 14, fontFamily: "inherit" }}>
              ← Précédent
            </button>
            <button onClick={() => { setBankIdx(i => Math.min(list.length - 1, i + 1)); setBankShowHint(false); setBankShowAnswer(false); resetBankCheck(); }} disabled={bankIdx === list.length - 1}
              style={{ flex: 1, padding: "11px", background: bankIdx === list.length - 1 ? "#E5E7EB" : bp.pri, border: "none", borderRadius: 8, color: bankIdx === list.length - 1 ? "#9CA3AF" : "white", cursor: bankIdx === list.length - 1 ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
              Suivant →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── BANK (topic selection) ──────────────────────────────────────────────────
  if (screen === "bank") {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Banque d'exercices</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Exercices progressifs du plus simple au plus complexe, avec indice et corrigé</p>

          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {["maths", "physique", "mixte"].map(k => (
              <button key={k} onClick={() => setBankSubj(k)}
                style={{ padding: "8px 16px", background: bankSubj === k ? P[k].pri : "white", border: `1.5px solid ${bankSubj === k ? P[k].pri : "#E5E7EB"}`, borderRadius: 20, color: bankSubj === k ? "white" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                {SUBS[k].emoji} {SUBS[k].label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.keys(EXERCISES[bankSubj]).map(t => (
              <button key={t} onClick={() => { setBankTopic(t); setBankIdx(0); setBankShowHint(false); setBankShowAnswer(false); resetBankCheck(); setScreen("bank-view"); }}
                style={{ padding: "14px 16px", background: "white", border: `1.5px solid ${P[bankSubj].med}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P[bankSubj].pri; e.currentTarget.style.background = P[bankSubj].lit; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = P[bankSubj].med; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: P[bankSubj].txt, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{EXERCISES[bankSubj][t].length} exercices</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CARDS VIEW ────────────────────────────────────────────────────────────
  if (screen === "cards-view") {
    const cp = P[cardsSubj];
    const course = CARDS[cardsSubj][cardsTopic];
    const topics = Object.keys(CARDS[cardsSubj]);
    const topicIdx = topics.indexOf(cardsTopic);
    const hasPrev = topicIdx > 0;
    const hasNext = topicIdx < topics.length - 1;
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <button onClick={() => setScreen("cards")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Retour</button>
            <span style={{ background: cp.lit, color: cp.txt, border: `1px solid ${cp.med}`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{cardsTopic}</span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF" }}>{topicIdx + 1} / {topics.length}</span>
          </div>
          <CourseView key={cardsTopic} course={course} c={cp} />
          <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
            <button onClick={() => setCardsTopic(topics[topicIdx - 1])} disabled={!hasPrev}
              style={{ flex: 1, padding: "11px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: hasPrev ? "#374151" : "#D1D5DB", cursor: hasPrev ? "pointer" : "not-allowed", fontSize: 14, fontFamily: "inherit" }}>
              ← Thème précédent
            </button>
            <button onClick={() => setCardsTopic(topics[topicIdx + 1])} disabled={!hasNext}
              style={{ flex: 1, padding: "11px", background: hasNext ? cp.pri : "#E5E7EB", border: "none", borderRadius: 8, color: hasNext ? "white" : "#9CA3AF", cursor: hasNext ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
              Thème suivant →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CARDS (topic selection) ───────────────────────────────────────────────
  if (screen === "cards") {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Fiches de révision</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Question et cours affichés ensemble sur chaque fiche</p>

          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
            {["maths", "physique"].map(k => (
              <button key={k} onClick={() => setCardsSubj(k)}
                style={{ padding: "8px 16px", background: cardsSubj === k ? P[k].pri : "white", border: `1.5px solid ${cardsSubj === k ? P[k].pri : "#E5E7EB"}`, borderRadius: 20, color: cardsSubj === k ? "white" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                {SUBS[k].emoji} {SUBS[k].label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.keys(CARDS[cardsSubj]).map(t => (
              <button key={t} onClick={() => { setCardsTopic(t); setScreen("cards-view"); }}
                style={{ padding: "14px 16px", background: "white", border: `1.5px solid ${P[cardsSubj].med}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P[cardsSubj].pri; e.currentTarget.style.background = P[cardsSubj].lit; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = P[cardsSubj].med; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: P[cardsSubj].txt, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{CARDS[cardsSubj][t].sections.length} sections</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Défis d'apprentissage</h1>
          <button onClick={logout} style={{ flexShrink: 0, marginTop: 2, padding: "6px 12px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
            Se déconnecter
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Programme officiel 5ème — exercices générés et corrigés par IA</p>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Entraînement par matière</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {["maths", "physique"].map(k => {
            const p = P[k]; const s = SUBS[k];
            return (
              <button key={k} onClick={() => { setSubj(k); setTopic(null); setScreen("setup"); }}
                style={{ background: p.lit, border: `2px solid ${p.med}`, borderRadius: 12, padding: "1.25rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.pri; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = p.med; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{s.emoji}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: p.txt, marginBottom: 8 }}>{s.label}</div>
                {s.topics.map(t => <div key={t} style={{ fontSize: 11, color: p.txt, opacity: 0.75, lineHeight: 1.9 }}>· {t}</div>)}
              </button>
            );
          })}
        </div>

        <button onClick={() => { setSubj("mixte"); setTopic(null); setScreen("setup"); }}
          style={{ width: "100%", background: P.mixte.lit, border: `2px solid ${P.mixte.med}`, borderRadius: 12, padding: "1.1rem 1.25rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = P.mixte.pri; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = P.mixte.med; e.currentTarget.style.boxShadow = "none"; }}>
          <span style={{ fontSize: 28 }}>🔬</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: P.mixte.txt }}>Problèmes mixtes</div>
            <div style={{ fontSize: 12, color: P.mixte.txt, opacity: 0.75, marginTop: 2 }}>Maths + Physique combinés · Problèmes complexes multi-étapes</div>
          </div>
        </button>

        <button onClick={() => setScreen("cards")}
          style={{ width: "100%", padding: "13px 20px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s", marginBottom: 10 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.background = "#F9FAFB"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>📚</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Fiches de révision</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>Cours condensés par thème · {Object.values(CARDS).flatMap(s => Object.keys(s)).length} thèmes</div>
            </div>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: 18 }}>→</span>
        </button>

        <button onClick={() => setScreen("bank")}
          style={{ width: "100%", padding: "13px 20px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.background = "#F9FAFB"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🗂️</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Banque d'exercices</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>Exercices progressifs du simple au complexe · {Object.values(EXERCISES).flatMap(s => Object.values(s)).flat().length} exercices</div>
            </div>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  );

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: px, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, padding: "0 0 1.5rem", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 26 }}>{S.emoji}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>{S.label}</h2>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Thème</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.75rem" }}>
          {S.topics.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={cardStyle(topic === t, subj)}>{t}</button>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Niveau</p>
        <div style={{ display: "flex", gap: 8, marginBottom: "2rem" }}>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setLevel(n)}
              style={{ flex: 1, padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", background: level === n ? c.lit : "white", border: `1.5px solid ${level === n ? c.pri : "#E5E7EB"}`, borderRadius: 8, transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
                {[1, 2, 3].map(i => <Dot key={i} filled={i <= n} color={level === n ? c.pri : c.med} />)}
              </div>
              <div style={{ fontSize: 12, color: level === n ? c.txt : "#6B7280", fontWeight: level === n ? 700 : 400 }}>{LVL[n]}</div>
            </button>
          ))}
        </div>

        <button onClick={() => { setScore(0); setStreak(0); setCount(0); setScreen("quiz"); genQuestion(); }} disabled={!topic}
          style={{ width: "100%", padding: "13px", background: topic ? c.pri : "#E5E7EB", border: "none", borderRadius: 8, color: topic ? "white" : "#9CA3AF", fontSize: 15, fontWeight: 700, cursor: topic ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {topic ? `▶ Commencer les défis` : "Choisis d'abord un thème"}
        </button>
      </div>
    </div>
  );

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%{transform:scale(0.97)}55%{transform:scale(1.03)}100%{transform:scale(1)}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <button onClick={() => setScreen("setup")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Thème</button>
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
              <button onClick={() => setAnswerMode("text")}
                style={{ padding: "7px 14px", background: answerMode === "text" ? c.pri : "white", border: `1.5px solid ${answerMode === "text" ? c.pri : "#E5E7EB"}`, borderRadius: 20, color: answerMode === "text" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                ✍️ Texte
              </button>
              <button onClick={() => setAnswerMode("photo")}
                style={{ padding: "7px 14px", background: answerMode === "photo" ? c.pri : "white", border: `1.5px solid ${answerMode === "photo" ? c.pri : "#E5E7EB"}`, borderRadius: 20, color: answerMode === "photo" ? "white" : "#6B7280", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                📷 Photo
              </button>
            </div>

            {answerMode === "text" ? (
              <>
                <textarea ref={taRef} value={answer} onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) validate(); }}
                  placeholder="Écris ta réponse ici… (Ctrl+Entrée pour valider)" rows={3}
                  style={{ width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "12px 14px", color: "#111827", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, marginBottom: 4, transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = c.pri}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                />
                <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#9CA3AF" }}>Rappelle la formule du cours et rédige ta démarche (résultat + unité).</p>
              </>
            ) : (
              <PhotoCapture photo={photo} setPhoto={setPhoto} color={c.pri} />
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowHint(h => !h)}
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
              <button onClick={() => setScreen("setup")} style={{ padding: "10px 16px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Changer</button>
              <button onClick={genQuestion} style={{ flex: 1, padding: "10px", background: c.pri, border: "none", borderRadius: 8, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Défi suivant →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
