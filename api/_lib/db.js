import { neon } from "@neondatabase/serverless";

// Connexion paresseuse : neon() n'est appelé qu'à la première requête,
// pas au chargement du module. Évite l'erreur si DATABASE_URL n'est pas encore injectée.
let _sql = null;
function getConn() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

export const sql = (strings, ...values) => getConn()(strings, ...values);
