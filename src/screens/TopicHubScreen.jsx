import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { CARDS } from "../data/cards.js";
import { EXERCISES } from "../data/exercises.js";
import { useAppState } from "../state/AppContext.jsx";

export default function TopicHubScreen() {
  const { state, dispatch } = useAppState();
  const { subj, topic } = state;
  const S = SUBS[subj];
  const c = P[subj];

  const hasCours = !!(CARDS[subj]?.[topic]);
  const hasExercices = !!(EXERCISES[subj]?.[topic]);

  const actionStyle = (active) => ({
    width: "100%", padding: "1rem 1.25rem", background: "white",
    border: "1.5px solid #E5E7EB", borderRadius: 12, cursor: active ? "pointer" : "not-allowed",
    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between",
    transition: "all 0.15s", opacity: active ? 1 : 0.4,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "topics" } })}
          style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>
          ← Retour
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{S.emoji}</span>
          <div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>{S.label}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>{topic}</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Que veux-tu faire sur ce thème ?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hasCours && (
            <button
              onClick={() => dispatch({ type: "SET", payload: { screen: "cards-view" } })}
              style={actionStyle(true)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📚</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Cours</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Fiche de révision condensée sur ce thème</div>
                </div>
              </div>
              <span style={{ color: "#9CA3AF", fontSize: 18 }}>→</span>
            </button>
          )}

          <button
            onClick={() => dispatch({ type: "SET", payload: { screen: "setup" } })}
            style={actionStyle(true)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.pri; e.currentTarget.style.background = c.lit; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>✍️</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>S'entraîner</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Quiz corrigé par IA, niveau au choix</div>
              </div>
            </div>
            <span style={{ color: "#9CA3AF", fontSize: 18 }}>→</span>
          </button>

          {hasExercices && (
            <button
              onClick={() => dispatch({ type: "SET", payload: { bankIdx: 0, bankShowHint: false, bankShowAnswer: false, bankFeedback: null, screen: "bank-view" } })}
              style={actionStyle(true)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "white"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🗂️</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Exercices</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Banque progressive avec indice et corrigé</div>
                </div>
              </div>
              <span style={{ color: "#9CA3AF", fontSize: 18 }}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
