import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { CARDS } from "../data/cards.js";
import { useAppState } from "../state/AppContext.jsx";

export default function CardsScreen() {
  const { state, dispatch } = useAppState();
  const { cardsSubj } = state;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Fiches de révision</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Question et cours affichés ensemble sur chaque fiche</p>

        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          {["maths", "physique"].map(k => (
            <button key={k} onClick={() => dispatch({ type: "SET", payload: { cardsSubj: k } })}
              style={{ padding: "8px 16px", background: cardsSubj === k ? P[k].pri : "white", border: `1.5px solid ${cardsSubj === k ? P[k].pri : "#E5E7EB"}`, borderRadius: 20, color: cardsSubj === k ? "white" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              {SUBS[k].emoji} {SUBS[k].label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.keys(CARDS[cardsSubj]).map(t => (
            <button key={t} onClick={() => dispatch({ type: "SET", payload: { cardsTopic: t, screen: "cards-view" } })}
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
