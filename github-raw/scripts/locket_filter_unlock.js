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
    let changed = false;
    for (const k of Object.keys(headers)) {
      const low = k.toLowerCase();
      if (low === "if-none-match" || low === "if-modified-since" || low === "x-revenuecat-etag") {
        delete headers[k];
        changed = true;
      }
    }
    $done(changed ? { headers: headers } : {});
    return;
  }

  if (/generateFilteredImage|createFilteredImage|generateLook|createLook|applyLook|renderLook|generateAppearance|createAppearance|createUserFilter|createCustomFilter/i.test(reqUrl)) {
    $done({});
    return;
  }

  const body = ($response && $response.body) || "";
  const origStatus = ($response && ($response.status || $response.statusCode)) || 200;

  if (!body || typeof body !== "string") {
    $done({});
    return;
  }

  let obj = null;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    $done({});
    return;
  }

  if (!obj || typeof obj !== "object") {
    $done({});
    return;
  }

  const isFriendsOrFeed = /getFriends|getUsers|fetchFriends|getRecipients|recipients|moments|fetchMoments|getMoments|contacts|postMoment|getGroupMessages/i.test(reqUrl);
  const upgradedStatus = !isFriendsOrFeed && (origStatus === 400 || origStatus === 401 || origStatus === 403);

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
    target.can_create_custom_filters = true;
    target.can_create_looks = true;
    target.allows_custom_filters = true;
    target.ai_filters_enabled = true;
    target.custom_filters_enabled = true;
    target.filter_generation_enabled = true;
    target.eligible = true;
    target.is_eligible = true;
    target.can_use_photobooth = true;
    target.photobooth_access = true;
    target.unlimited_filters = true;
    target.has_ai_access = true;
    target.filter_access = true;
    target.remaining_filters = 999;
    target.filter_credits = 999;
    target.filters_remaining = 999;
    target.daily_filter_limit = 999;
    target.custom_filter_credits = 999;
    target.custom_filters_remaining = 999;
    target.looks_remaining = 999;
  };

  const isSingleUserEndpoint = !isFriendsOrFeed && /getUser|fetchUser|getAccount|accountInfo|userProfile|getSubscription|subscription|clientData|filter|look|credit|eligib|feature|photobooth|entitle/i.test(reqUrl);
  const isSingleUserObject = Boolean(
    !isFriendsOrFeed &&
    (
      isSingleUserEndpoint ||
      (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data) && obj.data.email) ||
      (obj.result && typeof obj.result === "object" && !Array.isArray(obj.result) && obj.result.email) ||
      (obj.user && typeof obj.user === "object" && !Array.isArray(obj.user) && obj.user.email)
    )
  );

  if (isSingleUserObject) {
    applyGoldAndFilterAccess(obj);
    if (obj.data && typeof obj.data === "object") applyGoldAndFilterAccess(obj.data);
    if (obj.result && typeof obj.result === "object") {
      applyGoldAndFilterAccess(obj.result);
      if (obj.result.data && typeof obj.result.data === "object") applyGoldAndFilterAccess(obj.result.data);
    }
    if (obj.user && typeof obj.user === "object") applyGoldAndFilterAccess(obj.user);
  }

  const falseKeys = [
    "is_locked", "locked", "requires_gold", "require_gold", "gold_only",
    "is_gold_only", "paywall", "show_paywall", "show_upsell", "upsell",
    "blurred", "is_blurred", "needs_gold", "limit_reached", "quota_exceeded",
    "credits_exhausted"
  ];
  const trueKeys = [
    "can_view", "unlocked", "is_unlocked", "is_free", "free",
    "can_use_filter", "allowed", "can_use_filters",
    "can_generate_filtered_image", "can_create_filtered_image",
    "can_create_custom_filters", "can_create_looks", "allows_custom_filters",
    "ai_filters_enabled", "custom_filters_enabled", "filter_generation_enabled",
    "eligible", "is_eligible", "can_use_photobooth", "photobooth_access",
    "unlimited_filters", "has_ai_access", "filter_access"
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

  if (/getfilters/i.test(reqUrl)) {
    const NATIVE_FILTER_CATALOG = [
      { id: "practical_magic_2", name: "Practical Magic 2", category: "Events", icon: "https://storage.googleapis.com/locket-public/camera_filters/icons/pm2_cutout.png" },
      { id: "flower_crown", name: "Flower Crown", category: "Cute" },
      { id: "cutesy", name: "Cutesy", category: "Cute" },
      { id: "sticker_face", name: "Sticker Face", category: "Cute" },
      { id: "love_bug", name: "Love Bug", category: "Cute" },
      { id: "princess", name: "Princess", category: "Celebrate" },
      { id: "disco_lights", name: "Disco Lights", category: "Celebrate" },
      { id: "cash_money", name: "Cash Money", category: "Celebrate" },
      { id: "happy_birthday", name: "Happy Birthday", category: "Celebrate" },
      { id: "blonde_bleached", name: "Blonde Bleached", category: "Looks" },
      { id: "bob_cut", name: "Bob Cut", category: "Looks" },
      { id: "buns", name: "Space Buns", category: "Looks" },
      { id: "tatted", name: "Tatted", category: "Looks" },
      { id: "mohawk", name: "Mohawk", category: "Looks" },
      { id: "okay_wig", name: "Okay Wig", category: "Goofy" },
      { id: "influencer", name: "Influencer", category: "Goofy" },
      { id: "looks_maxxing", name: "Looks Maxxing", category: "Goofy" },
      { id: "wedding", name: "Wedding", category: "Costumes" },
      { id: "cowboy_cowgirl", name: "Cowboy", category: "Costumes" },
      { id: "clown", name: "Clown", category: "Costumes" },
      { id: "photobooth", name: "Photobooth 4-Cut", category: "Photobooth" },
      { id: "photobooth_cute", name: "Photobooth Cute", category: "Photobooth" },
      { id: "pb_strawberry", name: "Strawberry Strip", category: "Photobooth" },
      { id: "pb_vintage", name: "Vintage Y2K", category: "Photobooth" },
      { id: "pb_galaxy", name: "Galaxy 4-Cut", category: "Photobooth" },
      { id: "pb_holo_4cut", name: "Holo 4-Cut", category: "Photobooth" },
      { id: "golden_hour", name: "Golden Hour", category: "Artistic" },
      { id: "watercolor_art", name: "Watercolor Art", category: "Artistic" },
      { id: "harry_potter", name: "Wizard", category: "Costumes" }
    ].map(function (item, idx) {
      return {
        id: item.id,
        filter_id: item.id,
        slug: item.id,
        name: item.name,
        display_name: item.name,
        category: item.category,
        type: "ai",
        is_locked: false,
        requires_gold: false,
        is_gold_only: false,
        unlocked: true,
        is_unlocked: true,
        is_free: true,
        can_use: true,
        enabled: true,
        sort_order: idx + 1
      };
    });

    const populateFiltersContainer = (container) => {
      if (!container || typeof container !== "object") return;
      if (!Array.isArray(container.filters) || container.filters.length === 0) {
        container.filters = NATIVE_FILTER_CATALOG;
      }
      if (!Array.isArray(container.friend_filters)) {
        container.friend_filters = [];
      }
      container.can_use_filters = true;
      container.can_generate_filtered_image = true;
      container.can_create_custom_filters = true;
      container.can_create_looks = true;
      container.allows_custom_filters = true;
      container.ai_filters_enabled = true;
      container.custom_filters_enabled = true;
      container.filter_generation_enabled = true;
      container.can_use_photobooth = true;
      container.filters_enabled = true;
    };

    if (obj.result && obj.result.data && typeof obj.result.data === "object") {
      populateFiltersContainer(obj.result.data);
    } else if (obj.data && typeof obj.data === "object") {
      populateFiltersContainer(obj.data);
    } else if (obj.result && typeof obj.result === "object") {
      populateFiltersContainer(obj.result);
    } else {
      populateFiltersContainer(obj);
    }
  }

  const finalBody = JSON.stringify(obj);

  if (upgradedStatus) {
    $done({
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: finalBody
    });
    return;
  }

  $done({ body: finalBody });
})();
