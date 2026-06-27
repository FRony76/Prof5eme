import {
  verifyPassword,
  safeEqualStr,
  signSession,
  sessionCookie,
  rateLimit,
  clientIp,
  sameOrigin,
} from "./_lib/auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée" });
  if (!rateLimit(`login:${clientIp(req)}`))
    return res.status(429).json({ error: "Trop de tentatives, réessaie dans quelques minutes." });

  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return res.status(400).json({ error: "Identifiants requis" });
  }

  const envUser = process.env.AUTH_USERNAME || "";
  const envHash = process.env.AUTH_PASSWORD_HASH || "";

  // Toujours exécuter les deux vérifications (anti-énumération / anti-timing)
  const userOk = safeEqualStr(username, envUser);
  const passOk = verifyPassword(password, envHash);

  if (!userOk || !passOk) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  res.setHeader("Set-Cookie", sessionCookie(signSession(username)));
  return res.status(200).json({ authed: true });
}
