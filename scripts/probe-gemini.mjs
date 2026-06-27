// Sonde directe Gemini — isole les problèmes de quota/clé/modèle hors app/auth
// Usage:
//   node --env-file=.env.local scripts/probe-gemini.mjs [N] [GAP_MS]
//   N      : nombre d'appels (défaut 8)
//   GAP_MS : délai entre appels en ms (défaut 0 = rafale)
// Exemples:
//   node --env-file=.env.local scripts/probe-gemini.mjs 10 0      # rafale → révèle rate limit
//   node --env-file=.env.local scripts/probe-gemini.mjs 10 5000   # espacé 5s → doit passer
import "node:process";

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const N = Number(process.argv[2] || 8);
const GAP = Number(process.argv[3] || 0);

if (!KEY) {
  console.error("GEMINI_API_KEY manquant — charger .env.local d'abord :");
  console.error("  node --env-file=.env.local scripts/probe-gemini.mjs");
  process.exit(1);
}

console.log(`Sonde Gemini — modèle: ${MODEL}, ${N} appels, délai: ${GAP}ms\n`);

for (let i = 1; i <= N; i++) {
  const t = Date.now();
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Réponds juste: OK" }] }],
          generationConfig: { maxOutputTokens: 20 },
        }),
      }
    );
    const body = await r.text();
    if (r.ok) {
      console.log(`#${i} ✅ ${r.status} ${Date.now() - t}ms`);
    } else {
      console.log(`#${i} ❌ ${r.status} ${Date.now() - t}ms — ${body.slice(0, 400)}`);
    }
  } catch (e) {
    console.log(`#${i} 💥 EXCEPTION ${Date.now() - t}ms — ${e.message}`);
  }
  if (GAP && i < N) await new Promise((s) => setTimeout(s, GAP));
}
