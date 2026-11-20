// ============================================================
// Locket Traffic Probe (Shadowrocket) — Dò URL & Payload thật của app Locket
// Không chặn hay sửa request, bỏ qua upload nhị phân Firebase Storage để không gây treo
// ============================================================

const PROBE_URL = "https://locketai.onrender.com/api/locket/mitm-probe";
const targetUrl = $request.url || "";
const method = String($request.method || "POST").toUpperCase();
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
const isTrackedHost =
  targetUrl.includes("locket") ||
  targetUrl.includes("firebaseremoteconfig.googleapis.com") ||
  targetUrl.includes("firestore.googleapis.com");

function sanitizePreview(str) {
  return String(str || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[JWT_REDACTED]")
    .slice(0, 420);
}

if (
  method === "PUT" ||
  targetUrl.includes("/api/locket/") ||
  targetUrl.includes("analytics.locketcamera.com") ||
  targetUrl.includes("cdn.locketcamera.com") ||
  targetUrl.includes("firebasestorage.googleapis.com") ||
  /getMoments|fetchMoments|getGroupMessages|getLatestMoment/i.test(targetUrl) ||
  (!ua.includes("Locket") && !isTrackedHost)
) {
  $done({});
} else {
  let keys = [];
  try {
    const parsed = $request.body ? JSON.parse($request.body) : {};
    const inner = parsed && parsed.data ? parsed.data : parsed;
    if (inner && typeof inner === "object") {
      keys = Object.keys(inner).slice(0, 14);
    }
  } catch (e) {}

  $httpClient.post(
    {
      url: PROBE_URL,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "req",
        method: method,
        url: targetUrl,
        keys: keys,
        bodyPreview: sanitizePreview($request.body || "")
      }),
      timeout: 2
    },
    function () {
      $done({});
    }
  );
}
