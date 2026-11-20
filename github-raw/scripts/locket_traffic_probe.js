// ============================================================
// Locket Traffic Probe (Shadowrocket) — Dò URL & Payload thật của app Locket
// Không chặn hay sửa request, chỉ gửi tên URL + key JSON về tab API & Nhật ký
// ============================================================

const PROBE_URL = "https://locketai.onrender.com/api/locket/mitm-probe";
const targetUrl = $request.url || "";
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
const isTrackedHost =
  targetUrl.includes("locket") ||
  targetUrl.includes("firebaseremoteconfig.googleapis.com") ||
  targetUrl.includes("firestore.googleapis.com") ||
  targetUrl.includes("firebasestorage.googleapis.com");

if (
  targetUrl.includes("/api/locket/") ||
  targetUrl.includes("analytics.locketcamera.com") ||
  targetUrl.includes("cdn.locketcamera.com") ||
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
      keys = Object.keys(inner).slice(0, 12);
    }
  } catch (e) {}

  $httpClient.post(
    {
      url: PROBE_URL,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "req",
        method: $request.method || "POST",
        url: targetUrl,
        keys: keys,
        bodyPreview: ($request.body || "").slice(0, 220)
      }),
      timeout: 2
    },
    function () {
      $done({});
    }
  );
}
