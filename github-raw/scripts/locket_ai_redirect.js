// ============================================================
// Locket In-App AI & Filter Redirect (SHADOWROCKET)
// Chuyển hướng trực tiếp POST /generateFilteredImage từ app Locket
// về máy chủ AI 0đ của bạn (giữ nguyên toàn bộ body ảnh selfie + filter)
// ============================================================

const TARGET_ENDPOINT = "https://locketai.onrender.com/generateFilteredImage";
const TARGET_HOST = "locketai.onrender.com";

if (typeof $response === "undefined") {
  try {
    if (typeof $request === "undefined" || !$request) {
      $done({});
    } else {
      const origUrl = String($request.url || "");
      let nextUrl = TARGET_ENDPOINT;
      if (origUrl.includes("?")) {
        const q = origUrl.split("?")[1];
        if (q) nextUrl += "?" + q;
      }
      const headers = Object.assign({}, $request.headers || {});
      headers["Host"] = TARGET_HOST;
      headers["host"] = TARGET_HOST;
      headers["X-Locket-Proxy"] = "shadowrocket";
      $done({ url: nextUrl, headers: headers });
    }
  } catch (e) {
    $done({});
  }
} else {
  try {
    let obj = {};
    if ($response.body) {
      try {
        obj = JSON.parse($response.body);
      } catch (e) {
        obj = {};
      }
    }
    delete obj.error;
    delete obj.errors;
    if (obj.result && typeof obj.result === "object") {
      delete obj.result.error;
      delete obj.result.errors;
    }
    $done({
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(obj)
    });
  } catch (e) {
    $done({});
  }
}
