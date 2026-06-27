import { verifySession } from "./_lib/auth.js";

export default function handler(req, res) {
  const user = verifySession(req);
  if (!user) return res.status(401).json({ authed: false });
  return res.status(200).json({ authed: true, user });
}
