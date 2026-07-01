// Migration idempotente — exécuter avec :
//   node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless";
import { dbUrl } from "../api/_lib/db.js";

const url = dbUrl();
if (!url) { console.error("Aucune URL de base (DATABASE_URL ou PROF5EME_DATABASE_URL). Lance d'abord : vercel env pull .env.local"); process.exit(1); }
const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    display_name  TEXT,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'pupil',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS attempts (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode        TEXT NOT NULL,
    subject     TEXT NOT NULL,
    topic       TEXT NOT NULL,
    level       SMALLINT,
    question    TEXT,
    answer_mode TEXT,
    result_ok   BOOLEAN NOT NULL,
    is_half     BOOLEAN NOT NULL,
    formula_ok  BOOLEAN,
    written_ok  BOOLEAN,
    points      INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS idx_attempts_user_time  ON attempts(user_id, created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS idx_attempts_user_topic ON attempts(user_id, subject, topic)`;

await sql`
  CREATE TABLE IF NOT EXISTS attempt_details (
    attempt_id     BIGINT PRIMARY KEY REFERENCES attempts(id) ON DELETE CASCADE,
    student_answer TEXT,
    photo_data     TEXT,
    feedback       TEXT,
    correct_answer TEXT
  )
`;

console.log("Migration OK — tables users + attempts + attempt_details créées (idempotent).");
