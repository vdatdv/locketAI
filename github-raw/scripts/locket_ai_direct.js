// ============================================================
// Locket In-App AI Filter Direct (100% GitHub Raw · 0 Server)
// Chạy trực tiếp trên Shadowrocket/Loon/Surge khi bấm Filter trong Locket
// Hỗ trợ Img2Img (AI Horde R2 HTTPS) + Fallback Pollinations Flux
// ============================================================

(function () {
  const FILTER_HINTS = {
    flower_crown: "wearing a delicate fresh pastel flower crown on head, dreamy soft sunlight glow",
    cutesy: "soft rosy blush cheeks, adorable kawaii aesthetic, dreamy pastel tones, glowing skin",
    sticker_face: "playful cute pastel face stickers on cheeks, sparkling eyes",
    love_bug: "cute floating pink hearts around portrait, warm rosy lighting",
    princess: "wearing a sparkling crystal diamond tiara crown, fairytale royal glow",
    disco_lights: "colorful disco ball light reflections across face, party neon aesthetic",
    cash_money: "wearing cool dark sunglasses with floating dollar bills, studio lighting",
    slimed: "playful glossy neon green slime splashes effect, vibrant pop art lighting",
    happy_birthday: "festive birthday party confetti floating, warm candlelight bokeh",
    blonde_bleached: "platinum blonde bleached hairstyle transformation, realistic hair texture",
    bob_cut: "chic sleek chin-length bob haircut transformation, fashionable portrait",
    buns: "cute double space buns hairstyle, trendy street style portrait",
    tatted: "cool stylish artistic facial and neck tattoos, edgy editorial portrait",
    mohawk: "bold punk mohawk hairstyle transformation, dramatic studio lighting",
    braces: "cute smiling portrait with colorful sparkly orthodontic braces",
    beard: "full well-groomed realistic beard transformation, warm portrait lighting",
    bye_brows: "avant-garde bleached invisible eyebrows editorial fashion look",
    toothless: "hilarious goofy toothless smile comedy portrait effect",
    looks_maxxing: "sharp chiseled jawline dramatic black and white lighting",
    influencer: "glamorous studio ring-light influencer glow, flawless makeup",
    okay_wig: "wearing an exaggerated funny colorful wig, playful comedy portrait",
    wedding: "dressed in elegant white wedding attire with floral veil, romantic daylight",
    cowboy_cowgirl: "wearing a classic stylish cowboy hat and western denim jacket",
    giraffe: "funny giraffe ears and spotted pattern costume transformation",
    clown: "colorful artistic circus clown face paint and red nose",
    easter_bunney_cutout: "cute fluffy white bunny ears headband with pastel Easter flowers",
    easter_chick_cutout: "adorable sunny yellow chick theme, pastel spring flowers",
    leprechaun: "wearing a green lucky leprechaun top hat and four-leaf clovers",
    lucky_face: "four-leaf clover lucky bokeh sparkles, glowing golden-green portrait",
    sweet_hearts: "pastel Valentine candy hearts floating around, warm dreamy aesthetic",
    elf_cutout: "cute festive Christmas elf hat and pointed ears, holiday lights",
    santa_cutout: "wearing a cozy red Santa hat, warm Christmas tree lights bokeh",
    frosty: "magical winter snowfall ice crystals, frosty blue glow",
    photobooth: "Korean 4-cut photobooth photo strip grid, 4 playful poses, studio lighting",
    photobooth_cute: "cute pastel kawaii 4-cut photobooth collage strip with doodle stickers",
    pb_strawberry: "sweet strawberry frame 4-cut photobooth collage, soft pink daylight",
    pb_vintage: "retro Y2K vintage film 4-cut photobooth strip, subtle grain",
    pb_galaxy: "dreamy cosmic starry purple-blue 4-cut photobooth frame",
    pb_holo_4cut: "iridescent holographic foil 4-cut photobooth strip",
    rose_flower: "surrounded by blooming red and pink roses, romantic golden hour",
    golden_hour: "warm dreamy sunset golden hour sunlight glow",
    watercolor_art: "soft artistic watercolor painting portrait, pastel brush strokes",
    harry_potter: "wearing round glasses and wizard house scarf, magical Hogwarts glow",
    minecraft: "cute blocky 3D voxel cube pixel-art portrait transformation",
    superhero_cape: "wearing a heroic red superhero cape, dramatic cinematic lighting",
    pirate_hat: "wearing a classic pirate captain tricorne hat, adventure aesthetic",
    ocean_underwater: "underwater sunlight caustic ripples, dreamy aqua blue glow",
    fireworks: "bright colorful night fireworks bursting behind portrait"
  };

  function respondWithImage(imgUrl, provider, filterId) {
    const dataNode = {
      status: 200,
      outputUrl: imgUrl,
      output_url: imgUrl,
      url: imgUrl,
      imageUrl: imgUrl,
      image_url: imgUrl
    };
    const core = {
      ok: true,
      status: 200,
      provider: provider,
      filter_id: filterId || undefined,
      outputUrl: imgUrl,
      output_url: imgUrl,
      url: imgUrl,
      imageUrl: imgUrl,
      image_url: imgUrl,
      data: dataNode
    };
    const payload = Object.assign({}, core, { result: core });
    $done({
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(payload)
      }
    });
  }

  function buildPollinationsUrl(prompt) {
    const seed = Math.floor(Math.random() * 1000000);
    return "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) + "?width=768&height=1024&model=flux&seed=" + seed + "&nologo=true";
  }

  try {
    let raw = {};
    if (typeof $request !== "undefined" && $request && $request.body) {
      try {
        raw = JSON.parse($request.body);
      } catch (e) {}
    }
    const inner = (raw && raw.data && typeof raw.data === "object") ? raw.data : (raw || {});
    const merged = Object.assign({}, raw, inner, (inner && inner.filter && typeof inner.filter === "object") ? inner.filter : {});

    let filterId = String(
      merged.filter_id || merged.filterId || merged.sticker_id || merged.stickerId ||
      merged.preset_id || merged.presetId || merged.template_id || merged.effect_id ||
      merged.filter || ""
    ).trim().toLowerCase();
    if (filterId.startsWith("stk_dio_")) filterId = filterId.slice(8);
    else if (filterId.startsWith("stk_")) filterId = filterId.slice(4);

    const userPrompt = String(merged.prompt || merged.custom_prompt || merged.text || merged.description || "").trim();
    const hint = FILTER_HINTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter aesthetic" : "aesthetic portrait photography");
    const fullPrompt = [userPrompt, hint, "authentic candid 35mm portrait, natural lighting"].filter(Boolean).join(", ");

    const rawImg = String(
      merged.image_base64 || merged.imageBase64 || merged.photo_base64 ||
      merged.source_base64 || merged.input_base64 || merged.base64 ||
      ((merged.image && !/^https?:\/\//i.test(merged.image)) ? merged.image : "") ||
      ((merged.photo && !/^https?:\/\//i.test(merged.photo)) ? merged.photo : "") ||
      ""
    );
    const cleanBase64 = rawImg.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "").trim();

    if (cleanBase64.length < 64 || typeof $httpClient === "undefined") {
      respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-direct", filterId);
      return;
    }

    const submitBody = JSON.stringify({
      prompt: fullPrompt,
      params: {
        width: 512,
        height: 640,
        steps: 18,
        n: 1,
        sampler_name: "k_euler_a",
        denoising_strength: 0.58
      },
      source_image: cleanBase64,
      source_processing: "img2img",
      nsfw: false,
      censor_nsfw: true,
      r2: true
    });

    $httpClient.post(
      {
        url: "https://aihorde.net/api/v2/generate/async",
        headers: {
          "Content-Type": "application/json",
          "apikey": "0000000000",
          "Client-Agent": "LocketGitRawDirect:1.0:ios"
        },
        body: submitBody,
        timeout: 10
      },
      function (err, resp, data) {
        if (err || !data) {
          respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-fallback", filterId);
          return;
        }
        let jobId = "";
        try {
          jobId = JSON.parse(data).id || "";
        } catch (e) {}
        if (!jobId) {
          respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-fallback", filterId);
          return;
        }

        let attempts = 0;
        const maxAttempts = 12;
        function pollStatus() {
          attempts += 1;
          $httpClient.get(
            {
              url: "https://aihorde.net/api/v2/generate/check/" + jobId,
              headers: { "Client-Agent": "LocketGitRawDirect:1.0:ios" },
              timeout: 5
            },
            function (cErr, cResp, cBody) {
              let chk = {};
              try {
                chk = cBody ? JSON.parse(cBody) : {};
              } catch (e) {}
              if (chk.faulted || (!chk.done && attempts >= maxAttempts) || (attempts >= 3 && typeof chk.wait_time === "number" && chk.wait_time > 35)) {
                respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-fallback", filterId);
                return;
              }
              if (chk.done) {
                $httpClient.get(
                  {
                    url: "https://aihorde.net/api/v2/generate/status/" + jobId,
                    headers: { "Client-Agent": "LocketGitRawDirect:1.0:ios" },
                    timeout: 8
                  },
                  function (sErr, sResp, sBody) {
                    let imgUrl = "";
                    try {
                      const st = JSON.parse(sBody || "{}");
                      imgUrl = st.generations && st.generations[0] && st.generations[0].img ? st.generations[0].img : "";
                    } catch (e) {}
                    if (imgUrl && imgUrl.startsWith("http")) {
                      respondWithImage(imgUrl, "ai-horde-img2img-direct", filterId);
                    } else {
                      respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-fallback", filterId);
                    }
                  }
                );
                return;
              }
              setTimeout(pollStatus, 2000);
            }
          );
        }
        setTimeout(pollStatus, 2000);
      }
    );
  } catch (e) {
    respondWithImage(buildPollinationsUrl("aesthetic dreamy portrait"), "pollinations-safe-fallback", "");
  }
})();
