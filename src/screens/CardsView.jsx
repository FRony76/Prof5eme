import { P } from "../theme.js";
import { CARDS } from "../data/cards.js";
import CourseView from "../components/CourseView.jsx";
import { useAppState } from "../state/AppContext.jsx";

export default function CardsView() {
  const { state, dispatch } = useAppState();
  const { cardsSubj, cardsTopic } = state;
  const cp = P[cardsSubj];
  const course = CARDS[cardsSubj][cardsTopic];
  const topics = Object.keys(CARDS[cardsSubj]);
  const topicIdx = topics.indexOf(cardsTopic);
  const hasPrev = topicIdx > 0;
  const hasNext = topicIdx < topics.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <button onClick={() => dispatch({ type: "SET", payload: { screen: "cards" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>← Retour</button>
          <span style={{ background: cp.lit, color: cp.txt, border: `1px solid ${cp.med}`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{cardsTopic}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF" }}>{topicIdx + 1} / {topics.length}</span>
        </div>
        <CourseView key={cardsTopic} course={course} c={cp} />
        <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
          <button onClick={() => dispatch({ type: "SET", payload: { cardsTopic: topics[topicIdx - 1] } })} disabled={!hasPrev}
            style={{ flex: 1, padding: "11px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: hasPrev ? "#374151" : "#D1D5DB", cursor: hasPrev ? "pointer" : "not-allowed", fontSize: 14, fontFamily: "inherit" }}>
            ← Thème précédent
          </button>
          <button onClick={() => dispatch({ type: "SET", payload: { cardsTopic: topics[topicIdx + 1] } })} disabled={!hasNext}
            style={{ flex: 1, padding: "11px", background: hasNext ? cp.pri : "#E5E7EB", border: "none", borderRadius: 8, color: hasNext ? "white" : "#9CA3AF", cursor: hasNext ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
            Thème suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
