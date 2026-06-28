import crypto from "node:crypto";

// Durée de vie d'une session et nom du cookie
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 jours (secondes)
const COOKIE_NAME = "session";

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET manquant ou trop court");
  return s;
}

// ── Cookies ────────────────────────────────────────────────────────────────
export function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((c) => {
        const i = c.indexOf("=");
        if (i < 0) return [c.trim(), ""];
        return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())];
      })
      .filter(([k]) => k)
  );
}

export function sessionCookie(token, maxAge = SESSION_TTL) {
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ].join("; ");
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

// ── Jeton de session signé (HMAC-SHA256) ────────────────────────────────────
// payload : { u: username, uid: number, exp: epoch }
export function signSession(username, uid) {
  const payload = { u: username, uid, exp: Math.floor(Date.now() / 1000) + SESSION_TTL };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

// Renvoie { u, uid } ou null. Les anciens tokens sans uid sont rejetés.
export function verifySession(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  if (!payload.u || payload.uid == null) return null;
  return { u: payload.u, uid: payload.uid };
}

// ── Mot de passe : vérification scrypt à temps constant ──────────────────────
// `stored` au format "saltHex:hashHex" (cf. scripts/hash-password.mjs)
export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  let salt, expected, derived;
  try {
    salt = Buffer.from(saltHex, "hex");
    expected = Buffer.from(hashHex, "hex");
    derived = crypto.scryptSync(String(password), salt, expected.length);
  } catch {
    return false;
  }
  return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}

// Comparaison de chaînes à temps (quasi) constant pour le nom d'utilisateur
export function safeEqualStr(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab); // travail factice pour limiter la fuite de timing
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

// ── Limitation de débit best-effort (par instance serverless) ───────────────
// Note : les instances sont éphémères/multiples → protection partielle.
// Pour une limite robuste, brancher Vercel KV / Upstash.
const attempts = new Map();
export function rateLimit(key, max = 8, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const rec = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  rec.push(now);
  attempts.set(key, rec);
  return rec.length <= max;
}

export function clientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
}

// Défense en profondeur contre le CSRF (en complément de SameSite=Strict)
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // certaines requêtes same-origin n'envoient pas d'Origin
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
