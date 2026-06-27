import crypto from "node:crypto";

// Smoke-test de la couche serverless /api : exécute les vrais handlers avec
// des req/res simulés (façon runtime Vercel) et un fetch stubé pour Gemini.
// Lancer : npm test

// ── Préparer l'environnement (avant import des handlers) ──────────────────────
const PASSWORD = "test1234";
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(PASSWORD, salt, 64);
process.env.AUTH_USERNAME = "eleve";
process.env.AUTH_PASSWORD_HASH = `${salt.toString("hex")}:${hash.toString("hex")}`;
process.env.SESSION_SECRET = crypto.randomBytes(32).toString("hex");
process.env.GEMINI_API_KEY = "FAKE_KEY_FOR_TEST";

const api = new URL("../api/", import.meta.url);
const login = (await import(new URL("login.js", api))).default;
const session = (await import(new URL("session.js", api))).default;
const logout = (await import(new URL("logout.js", api))).default;
const gemini = (await import(new URL("gemini.js", api))).default;

// ── Mocks req/res façon Vercel Node runtime ──────────────────────────────────
const mockRes = () => {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.status = (c) => ((res.statusCode = c), res);
  res.json = (o) => ((res.body = o), res);
  res.setHeader = (k, v) => ((res.headers[k] = v), res);
  res.end = () => res;
  return res;
};
const mockReq = ({ method = "POST", headers = {}, body } = {}) => ({ method, headers, body });

let pass = 0, fail = 0;
const ok = (name, cond) => { (cond ? pass++ : fail++); console.log(`${cond ? "✅" : "❌"} ${name}`); };
const cookieFrom = (res) => {
  const sc = res.headers["Set-Cookie"];
  return sc ? sc.split(";")[0] : "";
};

// 1-2. Identifiants invalides → 401
let r = mockRes();
await login(mockReq({ body: { username: "eleve", password: "WRONG" } }), r);
ok("login mauvais mdp → 401", r.statusCode === 401);
r = mockRes();
await login(mockReq({ body: { username: "intrus", password: PASSWORD } }), r);
ok("login mauvais user → 401", r.statusCode === 401);

// 3. Login correct → 200 + cookie sécurisé
r = mockRes();
await login(mockReq({ body: { username: "eleve", password: PASSWORD } }), r);
const setCookie = r.headers["Set-Cookie"] || "";
ok("login correct → 200", r.statusCode === 200 && r.body?.authed === true);
ok("cookie HttpOnly+Secure+SameSite=Strict", /HttpOnly/.test(setCookie) && /Secure/.test(setCookie) && /SameSite=Strict/.test(setCookie));
const cookie = cookieFrom(r);

// 4-6. Session
r = mockRes();
await session(mockReq({ method: "GET", headers: { cookie } }), r);
ok("session valide → 200 authed", r.statusCode === 200 && r.body?.authed === true && r.body?.user === "eleve");
r = mockRes();
await session(mockReq({ method: "GET" }), r);
ok("session sans cookie → 401", r.statusCode === 401);
r = mockRes();
await session(mockReq({ method: "GET", headers: { cookie: cookie.slice(0, -3) + "xxx" } }), r);
ok("cookie falsifié → 401 (HMAC rejette)", r.statusCode === 401);

// 7-8. Proxy protégé
r = mockRes();
await gemini(mockReq({ body: { system: "s", userMsg: "u" } }), r);
ok("gemini sans session → 401", r.statusCode === 401);
r = mockRes();
await gemini(mockReq({ headers: { cookie }, body: { system: 123 } }), r);
ok("gemini corps invalide → 400", r.statusCode === 400);

// 9. Proxy relaie vers Gemini (fetch stubé)
const realFetch = global.fetch;
let capturedUrl = "", capturedHeaders = null, capturedBody = null;
global.fetch = async (url, opts) => {
  capturedUrl = url; capturedHeaders = opts.headers; capturedBody = JSON.parse(opts.body);
  return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"correct":true}' }] } }] }) };
};
r = mockRes();
await gemini(mockReq({ headers: { cookie }, body: { system: "Corrige", userMsg: "2+2=4", imageBase64: null } }), r);
global.fetch = realFetch;
ok("gemini session OK → 200 + texte relayé", r.statusCode === 200 && r.body?.text === '{"correct":true}');
ok("proxy cible bien Gemini", capturedUrl.includes("generativelanguage.googleapis.com") && capturedUrl.includes("gemini-3.5-flash"));
ok("clé API ajoutée côté serveur uniquement", capturedHeaders?.["x-goog-api-key"] === "FAKE_KEY_FOR_TEST");
ok("payload Gemini bien formé", capturedBody?.system_instruction?.parts?.[0]?.text === "Corrige" && capturedBody?.contents?.[0]?.parts?.[0]?.text === "2+2=4");

// 10. Image trop volumineuse → 413
r = mockRes();
await gemini(mockReq({ headers: { cookie }, body: { system: "s", userMsg: "u", imageBase64: "A".repeat(8_000_001) } }), r);
ok("image trop volumineuse → 413", r.statusCode === 413);

// 11. Logout → cookie effacé
r = mockRes();
await logout(mockReq(), r);
ok("logout → cookie effacé", /Max-Age=0/.test(r.headers["Set-Cookie"] || ""));

// 12. Rate limiting
let got429 = false;
for (let i = 0; i < 20; i++) {
  const rr = mockRes();
  await login(mockReq({ headers: { "x-forwarded-for": "9.9.9.9" }, body: { username: "x", password: "y" } }), rr);
  if (rr.statusCode === 429) { got429 = true; break; }
}
ok("rate limit login → 429 après N tentatives", got429);

// 13. CSRF : origine étrangère → 403
r = mockRes();
await login(mockReq({ headers: { origin: "https://evil.example", host: "monapp.vercel.app" }, body: { username: "eleve", password: PASSWORD } }), r);
ok("origine étrangère → 403 (anti-CSRF)", r.statusCode === 403);

console.log(`\n${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
