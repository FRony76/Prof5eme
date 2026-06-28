import { useState } from "react";
import { P } from "../theme.js";

export default function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const a = P.maths;

  const submit = async (e) => {
    e.preventDefault();
    if (busy || !username || !password) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) { onSuccess(); return; }
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Connexion impossible.");
    } catch {
      setErr("Connexion impossible.");
    }
    setBusy(false);
  };

  const field = { width: "100%", boxSizing: "border-box", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "11px 14px", color: "#111827", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 10 };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "2rem 1.75rem" }}>
        <div style={{ fontSize: 30, textAlign: "center", marginBottom: 6 }}>📐</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 4px", textAlign: "center" }}>Défis d'apprentissage</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 1.5rem", textAlign: "center" }}>Connecte-toi pour commencer</p>

        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
          placeholder="Identifiant" autoComplete="username" autoFocus
          style={field} onFocus={e => e.target.style.borderColor = a.pri} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe" autoComplete="current-password"
          style={field} onFocus={e => e.target.style.borderColor = a.pri} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />

        {err && <p style={{ color: P.err.pri, fontSize: 13, margin: "0 0 10px" }}>{err}</p>}

        <button type="submit" disabled={busy || !username || !password}
          style={{ width: "100%", padding: "11px", background: (busy || !username || !password) ? "#E5E7EB" : a.pri, border: "none", borderRadius: 8, color: (busy || !username || !password) ? "#9CA3AF" : "white", fontWeight: 700, cursor: (busy || !username || !password) ? "not-allowed" : "pointer", fontSize: 14, fontFamily: "inherit" }}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
