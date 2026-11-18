// ============================================================
// Locket Caption AI Filter Override (SHADOWROCKET)
// Can thiệp trực tiếp khi gửi ảnh (postMomentV2):
// Nếu chọn caption "AI · ..." (caption:ai_filter_*) hoặc gõ "#ai <mô tả>",
// ảnh selfie sẽ tự động biến hình Img2Img trước khi đăng lên Locket!
// Nếu gửi ảnh bình thường -> cho qua ngay lập tức (<1ms).
// ============================================================

const MOMENT_AI_ENDPOINT = "https://locketai.onrender.com/api/locket/moment-ai-filter";

(function () {
  if (typeof $response !== "undefined" || typeof $request === "undefined" || !$request || !$request.body) {
    $done({});
    return;
  }

  let parsed = null;
  try {
    parsed = JSON.parse($request.body);
  } catch (e) {
    $done({});
    return;
  }
  if (!parsed || typeof parsed !== "object") {
    $done({});
    return;
  }

  const inner = (parsed.data && typeof parsed.data === "object") ? parsed.data : parsed;
  const captionStr = String(inner.caption || "").trim();
  const overlays = Array.isArray(inner.overlays) ? inner.overlays : [];
  const hasAiOverlay = overlays.some(function (ov) {
    const id = String((ov && (ov.overlay_id || ov.id)) || "");
    return id.indexOf("caption:ai_filter_") === 0;
  });
  const hasAiTag = /^#ai\b|^\/ai\b|^ai:/i.test(captionStr);

  if (!hasAiOverlay && !hasAiTag) {
    $done({});
    return;
  }

  if (typeof $httpClient === "undefined") {
    $done({});
    return;
  }

  const origHeaders = $request.headers || {};
  const fwdHeaders = {};
  for (const k of Object.keys(origHeaders)) {
    const low = k.toLowerCase();
    if (low === "authorization" || low === "x-firebase-appcheck" || low === "user-agent") {
      fwdHeaders[k] = origHeaders[k];
    }
  }

  $httpClient.post(
    {
      url: MOMENT_AI_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        "X-Locket-Proxy": "shadowrocket"
      },
      body: JSON.stringify({
        originalUrl: String($request.url || ""),
        headers: fwdHeaders,
        payload: parsed
      }),
      timeout: 55
    },
    function (err, resp, data) {
      if (err || !data) {
        $done({});
        return;
      }
      try {
        const resObj = JSON.parse(data);
        if (resObj && resObj.ok && resObj.payload) {
          $done({ body: JSON.stringify(resObj.payload) });
          return;
        }
      } catch (e) {}
      $done({});
    }
  );
})();
