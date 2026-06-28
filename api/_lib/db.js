import { neon } from "@neondatabase/serverless";

// sql est une fonction tag qui exécute des requêtes paramétrées via le driver HTTP Neon.
// DATABASE_URL est injectée par Vercel → Storage (Neon Marketplace).
export const sql = neon(process.env.DATABASE_URL);
