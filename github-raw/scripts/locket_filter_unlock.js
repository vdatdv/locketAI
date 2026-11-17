// ============================================================
// Locket Filter & Gold Account Unlock (Clean Self-Hosted)
// Mở khóa quyền can_use_filters, can_generate_filtered_image, Gold badge
// trên api.locketcamera.com — KHÔNG gửi dữ liệu sang server/worker ngoài.
// ============================================================

(function () {
  const reqUrl = typeof $request !== "undefined" && $request && $request.url ? String($request.url) : "";

  if (typeof $response === "undefined") {
    if (reqUrl.includes("changeProfileInfo")) {
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      };
      const payload = {
        badge: "locket_gold",
        badge_tier: "gold",
        is_gold: true,
        success: true
      };
      $done({
        response: {
          status: 200,
          headers: headers,
          body: JSON.stringify({ data: payload, result: payload })
        }
      });
      return;
    }

    const headers = Object.assign({}, ($request && $request.headers) || {});
    for (const k of Object.keys(headers)) {
      const low = k.toLowerCase();
      if (low === "if-none-match" || low === "if-modified-since" || low === "x-revenuecat-etag") {
        delete headers[k];
      }
    }
    $done({ headers: headers });
    return;
  }

  if (reqUrl.includes("generateFilteredImage") || reqUrl.includes("createFilteredImage")) {
    $done({});
    return;
  }

  let body = ($response && $response.body) || "";
  let status = ($response && ($response.status || $response.statusCode)) || 200;

  if (body && typeof body === "string") {
    try {
      let obj = JSON.parse(body);
      const isFriendsOrFeed = /getFriends|getUsers|fetchFriends|getRecipients|recipients|moments|fetchMoments|getMoments|contacts|postMoment|getGroupMessages/i.test(reqUrl);

      if (!isFriendsOrFeed && (status === 400 || status === 401 || status === 403)) {
        status = 200;
      }

      const applyGoldAndFilterAccess = (target) => {
        if (!target || typeof target !== "object" || Array.isArray(target)) return;
        target.badge = "locket_gold";
        target.badge_tier = "gold";
        target.show_badge = true;
        target.is_gold = true;
        target.has_gold = true;
        target.gold = true;
        target.gold_subscription = true;
        target.has_gold_subscription = true;
        target.tier = "gold";
        target.subscription_status = "active";
        target.can_use_filters = true;
        target.can_use_gold_features = true;
        target.can_generate_filtered_image = true;
        target.can_create_filtered_image = true;
        target.has_ai_access = true;
        target.filter_access = true;
      };

      const isSingleUserEndpoint = !isFriendsOrFeed && /getUser|fetchUser|getAccount|accountInfo|userProfile|getSubscription|subscription|clientData/i.test(reqUrl);
      const isSingleUserObject = Boolean(
        !isFriendsOrFeed &&
        obj && (
          isSingleUserEndpoint ||
          (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) && obj.data.email) ||
          (obj.result && typeof obj.result === "object" && !Array.isArray(obj.result) && obj.result.email) ||
          (obj.user && typeof obj.user === "object" && !Array.isArray(obj.user) && obj.user.email)
        )
      );

      if (isSingleUserObject) {
        applyGoldAndFilterAccess(obj);
        if (obj.data && typeof obj.data === "object") applyGoldAndFilterAccess(obj.data);
        if (obj.result && typeof obj.result === "object") applyGoldAndFilterAccess(obj.result);
        if (obj.user && typeof obj.user === "object") applyGoldAndFilterAccess(obj.user);
      }

      const falseKeys = [
        "is_locked", "locked", "requires_gold", "require_gold", "gold_only",
        "is_gold_only", "paywall", "show_paywall", "show_upsell", "upsell",
        "blurred", "is_blurred", "needs_gold"
      ];
      const trueKeys = [
        "can_view", "unlocked", "is_unlocked", "is_free", "free",
        "can_use_filter", "allowed", "can_use_filters",
        "can_generate_filtered_image", "can_create_filtered_image",
        "has_ai_access", "filter_access"
      ];

      const transformNode = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          for (let i = 0; i < node.length; i++) transformNode(node[i]);
          return;
        }
        const isSelfNode = Boolean(
          ("email" in node && typeof node.email === "string" && node.email.includes("@")) ||
          ("push_token" in node && node.push_token) ||
          ("fcm_token" in node && node.fcm_token)
        );
        if (isSelfNode) {
          applyGoldAndFilterAccess(node);
        }
        for (const k of falseKeys) {
          if (k in node) node[k] = false;
        }
        for (const k of trueKeys) {
          if (k in node) node[k] = true;
        }
        const clearUrl = node.unblurred_url || node.unlocked_url || node.result_url || node.image_url || node.transformed_image_url || node.url;
        if (typeof clearUrl === "string" && clearUrl.startsWith("http")) {
          if ("blurred_url" in node) node.blurred_url = clearUrl;
          if ("blurred_image_url" in node) node.blurred_image_url = clearUrl;
          if ("preview_url" in node && node.is_blurred) node.preview_url = clearUrl;
        }
        for (const key of Object.keys(node)) {
          if (node[key] && typeof node[key] === "object") {
            transformNode(node[key]);
          }
        }
      };

      transformNode(obj);
      body = JSON.stringify(obj);
    } catch (e) {}
  }

  const respHeaders = Object.assign({}, ($response && $response.headers) || {});
  delete respHeaders["Content-Encoding"];
  delete respHeaders["content-encoding"];
  delete respHeaders["Content-Length"];
  delete respHeaders["content-length"];
  delete respHeaders["Transfer-Encoding"];
  delete respHeaders["transfer-encoding"];
  respHeaders["content-type"] = "application/json; charset=utf-8";

  $done({ status: status, headers: respHeaders, body: body });
})();
