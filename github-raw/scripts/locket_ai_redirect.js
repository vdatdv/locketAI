// ============================================================
// Locket In-App AI & Filter Redirect (SHADOWROCKET)
// Dùng $httpClient.post gọi thẳng locketai.onrender.com/generateFilteredImage
// rồi trả response 200 JSON về Locket (tương thích 100% Shadowrocket/Loon/Surge)
// ============================================================

const TARGET_ENDPOINT = "https://locketai.onrender.com/generateFilteredImage";
const TARGET_HOST = "locketai.onrender.com";

(function () {
  if (typeof $response !== "undefined") {
    $done({});
    return;
  }
  try {
    if (typeof $request === "undefined" || !$request || typeof $httpClient === "undefined") {
      $done({});
      return;
    }
    const origUrl = String($request.url || "");
    let nextUrl = TARGET_ENDPOINT;
    if (origUrl.includes("?")) {
      const q = origUrl.split("?")[1];
      if (q) nextUrl += "?" + q;
    }
    const fwdHeaders = {};
    const origHeaders = $request.headers || {};
    for (const k of Object.keys(origHeaders)) {
      const low = k.toLowerCase();
      if (low === "host" || low === "content-length" || low.startsWith(":")) continue;
      fwdHeaders[k] = origHeaders[k];
    }
    fwdHeaders["Host"] = TARGET_HOST;
    fwdHeaders["Content-Type"] = "application/json";
    fwdHeaders["X-Locket-Proxy"] = "shadowrocket";

    let rawBody = $request.body || "{}";
    try {
      const parsed = JSON.parse(rawBody);
      if (parsed && typeof parsed === "object" && !parsed.original_url) {
        parsed.original_url = origUrl;
        rawBody = JSON.stringify(parsed);
      }
    } catch (e) {}

    $httpClient.post(
      {
        url: nextUrl,
        headers: fwdHeaders,
        body: rawBody,
        timeout: 55
      },
      function (err, resp, data) {
        if (err || !data) {
          $done({});
          return;
        }
        let cleanBody = String(data);
        try {
          const obj = JSON.parse(cleanBody);
          if (obj && typeof obj === "object") {
            delete obj.error;
            delete obj.errors;
            if (obj.result && typeof obj.result === "object") {
              delete obj.result.error;
              delete obj.result.errors;
            }
            cleanBody = JSON.stringify(obj);
          }
        } catch (e) {}

        $done({
          response: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*"
            },
            body: cleanBody
          }
        });
      }
    );
  } catch (e) {
    $done({});
  }
})();
