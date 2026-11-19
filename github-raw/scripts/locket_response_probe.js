// ============================================================
// Locket Response Probe (Shadowrocket) — Đọc phản hồi getFilters / Filter API
// Không sửa response ($done({})), chỉ gửi cấu trúc JSON về tab API & Nhật ký
// ============================================================

const PROBE_URL = "https://locketai.onrender.com/api/locket/mitm-probe";
const targetUrl = $request.url || "";
if (targetUrl.includes("/api/locket/")) {
  $done({});
} else {
  const status = ($response && ($response.status || $response.statusCode)) || 0;
  const raw = ($response && $response.body) || "";

  let keys = [];
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    const inner = parsed && parsed.result ? parsed.result : parsed;
    if (inner && typeof inner === "object") {
      keys = Object.keys(inner).slice(0, 12);
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
        bodyPreview: String(raw).slice(0, 700)
      }),
      timeout: 2
    },
    function () {
      $done({});
    }
  );
}
