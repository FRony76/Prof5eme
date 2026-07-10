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

  const cardStyle = { background: "#fff", border: "1px solid #EAE7DE", borderRadius: 16, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "transform .15s,box-shadow .15s,border-color .15s" };
  const onEnter = e => { e.currentTarget.style.borderColor = c.pri; e.currentTarget.style.background = c.lit; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,.07)"; };
  const onLeave = e => { e.currentTarget.style.borderColor = "#EAE7DE"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; };

  return (
    <div style={{ animation: "revFade .4s ease both" }}>
      <div onClick={() => dispatch({ type: "SET", payload: { screen: "topics" } })}
        style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
        ← {S.label}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, marginBottom: 6 }}>
        <div style={{ flex: "none", width: 52, height: 52, borderRadius: 14, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>{S.mono}</div>
        <div>
          <div style={{ fontSize: 13, color: "#6B6B7B" }}>{S.label}</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 24, letterSpacing: "-.5px" }}>{topic}</div>
        </div>
      </div>
      <div style={{ color: "#6B6B7B", fontSize: 15, marginTop: 4, marginBottom: 26 }}>Que veux-tu faire sur ce thème ?</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {hasCours && (
          <div onClick={() => dispatch({ type: "SET", payload: { screen: "cards-view" } })} style={cardStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div style={{ flex: "none", width: 46, height: 46, borderRadius: 12, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📚</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Cours</div>
              <div style={{ fontSize: 12.5, color: "#6B6B7B", marginTop: 2 }}>Fiche de révision condensée sur ce thème</div>
            </div>
            <span style={{ color: "#9A9AAB", fontSize: 18 }}>→</span>
          </div>
        )}

        <div onClick={() => dispatch({ type: "SET", payload: { screen: "setup" } })} style={cardStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <div style={{ flex: "none", width: 46, height: 46, borderRadius: 12, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✍️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>S'entraîner</div>
            <div style={{ fontSize: 12.5, color: "#6B6B7B", marginTop: 2 }}>Quiz corrigé par IA, niveau au choix</div>
          </div>
          <span style={{ color: "#9A9AAB", fontSize: 18 }}>→</span>
        </div>

        {hasExercices && (
          <div onClick={() => dispatch({ type: "SET", payload: { bankIdx: 0, bankShowHint: false, bankShowAnswer: false, bankFeedback: null, screen: "bank-view" } })} style={cardStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div style={{ flex: "none", width: 46, height: 46, borderRadius: 12, background: c.lit, color: c.pri, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🗂️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Exercices</div>
              <div style={{ fontSize: 12.5, color: "#6B6B7B", marginTop: 2 }}>Banque progressive avec indice et corrigé</div>
            </div>
            <span style={{ color: "#9A9AAB", fontSize: 18 }}>→</span>
          </div>
        )}
      </div>
    </div>
  );
}
