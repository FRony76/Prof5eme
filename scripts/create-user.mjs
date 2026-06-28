// Crée un compte élève dans la base Neon.
// Usage : node --env-file=.env.local scripts/create-user.mjs <username> <password> [role]
// role : 'pupil' (défaut) ou 'admin'
import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { dbUrl } from "../api/_lib/db.js";

const [username, password, role = "pupil"] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage : node scripts/create-user.mjs <username> <password> [role]");
  process.exit(1);
}

const url = dbUrl();
if (!url) { console.error("Aucune URL de base (DATABASE_URL ou PROF5EME_DATABASE_URL). Lance d'abord : vercel env pull .env.local"); process.exit(1); }

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

const sql = neon(url);
const [row] = await sql`
  INSERT INTO users (username, password_hash, role)
  VALUES (${username}, ${passwordHash}, ${role})
  ON CONFLICT (username) DO NOTHING
  RETURNING id
`;

if (!row) {
  console.error(`Utilisateur "${username}" existe déjà.`);
  process.exit(1);
}
console.log(`Utilisateur "${username}" créé (id=${row.id}, role=${role}).`);
