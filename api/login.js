import {
  verifyPassword,
  safeEqualStr,
  signSession,
  sessionCookie,
  rateLimit,
  clientIp,
  sameOrigin,
} from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée" });
  if (!rateLimit(`login:${clientIp(req)}`))
    return res.status(429).json({ error: "Trop de tentatives, réessaie dans quelques minutes." });

  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return res.status(400).json({ error: "Identifiants requis" });
  }

  // ── Auth DB (si une URL de base est disponible) ─────────────────────────
  const { sql, dbUrl } = await import("./_lib/db.js");
  if (dbUrl()) {
    // .catch([]) couvre aussi le cas où la table users n'existe pas encore
    // (migration pas encore lancée) → on retombe sur le compte env-var.
    const [row] = await sql`
      SELECT id, username, password_hash FROM users WHERE username = ${username} LIMIT 1
    `.catch(() => []);

    if (row) {
      // Username connu en DB → compte élève : on valide son mot de passe
      if (!verifyPassword(password, row.password_hash))
        return res.status(401).json({ error: "Identifiants invalides" });
      res.setHeader("Set-Cookie", sessionCookie(signSession(row.username, Number(row.id))));
      return res.status(200).json({ authed: true });
    }
    // Username inconnu en DB → on tente le compte env-var ci-dessous (pas de lockout)
  }

  // ── Fallback env vars (compte admin historique) ─────────────────────────
  const envUser = process.env.AUTH_USERNAME || "";
  const envHash = process.env.AUTH_PASSWORD_HASH || "";
  const userOk = safeEqualStr(username, envUser);
  const passOk = verifyPassword(password, envHash);
  if (!userOk || !passOk) return res.status(401).json({ error: "Identifiants invalides" });

  // uid=0 pour le compte env-var (pas de ligne DB)
  res.setHeader("Set-Cookie", sessionCookie(signSession(username, 0)));
  return res.status(200).json({ authed: true });
}
