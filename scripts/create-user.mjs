// Crée un compte élève dans la base Neon.
// Usage : node --env-file=.env.local scripts/create-user.mjs <username> <password> [role]
// role : 'pupil' (défaut) ou 'admin'
import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";

const [username, password, role = "pupil"] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage : node scripts/create-user.mjs <username> <password> [role]");
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

const sql = neon(process.env.DATABASE_URL);
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
