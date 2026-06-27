import crypto from "node:crypto";

// Génère un hash scrypt au format "saltHex:hashHex" pour AUTH_PASSWORD_HASH.
// Usage : node scripts/hash-password.mjs "monMotDePasse"
const pw = process.argv[2];
if (!pw) {
  console.error('Usage : node scripts/hash-password.mjs "<motdepasse>"');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pw, salt, 64);
console.log(`${salt.toString("hex")}:${hash.toString("hex")}`);
