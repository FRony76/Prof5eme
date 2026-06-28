import { verifySession, sameOrigin } from "./_lib/auth.js";
import { sql } from "./_lib/db.js";

export default async function handler(req, res) {
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée" });
  const session = verifySession(req);
  if (!session) return res.status(401).json({ error: "Non authentifié" });
  const { uid } = session;
  if (!uid) return res.status(403).json({ error: "Compte sans uid (mode env-var)" });

  // ── POST : enregistrer une tentative ────────────────────────────────────
  if (req.method === "POST") {
    const { mode, subject, topic, level = null, question = null, answer_mode = null,
            result_ok, is_half, formula_ok = null, written_ok = null, points = 0 } = req.body || {};

    if (!mode || !subject || !topic || result_ok == null || is_half == null) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    await sql`
      INSERT INTO attempts
        (user_id, mode, subject, topic, level, question, answer_mode,
         result_ok, is_half, formula_ok, written_ok, points)
      VALUES
        (${uid}, ${mode}, ${subject}, ${topic}, ${level ?? null}, ${question ?? null},
         ${answer_mode ?? null}, ${!!result_ok}, ${!!is_half},
         ${formula_ok ?? null}, ${written_ok ?? null}, ${points ?? 0})
    `;

    const [{ score }] = await sql`SELECT COALESCE(SUM(points),0)::int AS score FROM attempts WHERE user_id=${uid}`;
    return res.status(200).json({ ok: true, score });
  }

  // ── GET : historique agrégé ──────────────────────────────────────────────
  if (req.method === "GET") {
    const [{ score }] = await sql`
      SELECT COALESCE(SUM(points),0)::int AS score FROM attempts WHERE user_id=${uid}
    `;

    // Streak : nombre de tentatives result_ok=true consécutives (les plus récentes)
    const rows = await sql`
      SELECT result_ok FROM attempts WHERE user_id=${uid} ORDER BY created_at DESC LIMIT 50
    `;
    let streak = 0;
    for (const r of rows) {
      if (r.result_ok) streak++; else break;
    }

    const recent = await sql`
      SELECT mode, subject, topic, result_ok, is_half, points, created_at
      FROM attempts WHERE user_id=${uid}
      ORDER BY created_at DESC LIMIT 20
    `;

    const byTopic = await sql`
      SELECT subject, topic,
        COUNT(*)::int                                               AS total,
        COUNT(*) FILTER (WHERE result_ok)::int                     AS correct,
        COALESCE(SUM(points),0)::int                               AS points
      FROM attempts WHERE user_id=${uid}
      GROUP BY subject, topic
      ORDER BY subject, topic
    `;

    return res.status(200).json({ score, streak, recent, byTopic });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
