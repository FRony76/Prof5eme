import { neon } from "@neondatabase/serverless";

// Résolution de l'URL de connexion. Neon via la Marketplace Vercel préfixe
// souvent les variables (ex. PROF5EME_DATABASE_URL) ; on accepte les noms
// standards ET la variante préfixée, pour la connexion poolée (driver HTTP).
export function dbUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.PROF5EME_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PROF5EME_POSTGRES_URL ||
    null
  );
}

// Connexion paresseuse : neon() n'est appelé qu'à la première requête,
// pas au chargement du module. Évite tout crash à l'import si l'URL manque.
let _sql = null;
function getConn() {
  if (!_sql) {
    const url = dbUrl();
    if (!url) throw new Error("Aucune URL de base de données (DATABASE_URL ou PROF5EME_DATABASE_URL).");
    _sql = neon(url);
  }
  return _sql;
}

export const sql = (strings, ...values) => getConn()(strings, ...values);
