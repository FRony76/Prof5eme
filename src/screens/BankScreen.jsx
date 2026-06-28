import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { EXERCISES } from "../data/exercises.js";
import { useAppState } from "../state/AppContext.jsx";

export default function BankScreen() {
  const { state, dispatch } = useAppState();
  const { bankSubj } = state;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => dispatch({ type: "SET", payload: { screen: "home" } })} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: "0 0 1.25rem", display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Banque d'exercices</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.75rem" }}>Exercices progressifs du plus simple au plus complexe, avec indice et corrigé</p>

        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["maths", "physique", "mixte"].map(k => (
            <button key={k} onClick={() => dispatch({ type: "SET", payload: { bankSubj: k } })}
              style={{ padding: "8px 16px", background: bankSubj === k ? P[k].pri : "white", border: `1.5px solid ${bankSubj === k ? P[k].pri : "#E5E7EB"}`, borderRadius: 20, color: bankSubj === k ? "white" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              {SUBS[k].emoji} {SUBS[k].label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.keys(EXERCISES[bankSubj]).map(t => (
            <button key={t} onClick={() => dispatch({ type: "BANK_SELECT_TOPIC", topic: t })}
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
