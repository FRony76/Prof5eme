import { verifySession, sameOrigin } from "./_lib/auth.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée" });
  if (!verifySession(req)) return res.status(401).json({ error: "Non authentifié" });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "Clé API non configurée côté serveur" });

  const { system, userMsg, imageBase64 = null, imageMediaType = "image/jpeg" } = req.body || {};
  if (typeof system !== "string" || typeof userMsg !== "string") {
    return res.status(400).json({ error: "Requête invalide" });
  }
  if (imageBase64 != null && (typeof imageBase64 !== "string" || imageBase64.length > 8_000_000)) {
    return res.status(413).json({ error: "Image trop volumineuse" });
  }

  const parts = [{ text: userMsg }];
  if (imageBase64) parts.push({ inline_data: { mime_type: imageMediaType, data: imageBase64 } });

  const started = Date.now();
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts }],
          generationConfig: { maxOutputTokens: 3000, responseMimeType: "application/json" },
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error(`[gemini] ${r.status} en ${Date.now() - started}ms — ${detail.slice(0, 800)}`);
      const expose = process.env.DEBUG_GEMINI === "1";
      return res.status(502).json({ error: `Gemini ${r.status}`, ...(expose ? { detail } : {}) });
    }

    const data = await r.json();
    const cand = data.candidates?.[0];
    const text = cand?.content?.parts?.[0]?.text;
    if (!text) {
      console.error(`[gemini] 200 sans texte — finishReason=${cand?.finishReason} en ${Date.now() - started}ms`);
      return res.status(502).json({ error: `Gemini sans réponse (${cand?.finishReason || "vide"})` });
    }
    console.log(`[gemini] 200 OK en ${Date.now() - started}ms`);
    return res.status(200).json({ text });
  } catch (e) {
    console.error(`[gemini] exception en ${Date.now() - started}ms`, e);
    return res.status(502).json({ error: "Erreur de communication avec Gemini" });
  }
}
