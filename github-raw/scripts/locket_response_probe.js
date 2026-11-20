// ============================================================
// Locket Response Probe (Shadowrocket) — Đọc phản hồi Filter API thật
// Không sửa response ($done({})), tự ẩn token và gửi cấu trúc JSON về API & Nhật ký
// ============================================================

const PROBE_URL = "https://locketai.onrender.com/api/locket/mitm-probe";
const targetUrl = $request.url || "";

function sanitizePreview(str) {
  return String(str || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[JWT_REDACTED]")
    .slice(0, 500);
}

if (
  targetUrl.includes("/api/locket/") ||
  targetUrl.includes("firebasestorage.googleapis.com")
) {
  $done({});
} else {
  const status = ($response && ($response.status || $response.statusCode)) || 0;
  const raw = ($response && $response.body) || "";

  let keys = [];
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    const inner = parsed && parsed.result ? parsed.result : parsed;
    if (inner && typeof inner === "object") {
      keys = Object.keys(inner).slice(0, 14);
    }
  } catch (e) {}

  $httpClient.post(
    {
      url: PROBE_URL,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "res",
        status: status,
        method: "RES",
        url: targetUrl,
        keys: keys,
        bodyPreview: sanitizePreview(raw)
      }),
      timeout: 2
    },
    function () {
      $done({});
    }
  );
}
