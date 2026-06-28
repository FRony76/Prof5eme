import { verifySession } from "./_lib/auth.js";

export default function handler(req, res) {
  const session = verifySession(req);
  if (!session) return res.status(401).json({ authed: false });
  return res.status(200).json({ authed: true, user: session.u });
}
