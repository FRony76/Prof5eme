import { useState } from "react";
import { P } from "../theme.js";

export default function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

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
      if (res.ok) { onSuccess(username); return; }
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Connexion impossible.");
    } catch {
      setErr("Connexion impossible.");
    }
    setBusy(false);
  };

  const canSubmit = !busy && username && password;
  const field = { width: "100%", boxSizing: "border-box", background: "white", border: "1px solid #E1DDD2", borderRadius: 12, padding: "12px 15px", color: "#191927", fontSize: 14.5, outline: "none", fontFamily: "inherit", marginBottom: 10, transition: "border-color .15s" };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2EC", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'Figtree',system-ui,sans-serif", color: "#191927" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: "white", border: "1px solid #EAE7DE", borderRadius: 22, padding: "2.25rem 2rem", animation: "revFade .4s ease both" }}>
        <style>{`@keyframes revFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 11, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#5B4FE9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, color: "#fff" }}>5</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 24, letterSpacing: "-.5px" }}>Prof5eme</div>
        </div>
        <p style={{ fontSize: 14, color: "#6B6B7B", margin: "0 0 1.5rem", textAlign: "center" }}>Connecte-toi pour commencer à réviser</p>

        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
          placeholder="Identifiant" autoComplete="username" autoFocus
          style={field} onFocus={e => e.target.style.borderColor = "#5B4FE9"} onBlur={e => e.target.style.borderColor = "#E1DDD2"} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe" autoComplete="current-password"
          style={field} onFocus={e => e.target.style.borderColor = "#5B4FE9"} onBlur={e => e.target.style.borderColor = "#E1DDD2"} />

        {err && <p style={{ color: P.err.pri, fontSize: 13, margin: "0 0 10px" }}>{err}</p>}

        <button type="submit" disabled={!canSubmit}
          style={{ width: "100%", padding: "13px", background: canSubmit ? "#5B4FE9" : "#C7C3B8", border: "none", borderRadius: 14, color: "white", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "inherit", transition: "background .15s" }}
          onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = "#4A3FD6"; }}
          onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = "#5B4FE9"; }}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
