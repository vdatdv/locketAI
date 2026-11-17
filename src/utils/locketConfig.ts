export type ProxyClient = 'shadowrocket' | 'loon' | 'surge' | 'quantumultx';
export type AspectRatioOption = '1:1' | '3:4' | '9:16';
export type FreeAiModel = 'flux' | 'turbo' | 'anime';
export type DeployPlatform = 'render' | 'railway' | 'vercel' | 'termux';

export interface LocketCaptionPreset {
  id: string;
  section: string;
  text: string;
  emoji: string;
  colors: [string, string, string];
  textColor: string;
}

export interface LocketFilterPreset {
  id: string;
  category: string;
  label: string;
  promptInstruction: string;
}

export interface AiStylePreset {
  id: string;
  label: string;
  promptSuffix: string;
  recommendedModel: FreeAiModel;
}

// Matches Locket AI & Filter endpoints across Cloud Functions v1/v2 & Locket API while excluding normal postMoment uploads
export const DEFAULT_SHADOWROCKET_AI_PATTERN =
  '^https:\\/\\/(.*locketcamera\\.com|.*cloudfunctions\\.net|.*-uc\\.a\\.run\\.app)\\/(?!.*(postMoment|getMoment|latestMoment|fetchUser|getUser|account|login|streak|reaction|chat|message|friend|telemetry|log)).*(ai|filter|generate|remix|style|customFilter|applyFilter|effect|magic|transform|edit|look|portrait|restyle|face|nano|gemini).*';

export const LOCKET_FILTERS: LocketFilterPreset[] = [
  {
    id: 'none',
    category: 'Mặc định',
    label: 'Không dùng Filter Locket',
    promptInstruction: '',
  },
  // Cute
  {
    id: 'flower_crown',
    category: 'Cute',
    label: 'Flower Crown (Vòng hoa)',
    promptInstruction: 'wearing a delicate fresh pastel flower crown on head, dreamy soft sunlight glow',
  },
  {
    id: 'cutesy',
    category: 'Cute',
    label: 'Cutesy (Dễ thương)',
    promptInstruction: 'soft rosy blush cheeks, adorable kawaii aesthetic, dreamy pastel tones, glowing skin',
  },
  {
    id: 'sticker_face',
    category: 'Cute',
    label: 'Sticker Face',
    promptInstruction: 'playful cute pastel face stickers on cheeks, sparkling eyes, bright cheerful portrait',
  },
  {
    id: 'love_bug',
    category: 'Cute',
    label: 'Love Bug',
    promptInstruction: 'cute floating pink hearts around portrait, warm romantic rosy lighting',
  },
  // Celebrate
  {
    id: 'princess',
    category: 'Celebrate',
    label: 'Princess (Công chúa)',
    promptInstruction: 'wearing a sparkling crystal diamond tiara crown, fairytale royal glow, soft bokeh sparkles',
  },
  {
    id: 'disco_lights',
    category: 'Celebrate',
    label: 'Disco Lights',
    promptInstruction: 'colorful disco ball light reflections across face and background, vibrant party neon aesthetic',
  },
  {
    id: 'cash_money',
    category: 'Celebrate',
    label: 'Cash Money',
    promptInstruction: 'wearing cool dark sunglasses with floating dollar bills around, flashy hip-hop studio lighting',
  },
  {
    id: 'slimed',
    category: 'Celebrate',
    label: 'Slimed',
    promptInstruction: 'playful glossy neon green slime splashes effect, vibrant studio pop art lighting',
  },
  {
    id: 'happy_birthday',
    category: 'Celebrate',
    label: 'Happy Birthday',
    promptInstruction: 'festive birthday party confetti floating, warm celebratory candlelight bokeh',
  },
  // Looks
  {
    id: 'blonde_bleached',
    category: 'Looks',
    label: 'Blonde Bleached (Tóc vàng)',
    promptInstruction: 'platinum blonde bleached hairstyle transformation, natural realistic hair texture, studio portrait',
  },
  {
    id: 'bob_cut',
    category: 'Looks',
    label: 'Bob Cut (Tóc ngắn)',
    promptInstruction: 'chic sleek chin-length bob haircut transformation, fashionable editorial portrait',
  },
  {
    id: 'buns',
    category: 'Looks',
    label: 'Space Buns (Tóc búi)',
    promptInstruction: 'cute double space buns hairstyle, youthful trendy street style portrait',
  },
  {
    id: 'tatted',
    category: 'Looks',
    label: 'Tatted (Hình xăm)',
    promptInstruction: 'stylish artistic minimalist tattoos, edgy urban fashion portrait',
  },
  {
    id: 'mohawk',
    category: 'Looks',
    label: 'Mohawk',
    promptInstruction: 'bold punk mohawk hairstyle transformation, dramatic rock concert lighting',
  },
  {
    id: 'braces',
    category: 'Looks',
    label: 'Braces (Niềng răng)',
    promptInstruction: 'cute smiling portrait with colorful orthodontic braces, bright cheerful lighting',
  },
  {
    id: 'beard',
    category: 'Looks',
    label: 'Beard (Râu quai nón)',
    promptInstruction: 'well-groomed full stylish beard transformation, natural realistic lighting',
  },
  {
    id: 'bowling_ball',
    category: 'Looks',
    label: 'Bowling Ball (Đầu trọc)',
    promptInstruction: 'smooth shiny bald head transformation, humorous realistic studio portrait',
  },
  // Goofy
  {
    id: 'okay_wig',
    category: 'Goofy',
    label: 'Okay Wig (Tóc giả hài)',
    promptInstruction: 'wearing an exaggerated funny colorful wig, playful comedic portrait',
  },
  {
    id: 'influencer',
    category: 'Goofy',
    label: 'Influencer',
    promptInstruction: 'glamorous beauty influencer ring-light glow, dramatic glossy makeup look',
  },
  {
    id: 'looks_maxxing',
    category: 'Goofy',
    label: 'Looks Maxxing',
    promptInstruction: 'sharp chiseled jawline gigachad dramatic monochrome cinematic lighting',
  },
  {
    id: 'toothless',
    category: 'Goofy',
    label: 'Toothless',
    promptInstruction: 'hilarious goofy toothless grin expression, candid funny flash photo',
  },
  {
    id: 'bye_brows',
    category: 'Goofy',
    label: 'Bye Brows',
    promptInstruction: 'humorous bleached invisible eyebrows editorial avant-garde fashion look',
  },
  // Costumes
  {
    id: 'wedding',
    category: 'Costumes',
    label: 'Wedding (Cô dâu / Chú rể)',
    promptInstruction: 'dressed in elegant white wedding attire with floral bouquet, soft romantic daylight',
  },
  {
    id: 'cowboy_cowgirl',
    category: 'Costumes',
    label: 'Cowboy / Cowgirl',
    promptInstruction: 'wearing a classic leather cowboy hat and western denim jacket, golden sunset glow',
  },
  {
    id: 'giraffe',
    category: 'Costumes',
    label: 'Giraffe',
    promptInstruction: 'wearing a cute cozy plush giraffe hood costume, playful warm lighting',
  },
  {
    id: 'clown',
    category: 'Costumes',
    label: 'Clown',
    promptInstruction: 'colorful artistic circus clown face paint and red nose, vibrant carnival lighting',
  },
  // Holidays
  {
    id: 'santa_cutout',
    category: 'Holidays',
    label: 'Santa Cutout (Noel)',
    promptInstruction: 'wearing a cozy red Santa Claus hat, warm Christmas tree lights bokeh in background',
  },
  {
    id: 'elf_cutout',
    category: 'Holidays',
    label: 'Elf Cutout',
    promptInstruction: 'wearing cute festive green Christmas elf hat and ears, snowy holiday glow',
  },
  {
    id: 'sweet_hearts',
    category: 'Holidays',
    label: 'Sweet Hearts (Valentine)',
    promptInstruction: 'romantic Valentine pastel pink heart confetti atmosphere, dreamy warm portrait',
  },
];

export const LOCKET_CAPTIONS: LocketCaptionPreset[] = [
  {
    id: 'none',
    section: 'Mặc định',
    text: 'Không gắn caption',
    emoji: '✨',
    colors: ['#1E293B', '#334155', '#475569'],
    textColor: '#FFFFFF',
  },
  {
    id: 'caption:em_nho_anhh',
    section: 'Tình yêu & Cơm chó',
    text: 'em nhớ anhh',
    emoji: '🥺',
    colors: ['#542519', '#6A3A20', '#805326'],
    textColor: '#FFFFFF',
  },
  {
    id: 'caption:vinhdat_extra_1_1',
    section: 'Shin & Hello Kitty',
    text: 'Hello Kitty đáng iu',
    emoji: '🎀',
    colors: ['#E58EBE', '#E99FBD', '#EDB1C0'],
    textColor: '#17243A',
  },
  {
    id: 'caption:vinhdat_extra_4_1',
    section: 'Chứng nhận của Locket',
    text: 'Locket xác nhận bạn cutii',
    emoji: '☑️',
    colors: ['#B49EE2', '#CCAEE7', '#DFBFEC'],
    textColor: '#17243A',
  },
  {
    id: 'caption:vinhdat_extra_2_1',
    section: 'Trend TikTok & Meme VN',
    text: 'Đỉnh nóc kịch trần bay phấp phới',
    emoji: '🚀',
    colors: ['#E29BE5', '#E9ACE0', '#EEBDDC'],
    textColor: '#17243A',
  },
  {
    id: 'caption:tuyet_doi_dien_anh',
    section: 'Trend TikTok & Meme VN',
    text: 'Tuyệt đối điện ảnh',
    emoji: '📷',
    colors: ['#E5A8C9', '#EAB8C7', '#EFC9CB'],
    textColor: '#17243A',
  },
  {
    id: 'caption:vinhdat_new_3_4',
    section: 'Tâm trạng & Chữa lành',
    text: 'Trái tim đang bảo trì',
    emoji: '🌙',
    colors: ['#EDA0AD', '#F0B7B2', '#F4D4C4'],
    textColor: '#17243A',
  },
  {
    id: 'caption:vinhdat_new_1_3',
    section: 'Học tập & Sinh viên',
    text: 'Qua môn là hạnh phúc',
    emoji: '🎓',
    colors: ['#441954', '#61206A', '#80267E'],
    textColor: '#FFFFFF',
  },
  {
    id: 'caption:vinhdat_haha_01',
    section: 'Tấu Hài VINHDAT',
    text: 'Cười xỉu ngang',
    emoji: '🤣',
    colors: ['#FF91C4', '#FFC2DC', '#FFE1ED'],
    textColor: '#34243D',
  },
];

export const AI_STYLE_PRESETS: AiStylePreset[] = [
  {
    id: 'natural',
    label: 'Locket Tự nhiên',
    promptSuffix: 'authentic candid photography, soft natural daylight, warm skin tones, crisp 35mm lens look',
    recommendedModel: 'flux',
  },
  {
    id: 'ghibli',
    label: 'Anime Ghibli',
    promptSuffix: 'Studio Ghibli hand-painted anime illustration style, dreamy pastel sky, warm nostalgic lighting, rich details',
    recommendedModel: 'anime',
  },
  {
    id: 'y2k',
    label: 'Y2K Film Retro',
    promptSuffix: '2000s Y2K flash disposable film camera aesthetic, subtle grain, vibrant retro color grading, candid vibe',
    recommendedModel: 'turbo',
  },
  {
    id: 'chibi',
    label: '3D Chibi Cute',
    promptSuffix: 'cute 3D blind-box vinyl toy render, soft studio lighting, smooth matte pastel textures, adorable proportions',
    recommendedModel: 'flux',
  },
  {
    id: 'cyber',
    label: 'Neon Đêm',
    promptSuffix: 'cinematic night street photography, neon reflections on rain-wet asphalt, shallow depth of field, moody contrast',
    recommendedModel: 'flux',
  },
];

export function mapFilterIdToPrompt(filterId?: string, customPrompt?: string): string {
  const cleanCustom = (customPrompt || '').trim();
  const cleanId = (filterId || '').trim().toLowerCase();
  if (!cleanId || cleanId === 'none') {
    return cleanCustom;
  }
  const matched = LOCKET_FILTERS.find((f) => f.id === cleanId);
  if (matched && matched.promptInstruction) {
    return cleanCustom
      ? `${cleanCustom}, ${matched.promptInstruction}`
      : `portrait transformation, ${matched.promptInstruction}`;
  }
  const readable = cleanId.replace(/_/g, ' ');
  return cleanCustom
    ? `${cleanCustom}, ${readable} filter style`
    : `creative portrait with ${readable} filter effect`;
}

export function getDimensionsForAspectRatio(ratio: AspectRatioOption): { width: number; height: number } {
  switch (ratio) {
    case '3:4':
      return { width: 768, height: 1024 };
    case '9:16':
      return { width: 720, height: 1280 };
    case '1:1':
    default:
      return { width: 1024, height: 1024 };
  }
}

export function buildEnhancedPrompt(
  userPrompt: string,
  styleId: string,
  translatedPrompt?: string,
  filterId?: string
): string {
  const filterAwareBase = mapFilterIdToPrompt(filterId, translatedPrompt || userPrompt);
  const base = filterAwareBase.trim();
  if (!base) return '';
  const style = AI_STYLE_PRESETS.find((s) => s.id === styleId);
  if (!style) return base;
  return `${base}, ${style.promptSuffix}`;
}

export function normalizeServerUrl(rawUrl: string): string {
  return rawUrl.trim().replace(/\/+$/, '');
}

export function isValidServerUrl(rawUrl: string): boolean {
  const normalized = normalizeServerUrl(rawUrl);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function generateMitmRedirectScript(serverUrl: string, client: ProxyClient): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';

  if (client === 'quantumultx') {
    return `// ============================================================
// Locket AI & Filter Free Server Redirect (Quantumult X)
// Bắt request Filter/AI trong app Locket và chuyển sang server miễn phí
// ============================================================

const FREE_AI_SERVER = "${cleanUrl}/api/locket/ai-generate";

let rawBody = {};
try {
  rawBody = $request.body ? JSON.parse($request.body) : {};
} catch (e) {}

const inner = rawBody && rawBody.data ? rawBody.data : rawBody;
const isCallable = Boolean(rawBody && rawBody.data);

const req = {
  url: FREE_AI_SERVER,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Locket-Proxy": "QuantumultX"
  },
  body: JSON.stringify({
    prompt: inner.prompt || inner.custom_prompt || inner.text || inner.caption || "",
    filter_id: inner.filter_id || inner.filterId || inner.filter || inner.style || "",
    style: inner.style || "natural",
    aspect_ratio: inner.aspect_ratio || "1:1",
    image_base64: inner.image_base64 || inner.image || inner.photo || inner.imageData || "",
    callable: isCallable,
    original_url: $request.url
  })
};

$task.fetch(req).then(
  (response) => {
    $done({
      status: "HTTP/1.1 200 OK",
      headers: { "Content-Type": "application/json" },
      body: response.body
    });
  },
  () => {
    $done({});
  }
);
`;
  }

  return `// ============================================================
// Locket AI & Filter Free Server Redirect (${client.toUpperCase()})
// Dùng trực tiếp tính năng Filter / Tạo ảnh AI ngay trong app Locket
// Hỗ trợ Img2Img (ảnh selfie từ Locket + filter_id) & Firebase Callable
// ============================================================

const FREE_AI_SERVER = "${cleanUrl}/api/locket/ai-generate";

let rawBody = {};
try {
  rawBody = $request.body ? JSON.parse($request.body) : {};
} catch (e) {}

// Tự động nhận diện Firebase httpsCallable ({ data: {...} }) hoặc REST JSON
const inner = rawBody && rawBody.data ? rawBody.data : rawBody;
const isCallable = Boolean(rawBody && rawBody.data);

const requestOptions = {
  url: FREE_AI_SERVER,
  headers: {
    "Content-Type": "application/json",
    "X-Locket-Proxy": "${client}"
  },
  body: JSON.stringify({
    prompt: inner.prompt || inner.custom_prompt || inner.text || inner.caption || "",
    filter_id: inner.filter_id || inner.filterId || inner.filter || inner.preset || "",
    style: inner.style || "natural",
    aspect_ratio: inner.aspect_ratio || "1:1",
    image_base64: inner.image_base64 || inner.image || inner.photo || inner.imageData || "",
    callable: isCallable,
    original_url: $request.url
  }),
  timeout: 45
};

$httpClient.post(requestOptions, function (error, response, data) {
  if (error || !data) {
    $done({});
    return;
  }
  $done({
    response: {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: data
    }
  });
});
`;
}

export function generateTrafficProbeScript(serverUrl: string): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  return `// ============================================================
// Locket Traffic Probe (Shadowrocket) — Dò URL & Payload thật của app Locket
// Không chặn hay sửa request, chỉ gửi tên URL + key JSON về tab API & Nhật ký
// ============================================================

const PROBE_URL = "${cleanUrl}/api/locket/mitm-probe";
const targetUrl = $request.url || "";
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

if (!ua.includes("Locket") && !targetUrl.includes("locket")) {
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
`;
}

export interface ConfMergeOptions {
  includeYoutubeAdblock: boolean;
  includeGoldUnlock: boolean;
  usePatchedForceGold?: boolean;
  enableTrafficProbe?: boolean;
  aiScriptUrl: string;
  aiPattern?: string;
}

export function generateMergedLocketConf(
  serverUrl: string,
  client: ProxyClient,
  options: ConfMergeOptions = {
    includeYoutubeAdblock: true,
    includeGoldUnlock: true,
    usePatchedForceGold: true,
    enableTrafficProbe: false,
    aiScriptUrl: '',
    aiPattern: DEFAULT_SHADOWROCKET_AI_PATTERN,
  }
): string {
  const cleanServer = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  const scriptSrc = options.aiScriptUrl.trim() || `${cleanServer}/scripts/locket_ai_redirect.js?client=${client}`;
  const forceGoldSrc =
    options.usePatchedForceGold !== false
      ? `${cleanServer}/scripts/forceGold4.3.js`
      : 'https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/forceGold4.3.js';
  const aiPattern = (options.aiPattern || DEFAULT_SHADOWROCKET_AI_PATTERN).trim();

  if (client === 'quantumultx') {
    const rewriteLines: string[] = [];
    if (options.includeGoldUnlock) {
      rewriteLines.push(
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$) url script-response-body https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/locketfix8.js`,
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers) url script-request-header https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/header7.js`,
        `^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+ url script-response-body ${forceGoldSrc}`
      );
    }
    rewriteLines.push(`${aiPattern} url script-analyze-echo-response ${scriptSrc}`);

    return `# Quantumult X Configuration - Locket Gold + Free AI Filter Server
[rewrite_local]
${rewriteLines.join('\n')}

[mitm]
hostname = api.revenuecat.com, firebaseremoteconfig.googleapis.com, api.locketcamera.com, *.locketcamera.com, us-central1-locket-4252a.cloudfunctions.net, *.cloudfunctions.net, *-uc.a.run.app
`;
  }

  const youtubeSection = options.includeYoutubeAdblock
    ? `[Rule]
AND,((DOMAIN-SUFFIX,googlevideo.com),(PROTOCOL,UDP)),REJECT
AND,((DOMAIN,youtubei.googleapis.com),(PROTOCOL,UDP)),REJECT
FINAL,DIRECT

[URL Rewrite]
(^https?:\\/\\/[\\w-]+\\.googlevideo\\.com\\/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) $1$2$3 302
^https?:\\/\\/[\\w-]+\\.googlevideo\\.com\\/(?!(dclk_video_ads|videoplayback\\?)).+&oad _ reject-200
^https?:\\/\\/(www|s)\\.youtube\\.com\\/api\\/stats\\/ads _ reject-200
^https?:\\/\\/(www|s)\\.youtube\\.com\\/(pagead|ptracking) _ reject-200
^https?:\\/\\/s\\.youtube\\.com\\/api\\/stats\\/qoe\\?adcontext _ reject-200

`
    : `[Rule]
FINAL,DIRECT

`;

  const scriptLines: string[] = [];
  if (options.includeYoutubeAdblock) {
    scriptLines.push(
      `youtube_ad = type=http-response, pattern=^https:\\/\\/youtubei\\.googleapis\\.com\\/youtubei\\/v1\\/(browse|next|player|search|reel\\/reel_watch_sequence|guide|account\\/get_setting|get_watch), requires-body=true, max-size=-1, binary-body-mode=true, script-path=https://raw.githubusercontent.com/vdatdv/LocketGold/main/youtube/youtube-ad.js, argument="{\\"lyricLang\\":null,\\"captionLang\\":null,\\"blockUpload\\":true,\\"blockImmersive\\":true,\\"debug\\":false}"`
    );
  }
  if (options.includeGoldUnlock) {
    scriptLines.push(
      `revenuecat = type=http-response, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$), script-path=https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/locketfix8.js, requires-body=true, max-size=-1, timeout=60`,
      `deleteHeader = type=http-request, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers), script-path=https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/header7.js, timeout=60`,
      `locket_rc = type=http-response, pattern=^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+, script-path=${forceGoldSrc}, requires-body=true, max-size=-1, timeout=60`
    );
  }
  scriptLines.push(
    `locket_ai_free = type=http-request, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=-1, timeout=60`
  );
  if (options.enableTrafficProbe) {
    scriptLines.push(
      `locket_probe = type=http-request, pattern=^https:\\/\\/.*(locketcamera\\.com|cloudfunctions\\.net|uc\\.a\\.run\\.app)\\/.*, script-path=${cleanServer}/scripts/locket_traffic_probe.js, requires-body=true, max-size=1048576, timeout=5`
    );
  }

  const mitmHosts = [
    'api.revenuecat.com',
    'firebaseremoteconfig.googleapis.com',
    'api.locketcamera.com',
    '*.locketcamera.com',
    'us-central1-locket-4252a.cloudfunctions.net',
    '*.cloudfunctions.net',
    '*-uc.a.run.app',
  ];
  if (options.includeYoutubeAdblock) {
    mitmHosts.push(
      '-redirector*.googlevideo.com',
      '*.googlevideo.com',
      'www.youtube.com',
      's.youtube.com',
      'youtubei.googleapis.com'
    );
  }

  return `# Locket Gold + Free AI Filter Server (${client.toUpperCase()})
# Kết nối trực tiếp tính năng Filter & Tạo ảnh AI trong app Locket qua Shadowrocket MITM
[General]
loglevel = notify

${youtubeSection}[Script]
${scriptLines.join('\n')}

[MITM]
hostname = ${mitmHosts.join(', ')}
`;
}

export function generateStandaloneServerCode(platform: DeployPlatform): string {
  if (platform === 'vercel') {
    return `// api/locket-ai.js — Deploy miễn phí lên Vercel (Hỗ trợ Filter Locket & Text-to-Image)
const FILTER_PROMPTS = {
  flower_crown: "wearing a delicate pastel flower crown, dreamy daylight",
  cutesy: "soft rosy blush cheeks, kawaii glowing aesthetic",
  princess: "wearing a sparkling crystal tiara crown, fairytale glow",
  disco_lights: "colorful disco ball light reflections, party neon aesthetic",
  blonde_bleached: "platinum blonde bleached hairstyle transformation",
  okay_wig: "wearing a funny colorful wig, playful portrait",
  crying: "dramatic humorous crying filter",
  clown: "colorful circus clown face paint and red nose"
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Locket-Proxy");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, service: "Locket Free AI Filter Server (Vercel)" });
  }

  try {
    const raw = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const body = raw.data ? raw.data : raw;
    const filterId = String(body.filter_id || body.filterId || "").trim();
    const filterHint = FILTER_PROMPTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter" : "");
    const rawPrompt = String(body.prompt || body.custom_prompt || body.text || "").trim();
    const prompt = [rawPrompt, filterHint].filter(Boolean).join(", ") || "aesthetic portrait";
    const model = body.model === "turbo" ? "turbo" : "flux";
    const width = Number(body.width || 1024);
    const height = Number(body.height || 1024);
    const seed = Math.floor(Math.random() * 1000000);

    const imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(prompt)}?width=\${width}&height=\${height}&model=\${model}&seed=\${seed}&nologo=true\`;
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) throw new Error("Upstream HTTP " + upstream.status);

    const arrayBuffer = await upstream.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = upstream.headers.get("content-type") || "image/jpeg";
    const dataUrl = \`data:\${mimeType};base64,\${base64}\`;

    const payload = {
      ok: true,
      provider: "pollinations-free",
      filter_id: filterId || undefined,
      url: imageUrl,
      imageUrl,
      image_url: imageUrl,
      image_data_url: dataUrl,
      imageBase64: base64,
      image: base64
    };

    return res.status(200).json({ ...payload, result: payload });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
`;
  }

  return `// server-free.mjs — Server AI & Filter Locket miễn phí cho Shadowrocket (Node.js >= 18)
// Hỗ trợ: 36 Locket Filter IDs + Img2Img trực tiếp từ ảnh selfie + URL ảnh JPEG (/media/:id.jpg)
// Chạy trực tiếp: node server-free.mjs
import http from "node:http";

const PORT = Number(process.env.PORT || 3000);
const mediaCache = new Map();

const FILTER_PROMPTS = {
  flower_crown: "wearing a delicate fresh pastel flower crown on head, dreamy soft sunlight",
  cutesy: "soft rosy blush cheeks, adorable kawaii aesthetic, glowing skin",
  sticker_face: "playful cute pastel face stickers on cheeks, sparkling eyes",
  love_bug: "cute floating pink hearts around portrait, warm rosy lighting",
  princess: "wearing a sparkling crystal tiara crown, fairytale royal glow",
  disco_lights: "colorful disco ball light reflections, vibrant party neon aesthetic",
  cash_money: "wearing cool dark sunglasses with floating dollar bills, studio lighting",
  blonde_bleached: "platinum blonde bleached hairstyle transformation, realistic hair",
  bob_cut: "chic sleek bob haircut transformation, fashionable portrait",
  okay_wig: "wearing an exaggerated funny colorful wig, playful portrait",
  looks_maxxing: "sharp jawline dramatic cinematic monochrome portrait",
  wedding: "dressed in elegant white wedding attire, soft romantic daylight",
  clown: "colorful artistic circus clown face paint and red nose",
  santa_cutout: "wearing a cozy red Santa hat, warm Christmas tree lights bokeh"
};

function buildPrompt(rawPrompt, filterId) {
  const hint = FILTER_PROMPTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter style" : "");
  return [rawPrompt, hint].filter(Boolean).join(", ") || "aesthetic candid portrait";
}

async function fetchFromAiHorde(prompt, sourceBase64) {
  const cleanBase64 = (sourceBase64 || "").replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "");
  const payload = {
    prompt,
    params: {
      width: 512,
      height: 512,
      steps: 20,
      n: 1,
      ...(cleanBase64 ? { denoising_strength: 0.58 } : {})
    },
    ...(cleanBase64 ? { source_image: cleanBase64, source_processing: "img2img" } : {}),
    nsfw: false,
    censor_nsfw: true,
    r2: true
  };

  const submit = await fetch("https://aihorde.net/api/v2/generate/async", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: "0000000000",
      "Client-Agent": "LocketFreeAIServer:1.0:standalone"
    },
    body: JSON.stringify(payload)
  });
  if (!submit.ok) throw new Error(\`AI Horde HTTP \${submit.status}\`);
  const { id } = await submit.json();
  const deadline = Date.now() + 28000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const chk = await (await fetch(\`https://aihorde.net/api/v2/generate/check/\${id}\`)).json();
    if (chk.done) {
      const st = await (await fetch(\`https://aihorde.net/api/v2/generate/status/\${id}\`)).json();
      const imgUrl = st.generations?.[0]?.img;
      if (!imgUrl) throw new Error("Empty image");
      const imgRes = await fetch(imgUrl);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const mime = imgRes.headers.get("content-type") || "image/webp";
      return { buffer, mime, provider: cleanBase64 ? "ai-horde-img2img" : "ai-horde-free" };
    }
  }
  throw new Error("AI Horde timeout");
}

async function generateFreeAiImage({ prompt, filterId, sourceBase64, model = "flux" }) {
  const fullPrompt = buildPrompt(prompt, filterId);
  if (sourceBase64) {
    return await fetchFromAiHorde(fullPrompt, sourceBase64);
  }
  const seed = Math.floor(Math.random() * 1000000);
  const targetUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(fullPrompt)}?width=1024&height=1024&model=\${model}&seed=\${seed}&nologo=true\`;
  try {
    const response = await fetch(targetUrl, { headers: { "User-Agent": "LocketFreeAIServer/1.0" } });
    if (!response.ok) throw new Error(\`Pollinations HTTP \${response.status}\`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const mime = response.headers.get("content-type") || "image/jpeg";
    return { buffer, mime, provider: "pollinations-free" };
  } catch {
    return await fetchFromAiHorde(fullPrompt, "");
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Locket-Proxy");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.url?.startsWith("/media/")) {
    const id = req.url.replace("/media/", "").replace(/\\.(jpg|png|webp)$/, "");
    const item = mediaCache.get(id);
    if (!item) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": item.mime });
    return res.end(item.buffer);
  }

  if (req.url === "/health" || req.url === "/api/locket/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, status: "running", img2img: true, free_tier: true }));
  }

  if (req.method === "POST" && (req.url === "/api/locket/ai-generate" || req.url === "/api/ai/generate")) {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      const body = parsed.data ? parsed.data : parsed;
      const generated = await generateFreeAiImage({
        prompt: String(body.prompt || body.custom_prompt || body.text || "").trim(),
        filterId: String(body.filter_id || body.filterId || "").trim(),
        sourceBase64: String(body.image_base64 || body.image || body.photo || ""),
        model: body.model === "turbo" ? "turbo" : "flux"
      });
      const mediaId = \`\${Date.now()}-\${Math.random().toString(36).slice(2, 7)}\`;
      mediaCache.set(mediaId, { buffer: generated.buffer, mime: generated.mime });
      if (mediaCache.size > 40) mediaCache.delete(mediaCache.keys().next().value);

      const host = req.headers.host || \`localhost:\${PORT}\`;
      const proto = req.headers["x-forwarded-proto"] || "https";
      const hostedUrl = \`\${proto}://\${host}/media/\${mediaId}.jpg\`;
      const base64 = generated.buffer.toString("base64");
      const dataUrl = \`data:\${generated.mime};base64,\${base64}\`;

      const payload = {
        ok: true,
        provider: generated.provider,
        url: hostedUrl,
        imageUrl: hostedUrl,
        image_url: hostedUrl,
        image_data_url: dataUrl,
        imageBase64: base64,
        image: base64
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ...payload, result: payload }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(\`Locket Free AI Filter Server running on port \${PORT}\`);
});
`;
}
