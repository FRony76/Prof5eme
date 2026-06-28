import { P } from "../theme.js";
import { SUBS } from "../constants.js";
import { CARDS } from "../data/cards.js";
import { EXERCISES } from "../data/exercises.js";
import { useAppState } from "../state/AppContext.jsx";

export default function HomeScreen() {
  const { dispatch } = useAppState();

  const logout = async () => {
    try { await fetch("/api/logout", { method: "POST" }); } catch { /* ignore */ }
    dispatch({ type: "SET", payload: { authed: false } });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "2rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
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
              <button key={k} onClick={() => dispatch({ type: "SET", payload: { subj: k, topic: null, screen: "setup" } })}
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

        <button onClick={() => dispatch({ type: "SET", payload: { subj: "mixte", topic: null, screen: "setup" } })}
          style={{ width: "100%", background: P.mixte.lit, border: `2px solid ${P.mixte.med}`, borderRadius: 12, padding: "1.1rem 1.25rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = P.mixte.pri; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = P.mixte.med; e.currentTarget.style.boxShadow = "none"; }}>
          <span style={{ fontSize: 28 }}>🔬</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: P.mixte.txt }}>Problèmes mixtes</div>
            <div style={{ fontSize: 12, color: P.mixte.txt, opacity: 0.75, marginTop: 2 }}>Maths + Physique combinés · Problèmes complexes multi-étapes</div>
          </div>
        </button>

        <button onClick={() => dispatch({ type: "SET", payload: { screen: "cards" } })}
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

        <button onClick={() => dispatch({ type: "SET", payload: { screen: "bank" } })}
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
}
