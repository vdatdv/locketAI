// worker.js — Cloudflare Worker 0đ (Không Sleep, Không Giao Diện Web)
// Chỉ cần dán 1 file này lên dash.cloudflare.com -> Workers & Pages -> Deploy
const FILTER_PROMPTS = {
  practical_magic_2: "lush deep green vines and subtle roses with understated warm glowing fireflies, dreamy enchanted portrait",
  flower_crown: "wearing a delicate fresh pastel flower crown on head, dreamy soft sunlight glow",
  cutesy: "soft rosy blush cheeks, adorable kawaii aesthetic, glowing skin",
  sticker_face: "playful cute pastel face stickers on cheeks, sparkling eyes",
  love_bug: "cute floating pink hearts around portrait, warm rosy lighting",
  princess: "wearing a sparkling crystal diamond tiara crown, fairytale royal glow",
  disco_lights: "colorful disco ball light reflections, party neon aesthetic",
  cash_money: "wearing dark sunglasses with floating dollar bills, studio lighting",
  blonde_bleached: "platinum blonde bleached hairstyle transformation",
  bob_cut: "chic sleek chin-length bob haircut transformation",
  okay_wig: "wearing a funny colorful wig, playful portrait",
  looks_maxxing: "sharp chiseled jawline dramatic black and white portrait",
  wedding: "dressed in elegant white wedding attire, soft romantic daylight",
  clown: "colorful circus clown face paint and red nose",
  photobooth: "Korean 4-cut photobooth photo strip grid, 4 playful poses",
  pb_strawberry: "sweet strawberry frame 4-cut photobooth collage, pastel pink",
  santa_cutout: "wearing a cozy red Santa hat, warm Christmas lights bokeh"
};

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function runImg2ImgHorde(prompt, cleanBase64) {
  const hasSource = Boolean(cleanBase64 && cleanBase64.length > 64);
  const payload = {
    prompt,
    params: {
      width: 512,
      height: 640,
      steps: 20,
      n: 1,
      sampler_name: "k_euler_a",
      ...(hasSource ? { denoising_strength: 0.58 } : {})
    },
    ...(hasSource ? { source_image: cleanBase64, source_processing: "img2img" } : {}),
    nsfw: false,
    censor_nsfw: true,
    r2: true
  };
  const submit = await fetch("https://aihorde.net/api/v2/generate/async", {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: "0000000000", "Client-Agent": "LocketCFWorker:1.0" },
    body: JSON.stringify(payload)
  });
  if (!submit.ok) throw new Error("Horde submit " + submit.status);
  const { id } = await submit.json();
  if (!id) throw new Error("Missing Horde id");

  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 1800));
    const chk = await (await fetch("https://aihorde.net/api/v2/generate/check/" + id)).json();
    if (chk.faulted || chk.is_possible === false) throw new Error("Horde faulted");
    if (chk.done) {
      const st = await (await fetch("https://aihorde.net/api/v2/generate/status/" + id)).json();
      const imgUrl = st.generations?.[0]?.img;
      if (imgUrl && imgUrl.startsWith("http")) return imgUrl;
      throw new Error("Empty Horde url");
    }
  }
  throw new Error("Horde timeout");
}

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Locket-Proxy"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") {
      return Response.json({ ok: true, service: "Locket In-App Filter Worker (0đ)", img2img: true }, { headers: cors });
    }

    try {
      const raw = await request.json().catch(() => ({}));
      const body = (raw && raw.data && typeof raw.data === "object") ? raw.data : raw;
      let filterId = String(body.filter_id || body.filterId || body.look_id || body.lookId || body.sticker_id || "").trim().toLowerCase();
      filterId = filterId.replace(/^stk_dio_/, "").replace(/^stk_/, "");
      const hint = FILTER_PROMPTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter" : "aesthetic portrait");
      const rawPrompt = String(body.prompt || body.custom_prompt || body.user_prompt || body.text || "").trim();
      const fullPrompt = [rawPrompt, hint, "authentic candid 35mm portrait"].filter(Boolean).join(", ");

      let cleanBase64 = String(body.image_base64 || body.imageBase64 || body.photo_base64 || body.base64 || "")
        .replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "")
        .trim();

      let imgUrlField = String(body.image_url || body.imageUrl || body.source_url || body.photo_url || "");
      const storagePathField = String(body.storage_path || body.storagePath || body.image_path || "").trim();
      if (!imgUrlField && storagePathField && storagePathField.includes("/")) {
        imgUrlField = "https://firebasestorage.googleapis.com/v0/b/locket-img/o/" + encodeURIComponent(storagePathField.replace(/^\/+/, "")) + "?alt=media";
      }
      if (!cleanBase64 && /^https?:\/\//i.test(imgUrlField)) {
        const fwdHeaders = {};
        const auth = request.headers.get("authorization");
        const appCheck = request.headers.get("x-firebase-appcheck");
        if (auth) fwdHeaders["Authorization"] = auth;
        if (appCheck) fwdHeaders["X-Firebase-AppCheck"] = appCheck;
        const imgRes = await fetch(imgUrlField, { headers: fwdHeaders });
        if (imgRes.ok) cleanBase64 = arrayBufferToBase64(await imgRes.arrayBuffer());
      }

      let outputUrl = "";
      let provider = cleanBase64.length > 64 ? "ai-horde-img2img" : "ai-horde-txt2img";
      try {
        outputUrl = await runImg2ImgHorde(fullPrompt, cleanBase64);
      } catch {
        const seed = Math.floor(Math.random() * 1000000);
        const cappedPrompt = fullPrompt.slice(0, 550);
        outputUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(cappedPrompt) + "?width=768&height=1024&model=flux&seed=" + seed + "&nologo=true";
        provider = "pollinations-fallback";
      }

      const dataNode = { status: 200, id: filterId || "custom_look", name: filterId || "custom_look", outputUrl, output_url: outputUrl, filtered_image_url: outputUrl, filteredImageUrl: outputUrl, result_url: outputUrl, thumbnail_url: outputUrl, preview_url: outputUrl, url: outputUrl, imageUrl: outputUrl, image_url: outputUrl };
      const payload = { ok: true, status: 200, provider, filter_id: filterId || undefined, prompt: rawPrompt || filterId || undefined, ...dataNode, data: dataNode };
      return Response.json({ ...payload, result: payload }, { status: 200, headers: cors });
    } catch (err) {
      return Response.json({ ok: false, error: err.message }, { status: 500, headers: cors });
    }
  }
};
