export async function callGemini(system, userMsg, imageBase64 = null, imageMediaType = "image/jpeg") {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userMsg, imageBase64, imageMediaType }),
  });
  if (res.status === 401) {
    window.dispatchEvent(new Event("auth-expired"));
    throw new Error("Non authentifié");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[callGemini]", res.status, body);
    throw new Error(`API ${res.status}`);
  }
  const { text } = await res.json();
  return JSON.parse((text || "{}").replace(/```(?:json)?\s*|\s*```/g, "").trim());
}

// Fire-and-forget — un échec réseau ne bloque jamais l'UX.
export async function recordAttempt(payload) {
  try {
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch { /* ignore */ }
}

export async function fetchHistory() {
  try {
    const res = await fetch("/api/attempts");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAttemptDetail(id) {
  const res = await fetch(`/api/attempts?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return await res.json();
}
