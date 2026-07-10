import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { CARDS } from "../data/cards.js";
import CourseView from "../components/CourseView.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function CardsView() {
  const { state, dispatch } = useAppState();
  const { subj, topic } = state;
  const cp = P[subj];
  const S = SUBS[subj];
  const course = CARDS[subj][topic];
  const topics = Object.keys(CARDS[subj]);
  const topicIdx = topics.indexOf(topic);
  const hasPrev = topicIdx > 0;
  const hasNext = topicIdx < topics.length - 1;

  return (
    <div style={{ animation: "revFade .4s ease both", maxWidth: 760 }}>
      <div onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })}
        style={{ fontSize: 13.5, fontWeight: 600, color: "#6B6B7B", cursor: "pointer" }}>
        ← {S.label}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
        <span style={{ display: "inline-block", background: cp.lit, color: cp.txt, fontWeight: 700, fontSize: 12.5, padding: "5px 11px", borderRadius: 20 }}>{S.label}</span>
        <span style={{ fontSize: 13, color: "#6B6B7B" }}>Cours</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#9A9AAB" }}>{topicIdx + 1} / {topics.length}</span>
      </div>
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 32, letterSpacing: "-.9px", marginTop: 10, lineHeight: 1.15 }}>{topic}</div>

      <div style={{ marginTop: 24 }}>
        <CourseView key={topic} course={course} c={cp} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
        <div onClick={() => dispatch({ type: "SET", payload: { screen: "setup" } })}
          style={{ padding: "15px 24px", background: cp.pri, color: "#fff", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Passer aux exercices →
        </div>
        <div onClick={() => dispatch({ type: "SET", payload: { screen: "topic" } })}
          style={{ padding: "15px 22px", border: "1px solid #E1DDD2", borderRadius: 14, fontWeight: 600, fontSize: 15, cursor: "pointer", color: "#191927" }}>
          Retour
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div onClick={() => hasPrev && dispatch({ type: "SET", payload: { topic: topics[topicIdx - 1] } })}
            style={{ padding: "12px 16px", border: "1px solid #E1DDD2", borderRadius: 12, fontWeight: 600, fontSize: 13.5, cursor: hasPrev ? "pointer" : "not-allowed", color: hasPrev ? "#191927" : "#C7C3B8", background: "#fff" }}>
            ← Précédent
          </div>
          <div onClick={() => hasNext && dispatch({ type: "SET", payload: { topic: topics[topicIdx + 1] } })}
            style={{ padding: "12px 16px", border: "1px solid #E1DDD2", borderRadius: 12, fontWeight: 600, fontSize: 13.5, cursor: hasNext ? "pointer" : "not-allowed", color: hasNext ? "#191927" : "#C7C3B8", background: "#fff" }}>
            Suivant →
          </div>
        </div>
      </div>
    </div>
  );
}
