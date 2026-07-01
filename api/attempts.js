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
            result_ok, is_half, formula_ok = null, written_ok = null, points = 0,
            student_answer = null, photo_data = null, feedback = null, correct_answer = null } = req.body || {};

    if (!mode || !subject || !topic || result_ok == null || is_half == null) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const [{ id: attemptId }] = await sql`
      INSERT INTO attempts
        (user_id, mode, subject, topic, level, question, answer_mode,
         result_ok, is_half, formula_ok, written_ok, points)
      VALUES
        (${uid}, ${mode}, ${subject}, ${topic}, ${level ?? null}, ${question ?? null},
         ${answer_mode ?? null}, ${!!result_ok}, ${!!is_half},
         ${formula_ok ?? null}, ${written_ok ?? null}, ${points ?? 0})
      RETURNING id
    `;

    // Insérer les détails si au moins un champ est présent
    if (student_answer != null || photo_data != null || feedback != null || correct_answer != null) {
      await sql`
        INSERT INTO attempt_details (attempt_id, student_answer, photo_data, feedback, correct_answer)
        VALUES (${attemptId}, ${student_answer ?? null}, ${photo_data ?? null}, ${feedback ?? null}, ${correct_answer ?? null})
      `;
    }

    const [{ score }] = await sql`SELECT COALESCE(SUM(points),0)::int AS score FROM attempts WHERE user_id=${uid}`;
    return res.status(200).json({ ok: true, score });
  }

  // ── GET détail par id ────────────────────────────────────────────────────
  if (req.method === "GET" && req.query?.id) {
    const id = parseInt(req.query.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "id invalide" });

    const rows = await sql`
      SELECT
        a.id, a.mode, a.subject, a.topic, a.level, a.question, a.answer_mode,
        a.result_ok, a.is_half, a.formula_ok, a.written_ok, a.points, a.created_at,
        d.student_answer, d.photo_data, d.feedback, d.correct_answer
      FROM attempts a
      LEFT JOIN attempt_details d ON d.attempt_id = a.id
      WHERE a.id = ${id} AND a.user_id = ${uid}
    `;

    if (rows.length === 0) return res.status(404).json({ error: "Tentative introuvable" });
    return res.status(200).json(rows[0]);
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
      SELECT
        a.id, a.mode, a.subject, a.topic, a.result_ok, a.is_half, a.points, a.created_at,
        EXISTS(
          SELECT 1 FROM attempt_details d WHERE d.attempt_id = a.id AND d.photo_data IS NOT NULL
        ) AS has_photo
      FROM attempts a
      WHERE a.user_id = ${uid}
      ORDER BY a.created_at DESC LIMIT 20
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
