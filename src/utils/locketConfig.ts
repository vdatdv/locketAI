import { OFFICIAL_LOCKET_FILTERS, type LocketFilterPreset } from './locketFilterCatalog';

export type ProxyClient = 'shadowrocket' | 'loon' | 'surge' | 'quantumultx';
export type AspectRatioOption = '1:1' | '3:4' | '9:16';
export type FreeAiModel = 'flux' | 'turbo' | 'anime';
export type DeployPlatform = 'worker' | 'render' | 'railway' | 'vercel' | 'termux';

export type { LocketFilterPreset };

export interface LocketCaptionPreset {
  id: string;
  section: string;
  text: string;
  emoji: string;
  colors: [string, string, string];
  textColor: string;
}

export interface AiStylePreset {
  id: string;
  label: string;
  promptSuffix: string;
  recommendedModel: FreeAiModel;
}

// Matches Locket in-app AI Filter, Look/Appearance & Photobooth endpoints (API + subdomains + Cloud Functions + Cloud Run v2) while excluding read/config/analytics/cdn/moment endpoints
export const DEFAULT_SHADOWROCKET_AI_PATTERN =
  '^https:\\/\\/(?!.*(cdn\\.locketcamera\\.com|getFilters|getfilters|getlooks|getcustomfilters|getuserfilters|getaccount|fetchuser|getmoments|get[A-Z]|fetch[A-Z]|list[A-Z]|set[A-Z]|update[A-Z]|delete[A-Z]|postMoment|rollcall|account|login|streak|reaction|chat|message|friend|telemetry|analytics|log))(([^/]+\\.locketcamera\\.com|[^/]*cloudfunctions\\.net)\\/.*([Gg]enerate[Ff]iltered[Ii]mage|[Cc]reate[Ff]iltered[Ii]mage|[Aa]pply[Ff]ilter|[Gg]enerate[Ff]ilter|[Cc]reate[Ff]ilter|[Cc]reate[Cc]ustom[Ff]ilter|[Cc]reate[Uu]ser[Ff]ilter|[Cc]ustom[Ff]ilter|[Pp]rocess[Ff]ilter|[Rr]ender[Ff]ilter|[Cc]amera[Ff]ilter|[Mm]agic[Ff]ilter|[Aa][Ii][Ff]ilter|[Ff]ilter[Aa][Ii]|[Gg]enerate[Ff]ilter[Pp]review|[Gg]enerate[Ll]ook|[Cc]reate[Ll]ook|[Aa]pply[Ll]ook|[Rr]ender[Ll]ook|[Gg]enerate[Aa]ppearance|[Cc]reate[Aa]ppearance|[Ee]dit[Ii]mage|[Gg]enerate[Ss]ticker|[Aa]pply[Ss]ticker|[Gg]enerate[Aa]vatar|[Mm]agic|[Gg]enerate[Aa][Ii]|[Gg]enerate[Mm]agic|[Gg]enerate[Pp]hotobooth|[Pp]hotobooth|[Gg]enerate[Ii]mage|[Gg]enerate[Pp]hoto|[Aa][Ii][Gg]enerate|(filters?|looks?)\\/(apply|generate|create|process|render)|ai\\/(generate|image|filter|look|remix|transform)|[Tt]ransform[Ii]mage|[Rr]estyle|[Pp]hoto[Ee]ffect|[Aa]pply[Ee]ffect).*|[^/]*(filter|look|booth|image|photo|ai|magic|avatar|gen)[^/]*\\.a\\.run\\.app(\\/.*)?)';

export const LOCKET_FILTER_UNLOCK_PATTERN =
  '^https:\\/\\/(?!.*(cdn\\.locketcamera\\.com|analytics\\.locketcamera\\.com))([^/]+\\.locketcamera\\.com|[^/]*cloudfunctions\\.net)\\/(?!.*([Gg]enerate[Ff]iltered[Ii]mage|[Cc]reate[Ff]iltered[Ii]mage|[Gg]enerate[Ff]ilter|[Aa]pply[Ff]ilter|[Cc]reate[Ff]ilter|[Cc]reate[Cc]ustom[Ff]ilter|[Cc]reate[Uu]ser[Ff]ilter|[Pp]rocess[Ff]ilter|[Rr]ender[Ff]ilter|[Gg]enerate[Ll]ook|[Cc]reate[Ll]ook|[Aa]pply[Ll]ook|[Rr]ender[Ll]ook|[Gg]enerate[Aa]ppearance|[Cc]reate[Aa]ppearance|[Gg]enerate[Pp]hotobooth|[Gg]enerate[Aa][Ii]|[Gg]enerate[Mm]agic|postMoment|createMoment|sendMoment)).*';

export const LOCKET_MOMENT_AI_PATTERN =
  '^https:\\/\\/api\\.locketcamera\\.com\\/.*(postMoment|createMoment|sendMoment).*';

export interface LocketAiCaptionOverrideItem {
  filterId: string;
  label: string;
  emoji: string;
  colors: [string, string, string];
}

export const LOCKET_AI_CAPTION_ITEMS: LocketAiCaptionOverrideItem[] = [
  { filterId: 'flower_crown', label: 'AI · Vòng hoa', emoji: '🌸', colors: ['#7C3AED', '#A855F7', '#EC4899'] },
  { filterId: 'cutesy', label: 'AI · Dễ thương', emoji: '🎀', colors: ['#DB2777', '#EC4899', '#F472B6'] },
  { filterId: 'photobooth', label: 'AI · Photobooth', emoji: '📸', colors: ['#0F172A', '#334155', '#475569'] },
  { filterId: 'princess', label: 'AI · Công chúa', emoji: '👑', colors: ['#B45309', '#D97706', '#F59E0B'] },
  { filterId: 'blonde_bleached', label: 'AI · Tóc vàng', emoji: '💛', colors: ['#A16207', '#CA8A04', '#EAB308'] },
  { filterId: 'golden_hour', label: 'AI · Nắng chiều', emoji: '🌅', colors: ['#C2410C', '#EA580C', '#FB923C'] },
  { filterId: 'disco_lights', label: 'AI · Disco Neon', emoji: '🪩', colors: ['#4338CA', '#6366F1', '#A855F7'] },
  { filterId: 'wedding', label: 'AI · Cô dâu', emoji: '💍', colors: ['#0E7490', '#0891B2', '#06B6D4'] },
  { filterId: 'watercolor_art', label: 'AI · Tranh màu nước', emoji: '🎨', colors: ['#047857', '#059669', '#10B981'] },
  { filterId: 'harry_potter', label: 'AI · Phù thủy', emoji: '🪄', colors: ['#312E81', '#4338CA', '#6D28D9'] },
];

export function patchForceGoldScript(rawSource: string): string {
  const aiOverlaySection = {
    section: '✨ Filter AI & Photobooth (Gửi để biến hình)',
    items: LOCKET_AI_CAPTION_ITEMS.map((item) => ({
      overlay_id: `caption:ai_filter_${item.filterId}`,
      source: 'remote',
      caption: {
        background: { colors: item.colors },
        icon: { data: item.emoji, type: 'emoji' },
        max_lines: 1,
        text: item.label,
        text_color: '#FFFFFF',
        type: 'static_content',
      },
    })),
  };

  const safeBodyGuard = `
var ua = ($request && $request.headers && ($request.headers["User-Agent"] || $request.headers["user-agent"])) || "";
var rcUrl = ($request && $request.url) || "";
if (typeof $response === "undefined" || !$response || !$response.body) { $done({}); return; }
var obj = null;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); return; }
if (!obj || typeof obj !== "object") { $done({}); return; }`;

  const replacedHeader = rawSource
    .replace(
      /var ua = \$request\.headers\["User-Agent"\][^\n]*\nvar obj = JSON\.parse\(\$response\.body\);\s*\n\s*if \(ua\.includes\("Locket"\)\)/,
      `function _runForceGold() {${safeBodyGuard}\nif (ua.includes("Locket") || rcUrl.includes("locket-4252a"))`
    );

  const aiFilterPatch = `
if (typeof obj === "object" && obj && obj.entries && (ua.includes("Locket") || rcUrl.includes("locket-4252a"))) {
    try {
        var fg = JSON.parse(obj.entries.feature_gates || "{}");
        fg.camera_filters = "enabled";
        fg.ai_filters = "enabled";
        fg.custom_filters = "enabled";
        fg.filters = "enabled";
        fg.photobooth = "enabled";
        obj.entries.feature_gates = JSON.stringify(fg);
    } catch (e) {}
    try {
        var uf = JSON.parse(obj.entries.upsell_features || "{}");
        uf.camera_filters = true;
        uf.ai_filters = true;
        uf.custom_filters = true;
        uf.filters = true;
        uf.photobooth = true;
        obj.entries.upsell_features = JSON.stringify(uf);
    } catch (e) {}
    try {
        var existingFilterCfg = JSON.parse(obj.entries.camera_filter_config || "{}");
        if (existingFilterCfg && typeof existingFilterCfg === "object") {
            existingFilterCfg.allows_custom_filters = true;
            existingFilterCfg.show_filter_button = true;
            existingFilterCfg.sheet_enabled = true;
            existingFilterCfg.open_sheet_immediately = true;
            existingFilterCfg.filters_enabled = true;
            existingFilterCfg.ai_filters_enabled = true;
            existingFilterCfg.photobooth_enabled = true;
            var pbIds = ["photobooth", "photobooth_cute", "pb_strawberry", "pb_vintage", "pb_galaxy", "pb_holo_4cut"];
            if (Array.isArray(existingFilterCfg.sheet_filters)) {
                var hasPbSection = existingFilterCfg.sheet_filters.some(function (s) {
                    return s && s.title && (s.title.en === "Photobooth" || s.title === "Photobooth");
                });
                if (!hasPbSection) {
                    existingFilterCfg.sheet_filters.unshift({
                        title: { en: "Photobooth" },
                        filter_ids: pbIds
                    });
                }
            }
            if (Array.isArray(existingFilterCfg.picker_filters)) {
                for (var pIdx = 0; pIdx < pbIds.length; pIdx++) {
                    if (existingFilterCfg.picker_filters.indexOf(pbIds[pIdx]) === -1) {
                        existingFilterCfg.picker_filters.push(pbIds[pIdx]);
                    }
                }
            }
            obj.entries.camera_filter_config = JSON.stringify(existingFilterCfg);
        }
    } catch (e) {}
    try {
        var existingOverlays = JSON.parse(obj.entries.overlay_items || "[]");
        if (Array.isArray(existingOverlays)) {
            var aiSection = ${JSON.stringify(aiOverlaySection)};
            obj.entries.overlay_items = JSON.stringify([aiSection].concat(existingOverlays));
        }
    } catch (e) {}
    Object.assign(obj.entries, {
        ai_filters_enabled: "true",
        custom_filters_enabled: "true",
        filter_generation_enabled: "true",
        ai_camera_filters_enabled: "true",
        camera_filters_enabled: "true",
        photobooth_enabled: "true",
        unlimited_filters: "true",
        camera_filters_free_tier_enabled: "true"
    });
}
$done({ body: JSON.stringify(obj) });
}
_runForceGold();`;

  return replacedHeader.replace(
    /\$done\(\{\s*body:\s*JSON\.stringify\(obj\)\s*\}\);?\s*$/,
    aiFilterPatch
  );
}

export const LOCKET_FILTERS: LocketFilterPreset[] = OFFICIAL_LOCKET_FILTERS;

export const LOCKET_FILTER_ALIASES: Record<string, string> = {
  stk_dio_disco: 'disco_lights',
  disco: 'disco_lights',
  stk_dio_cash: 'cash_money',
  cash: 'cash_money',
  stk_dio_wedding: 'wedding',
  stk_dio_cowboy: 'cowboy_cowgirl',
  cowboy: 'cowboy_cowgirl',
  stk_dio_looksmaxing: 'looks_maxxing',
  looksmaxing: 'looks_maxxing',
  stk_dio_orange_wig: 'okay_wig',
  orange_wig: 'okay_wig',
  stk_dio_bleached_hair: 'blonde_bleached',
  bleached_hair: 'blonde_bleached',
  stk_dio_bob: 'bob_cut',
  bob: 'bob_cut',
  stk_dio_bearded: 'beard',
  bearded: 'beard',
  stk_dio_bearded_holiday: 'beard',
  stk_dio_sweat_hearts: 'sweet_hearts',
  sweat_hearts: 'sweet_hearts',
  stk_dio_elf: 'elf_cutout',
  elf: 'elf_cutout',
  stk_dio_santa: 'santa_cutout',
  santa: 'santa_cutout',
  stk_dio_easter_bunny: 'easter_bunney_cutout',
  easter_bunny: 'easter_bunney_cutout',
  stk_dio_easter_chick: 'easter_chick_cutout',
  easter_chick: 'easter_chick_cutout',
  stk_dio_toothless: 'toothless',
  stk_dio_bye_brows: 'bye_brows',
  stk_dio_bowling_ball: 'bowling_ball',
  stk_dio_buns: 'buns',
  stk_dio_tatted: 'tatted',
  stk_dio_mohawk: 'mohawk',
  stk_dio_braces: 'braces',
  stk_dio_slimed: 'slimed',
  stk_dio_princess: 'princess',
  stk_dio_happy_birthday: 'happy_birthday',
  stk_dio_cutesy: 'cutesy',
  stk_dio_sticker_face: 'sticker_face',
  stk_dio_flower_crown: 'flower_crown',
  stk_dio_love_bug: 'love_bug',
  stk_dio_giraffe: 'giraffe',
  stk_dio_clown: 'clown',
  stk_dio_leprechaun: 'leprechaun',
  stk_dio_lucky_face: 'lucky_face',
  stk_dio_frosty: 'frosty',
  stk_dio_influencer: 'influencer',
  photobooth_4cut: 'photobooth',
  pb_scrapbook_ripped_4cut: 'photobooth_cute',
  pb_ripped_paper_4cut: 'photobooth_cute',
  pb_denim_ripped_2x2: 'photobooth',
};


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

export function normalizeFilterId(rawFilterId?: string): string {
  const cleanId = (rawFilterId || '').trim().toLowerCase();
  if (!cleanId || cleanId === 'none') return '';
  if (LOCKET_FILTER_ALIASES[cleanId]) {
    return LOCKET_FILTER_ALIASES[cleanId];
  }
  if (cleanId.startsWith('stk_') && LOCKET_FILTER_ALIASES[cleanId.slice(4)]) {
    return LOCKET_FILTER_ALIASES[cleanId.slice(4)];
  }
  if (cleanId.startsWith('stk_')) {
    return cleanId.slice(4);
  }
  return cleanId;
}

export interface ExtractedLocketParams {
  filterId: string;
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatioOption;
  model: FreeAiModel;
  imageBase64: string;
  imageUrl: string;
  storagePath: string;
  originalUrl: string;
  isCallable: boolean;
  bodyKeys: string[];
}

function normalizeFirebaseStorageRefToUrl(rawRef: string): string {
  const clean = rawRef.trim();
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith('gs://')) {
    const withoutScheme = clean.slice(5);
    const slashIdx = withoutScheme.indexOf('/');
    if (slashIdx > 0) {
      const bucket = withoutScheme.slice(0, slashIdx);
      const objectPath = withoutScheme.slice(slashIdx + 1).replace(/^\/+/, '');
      if (bucket && objectPath) {
        return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`;
      }
    }
    return '';
  }
  const normalizedPath = clean.replace(/^\/+/, '');
  if (normalizedPath.includes('/')) {
    return `https://firebasestorage.googleapis.com/v0/b/locket-img/o/${encodeURIComponent(normalizedPath)}?alt=media`;
  }
  return '';
}

export function extractLocketGenerateParams(rawBody: unknown): ExtractedLocketParams {
  const root =
    rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)
      ? (rawBody as Record<string, unknown>)
      : {};
  const callablePayload =
    root.data && typeof root.data === 'object' && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : null;
  const body = callablePayload || root;
  const nestedFilter =
    body.filter && typeof body.filter === 'object' && !Array.isArray(body.filter)
      ? (body.filter as Record<string, unknown>)
      : null;
  const nestedPayload =
    body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
      ? (body.payload as Record<string, unknown>)
      : null;
  const merged = { ...root, ...body, ...(nestedPayload || {}), ...(nestedFilter || {}) };

  const pickString = (keys: string[]): string => {
    for (const key of keys) {
      const val = merged[key];
      if (typeof val === 'string' && val.trim()) {
        return val.trim();
      }
    }
    return '';
  };

  const rawFilterId = pickString([
    'filter_id',
    'filterId',
    'look_id',
    'lookId',
    'appearance_id',
    'appearanceId',
    'custom_filter_id',
    'customFilterId',
    'filter_name',
    'filterName',
    'sticker_id',
    'stickerId',
    'sticker',
    'preset_id',
    'presetId',
    'preset',
    'template_id',
    'templateId',
    'frame_id',
    'frameId',
    'effect_id',
    'effectId',
    'style_id',
    'styleId',
    'filter',
    'look',
    'id',
    'name',
  ]);
  const filterId = normalizeFilterId(rawFilterId);

  const prompt = pickString([
    'prompt',
    'custom_prompt',
    'customPrompt',
    'user_prompt',
    'userPrompt',
    'look_prompt',
    'lookPrompt',
    'text',
    'caption',
    'description',
    'instruction',
  ]);

  let imageBase64 = pickString([
    'image_base64',
    'imageBase64',
    'photo_base64',
    'photoBase64',
    'source_base64',
    'sourceBase64',
    'input_base64',
    'inputBase64',
    'image_data',
    'imageData',
    'base64',
  ]);

  let imageUrl = pickString([
    'image_url',
    'imageUrl',
    'input_image_url',
    'inputImageUrl',
    'input_url',
    'inputUrl',
    'source_image_url',
    'sourceImageUrl',
    'source_url',
    'sourceUrl',
    'photo_url',
    'photoUrl',
    'media_url',
    'mediaUrl',
    'original_image_url',
    'originalImageUrl',
    'file_url',
    'fileUrl',
    'thumbnail_url',
    'thumbnailUrl',
  ]);

  const storagePath = pickString([
    'storage_path',
    'storagePath',
    'image_path',
    'imagePath',
    'file_path',
    'filePath',
    'gcs_path',
    'gcsPath',
  ]);

  if (imageUrl && imageUrl.startsWith('gs://')) {
    imageUrl = normalizeFirebaseStorageRefToUrl(imageUrl);
  }
  if (!imageUrl && storagePath) {
    imageUrl = normalizeFirebaseStorageRefToUrl(storagePath);
  }

  const genericImage = pickString(['image', 'photo', 'input_image', 'source_image', 'media']);
  if (genericImage) {
    if (/^https?:\/\//i.test(genericImage) && !imageUrl) {
      imageUrl = genericImage;
    } else if (genericImage.startsWith('gs://') && !imageUrl) {
      imageUrl = normalizeFirebaseStorageRefToUrl(genericImage);
    } else if (!/^https?:\/\//i.test(genericImage) && !imageBase64) {
      imageBase64 = genericImage;
    }
  }

  const styleId = pickString(['style']) || 'natural';
  const aspectRaw = pickString(['aspect_ratio', 'aspectRatio']);
  const aspectRatio: AspectRatioOption =
    aspectRaw === '3:4' || aspectRaw === '9:16' ? aspectRaw : '1:1';
  const modelRaw = pickString(['model']);
  const model: FreeAiModel =
    modelRaw === 'turbo' || modelRaw === 'anime' ? modelRaw : 'flux';

  return {
    filterId,
    prompt,
    styleId,
    aspectRatio,
    model,
    imageBase64,
    imageUrl,
    storagePath,
    originalUrl: pickString(['original_url', 'originalUrl']),
    isCallable: Boolean(callablePayload || root.callable),
    bodyKeys: Object.keys(merged).slice(0, 12),
  };
}

export function mapFilterIdToPrompt(filterId?: string, customPrompt?: string): string {
  const cleanCustom = (customPrompt || '').trim();
  const normalizedId = normalizeFilterId(filterId);
  if (!normalizedId) {
    return cleanCustom;
  }
  const matched = LOCKET_FILTERS.find((f) => f.id === normalizedId);
  if (matched && matched.promptInstruction) {
    return cleanCustom
      ? `${cleanCustom}, ${matched.promptInstruction}`
      : `portrait transformation, ${matched.promptInstruction}`;
  }
  const readable = normalizedId.replace(/_/g, ' ');
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

export function buildGeminiImageEditInstruction(
  userPrompt: string,
  styleId: string,
  translatedPrompt?: string,
  filterId?: string,
  hasSourceImage = true
): string {
  const filterPrompt = mapFilterIdToPrompt(filterId, translatedPrompt || userPrompt).trim();
  const style = AI_STYLE_PRESETS.find((s) => s.id === styleId);
  const styleHint = style && style.id !== 'natural' ? ` Aesthetic finish: ${style.promptSuffix}.` : '';
  const coreEffect = filterPrompt || 'subtle flattering portrait enhancement with warm natural lighting';

  if (hasSourceImage) {
    return [
      'Edit this exact photo while strictly preserving the person\'s real face, facial identity, eye shape, skin tone, expression, pose, and natural smartphone candid framing.',
      `Apply the requested transformation seamlessly and photorealistically: ${coreEffect}.`,
      'Keep lighting, shadows, and textures cohesive with the original photo. Do not add watermarks, borders, or random text unless explicitly requested.',
      styleHint.trim(),
    ]
      .filter(Boolean)
      .join(' ');
  }

  return `Create a photorealistic candid smartphone portrait: ${coreEffect}.${styleHint}`.trim();
}

export function buildCompactLocketFilterResponse(outputUrl: string): {
  result: { data: { output_url: string } };
} {
  return {
    result: {
      data: {
        output_url: outputUrl,
      },
    },
  };
}

export function normalizeServerUrl(rawUrl: string): string {
  return rawUrl.trim().replace(/\/+$/, '');
}

export function normalizeGitRawScriptsUrl(rawInput: string): string {
  const clean = rawInput.trim().replace(/\/+$/, '');
  if (!clean) return '';
  const ghMatch = clean.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/tree\/([^/]+)(?:\/(.*))?)?$/i);
  if (ghMatch) {
    const [, owner, repo, branch = 'main', subPath = 'github-raw/scripts'] = ghMatch;
    const trimmedSub = subPath.replace(/^\/+|\/+$/g, '');
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${trimmedSub || 'github-raw/scripts'}`;
  }
  return clean;
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

export function decodeJwtUserId(rawToken: string): string {
  const clean = (rawToken || '').replace(/^Bearer\s+/i, '').trim();
  if (!clean) return '';
  const parts = clean.split('.');
  if (parts.length !== 3 || !parts[1]) return '';
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (base64.length % 4)) % 4;
    const padded = base64 + '='.repeat(padLen);
    const jsonStr =
      typeof Buffer !== 'undefined'
        ? Buffer.from(padded, 'base64').toString('utf-8')
        : atob(padded);
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    const candidate = parsed.user_id || parsed.sub || parsed.localId || parsed.uid;
    return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : '';
  } catch {
    return '';
  }
}

export interface LocketPostMomentPayloadInput {
  imageUrl: string;
  imageMd5: string;
  caption?: string;
  audience?: 'all' | 'private';
  now?: Date;
}

export function buildLocketPostMomentPayload({
  imageUrl,
  imageMd5,
  caption = '',
  audience = 'all',
  now = new Date(),
}: LocketPostMomentPayloadInput): { data: Record<string, unknown> } {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const yyyymmdd = `${yyyy}${mm}${dd}`;
  const cleanCaption = caption.trim();
  const isPrivate = audience === 'private';

  const overlays = cleanCaption
    ? [
        {
          data: {
            text: cleanCaption,
            text_color: '#FFFFFFE6',
            type: 'standard',
            max_lines: 4,
            background: {
              colors: [],
              material_blur: 'ultra_thin',
            },
          },
          alt_text: cleanCaption,
          overlay_id: 'caption:standard',
          overlay_type: 'caption',
        },
      ]
    : [];

  return {
    data: {
      thumbnail_url: imageUrl,
      md5: imageMd5,
      recipients: [],
      analytics: {
        experiments: {
          flag_4: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '43' },
          flag_10: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '505' },
          flag_23: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '400' },
          flag_22: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '1203' },
          flag_19: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '52' },
          flag_18: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '1203' },
          flag_16: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '303' },
          flag_15: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '501' },
          flag_14: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '500' },
          flag_25: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: '23' },
        },
        amplitude: {
          device_id: 'locket-studio-web',
          session_id: { '@type': 'type.googleapis.com/google.protobuf.Int64Value', value: String(now.getTime()) },
        },
      },
      sent_to_all: !isPrivate,
      sent_to_self_only: isPrivate,
      caption: cleanCaption || undefined,
      overlays,
      show_personally: false,
      update_streak_for_yyyymmdd: yyyymmdd,
    },
  };
}

export function groupLocketFiltersByCategory(
  filters: LocketFilterPreset[] = LOCKET_FILTERS
): Array<{ category: string; filters: LocketFilterPreset[] }> {
  const sectionMap = new Map<string, LocketFilterPreset[]>();
  for (const item of filters) {
    if (!item || item.id === 'none') continue;
    const list = sectionMap.get(item.category) || [];
    list.push(item);
    sectionMap.set(item.category, list);
  }
  return Array.from(sectionMap.entries()).map(([category, items]) => ({
    category,
    filters: items,
  }));
}

export function generateFilterUnlockScript(): string {
  return `// ============================================================
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
`;
}

export function generateMitmRedirectScript(serverUrl: string, client: ProxyClient): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  let serverHost = 'your-free-locket-ai.onrender.com';
  try {
    serverHost = new URL(cleanUrl).host;
  } catch {
    // fallback host
  }

  if (client === 'quantumultx') {
    return `// ============================================================
// Locket In-App AI & Filter Redirect (Quantumult X)
// Bắt POST /generateFilteredImage trong app Locket và chuyển tới server miễn phí
// ============================================================

const TARGET_ENDPOINT = "${cleanUrl}/generateFilteredImage";
const targetUrl = ($request && $request.url) || "";

if (typeof $response !== "undefined") {
  let obj = {};
  try {
    obj = $response.body ? JSON.parse($response.body) : {};
  } catch (e) {}
  delete obj.error;
  delete obj.errors;
  if (obj.result && typeof obj.result === "object") {
    delete obj.result.error;
    delete obj.result.errors;
  }
  $done({
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(obj)
  });
} else {
  const query = targetUrl.includes("?") ? "?" + targetUrl.split("?")[1] : "";
  const req = {
    url: TARGET_ENDPOINT + query,
    method: ($request && $request.method) || "POST",
    headers: Object.assign({}, ($request && $request.headers) || {}, {
      "Content-Type": "application/json",
      "Host": "${serverHost}",
      "X-Locket-Proxy": "QuantumultX",
      "X-Locket-Compact": "1"
    }),
    body: ($request && $request.body) || "{}"
  };

  $task.fetch(req).then(
    (response) => {
      if (!response || !response.body) {
        $done({});
        return;
      }
      $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
        body: response.body
      });
    },
    () => {
      $done({});
    }
  );
}
`;
  }

  return `// ============================================================
// Locket In-App AI & Filter Redirect (${client.toUpperCase()})
// Dùng $httpClient.post gọi thẳng ${serverHost}/generateFilteredImage
// rồi trả response 200 JSON về Locket (tương thích 100% Shadowrocket/Loon/Surge)
// ============================================================

const TARGET_ENDPOINT = "${cleanUrl}/generateFilteredImage";
const TARGET_HOST = "${serverHost}";

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
    fwdHeaders["X-Locket-Proxy"] = "${client}";
    fwdHeaders["X-Locket-Compact"] = "1";

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
`;
}

export function generateMomentAiFilterScript(serverUrl: string, client: ProxyClient): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  return `// ============================================================
// Locket Caption AI Filter Override (${client.toUpperCase()})
// Can thiệp trực tiếp khi gửi ảnh (postMomentV2):
// Nếu chọn caption "AI · ..." (caption:ai_filter_*) hoặc gõ "#ai <mô tả>",
// ảnh selfie sẽ tự động biến hình Img2Img trước khi đăng lên Locket!
// Nếu gửi ảnh bình thường -> cho qua ngay lập tức (<1ms).
// ============================================================

const MOMENT_AI_ENDPOINT = "${cleanUrl}/api/locket/moment-ai-filter";

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
  const hasAiTag = /^#ai\\b|^\\/ai\\b|^ai:/i.test(captionStr);

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
        "X-Locket-Proxy": "${client}"
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
`;
}

export function generateDirectFilterScript(): string {
  return `// ============================================================
// Locket In-App AI Filter Direct (100% GitHub Raw · 0 Server)
// Chạy trực tiếp trên Shadowrocket/Loon/Surge khi bấm Filter trong Locket
// Dùng AI Horde R2 HTTPS (hỗ trợ cả Img2Img selfie + Txt2Img khi thiếu base64)
// ============================================================

(function () {
  const FILTER_HINTS = {
    practical_magic_2: "lush deep green vines and subtle roses with understated warm glowing fireflies, dreamy enchanted portrait",
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
    bowling_ball: "smooth shiny bald head transformation, humorous realistic studio portrait",
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

  const FILTER_ALIASES = {
    disco: "disco_lights",
    cash: "cash_money",
    cowboy: "cowboy_cowgirl",
    looksmaxing: "looks_maxxing",
    orange_wig: "okay_wig",
    bleached_hair: "blonde_bleached",
    bob: "bob_cut",
    bearded: "beard",
    bearded_holiday: "beard",
    sweat_hearts: "sweet_hearts",
    elf: "elf_cutout",
    santa: "santa_cutout",
    easter_bunny: "easter_bunney_cutout",
    easter_chick: "easter_chick_cutout",
    photobooth_4cut: "photobooth",
    pb_scrapbook_ripped_4cut: "photobooth_cute",
    pb_ripped_paper_4cut: "photobooth_cute",
    pb_denim_ripped_2x2: "photobooth"
  };

  function respondWithImage(imgUrl, provider, filterId) {
    const dataNode = {
      status: 200,
      id: filterId || "custom_look",
      name: filterId || "custom_look",
      outputUrl: imgUrl,
      output_url: imgUrl,
      filtered_image_url: imgUrl,
      filteredImageUrl: imgUrl,
      result_url: imgUrl,
      thumbnail_url: imgUrl,
      preview_url: imgUrl,
      url: imgUrl,
      imageUrl: imgUrl,
      image_url: imgUrl
    };
    const core = {
      ok: true,
      status: 200,
      provider: provider,
      filter_id: filterId || undefined,
      id: filterId || "custom_look",
      name: filterId || "custom_look",
      outputUrl: imgUrl,
      output_url: imgUrl,
      filtered_image_url: imgUrl,
      filteredImageUrl: imgUrl,
      result_url: imgUrl,
      thumbnail_url: imgUrl,
      preview_url: imgUrl,
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
    const capped = String(prompt || "").slice(0, 550);
    return "https://image.pollinations.ai/prompt/" + encodeURIComponent(capped) + "?width=768&height=1024&model=flux&seed=" + seed + "&nologo=true";
  }

  try {
    let raw = {};
    if (typeof $request !== "undefined" && $request && $request.body) {
      try {
        raw = JSON.parse($request.body);
      } catch (e) {}
    }
    const inner = (raw && raw.data && typeof raw.data === "object") ? raw.data : (raw || {});
    const subPayload = (inner && inner.payload && typeof inner.payload === "object") ? inner.payload : {};
    const subFilter = (inner && inner.filter && typeof inner.filter === "object") ? inner.filter : {};
    const merged = Object.assign({}, raw, inner, subPayload, subFilter);

    let filterId = String(
      merged.filter_id || merged.filterId || merged.look_id || merged.lookId ||
      merged.appearance_id || merged.appearanceId || merged.custom_filter_id || merged.customFilterId ||
      merged.sticker_id || merged.stickerId || merged.preset_id || merged.presetId ||
      merged.template_id || merged.effect_id || merged.filter || merged.look || merged.id || ""
    ).trim().toLowerCase();
    if (filterId.startsWith("stk_dio_")) filterId = filterId.slice(8);
    else if (filterId.startsWith("stk_")) filterId = filterId.slice(4);
    if (FILTER_ALIASES[filterId]) filterId = FILTER_ALIASES[filterId];

    const userPrompt = String(merged.prompt || merged.custom_prompt || merged.user_prompt || merged.look_prompt || merged.text || merged.description || "").trim();
    const hint = FILTER_HINTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter aesthetic" : "aesthetic portrait photography");
    const fullPrompt = [userPrompt, hint, "authentic candid 35mm portrait, natural lighting"].filter(Boolean).join(", ");

    const rawImg = String(
      merged.image_base64 || merged.imageBase64 || merged.photo_base64 ||
      merged.source_base64 || merged.input_base64 || merged.image_data || merged.base64 ||
      ((merged.image && !/^https?:\\/\\//i.test(merged.image)) ? merged.image : "") ||
      ((merged.photo && !/^https?:\\/\\//i.test(merged.photo)) ? merged.photo : "") ||
      ""
    );
    const cleanBase64 = rawImg.replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "").trim();

    if (typeof $httpClient === "undefined") {
      respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-direct", filterId);
      return;
    }

    const hasSource = cleanBase64.length >= 64;
    const submitPayload = {
      prompt: fullPrompt,
      params: {
        width: 512,
        height: 640,
        steps: 18,
        n: 1,
        sampler_name: "k_euler_a"
      },
      nsfw: false,
      censor_nsfw: true,
      r2: true
    };
    if (hasSource) {
      submitPayload.params.denoising_strength = 0.58;
      submitPayload.source_image = cleanBase64;
      submitPayload.source_processing = "img2img";
    }

    $httpClient.post(
      {
        url: "https://aihorde.net/api/v2/generate/async",
        headers: {
          "Content-Type": "application/json",
          "apikey": "0000000000",
          "Client-Agent": "LocketGitRawDirect:1.0:ios"
        },
        body: JSON.stringify(submitPayload),
        timeout: 12
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
        const maxAttempts = 24;
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
              if (chk.faulted || chk.is_possible === false || (!chk.done && attempts >= maxAttempts)) {
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
                      respondWithImage(imgUrl, hasSource ? "ai-horde-img2img-direct" : "ai-horde-txt2img-direct", filterId);
                    } else {
                      respondWithImage(buildPollinationsUrl(fullPrompt), "pollinations-fallback", filterId);
                    }
                  }
                );
                return;
              }
              setTimeout(pollStatus, 1800);
            }
          );
        }
        setTimeout(pollStatus, 1800);
      }
    );
  } catch (e) {
    respondWithImage(buildPollinationsUrl("aesthetic dreamy portrait"), "pollinations-safe-fallback", "");
  }
})();
`;
}

export function generateTrafficProbeScript(serverUrl: string): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  return `// ============================================================
// Locket Traffic Probe (Shadowrocket) — Dò URL & Payload thật của app Locket
// Không chặn hay sửa request, bỏ qua upload nhị phân Firebase Storage để không gây treo
// ============================================================

const PROBE_URL = "${cleanUrl}/api/locket/mitm-probe";
const targetUrl = $request.url || "";
const method = String($request.method || "POST").toUpperCase();
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
const isTrackedHost =
  targetUrl.includes("locket") ||
  targetUrl.includes("firebaseremoteconfig.googleapis.com") ||
  targetUrl.includes("firestore.googleapis.com");

function sanitizePreview(str) {
  return String(str || "")
    .replace(/Bearer\\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+/g, "[JWT_REDACTED]")
    .slice(0, 420);
}

if (
  method === "PUT" ||
  targetUrl.includes("/api/locket/") ||
  targetUrl.includes("analytics.locketcamera.com") ||
  targetUrl.includes("cdn.locketcamera.com") ||
  targetUrl.includes("firebasestorage.googleapis.com") ||
  /getMoments|fetchMoments|getGroupMessages|getLatestMoment/i.test(targetUrl) ||
  (!ua.includes("Locket") && !isTrackedHost)
) {
  $done({});
} else {
  let keys = [];
  try {
    const parsed = $request.body ? JSON.parse($request.body) : {};
    const inner = parsed && parsed.data ? parsed.data : parsed;
    if (inner && typeof inner === "object") {
      keys = Object.keys(inner).slice(0, 14);
    }
  } catch (e) {}

  $httpClient.post(
    {
      url: PROBE_URL,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "req",
        method: method,
        url: targetUrl,
        keys: keys,
        bodyPreview: sanitizePreview($request.body || "")
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

export function generateResponseProbeScript(serverUrl: string): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  return `// ============================================================
// Locket Response Probe (Shadowrocket) — Đọc phản hồi Filter API thật
// Không sửa response ($done({})), tự ẩn token và gửi cấu trúc JSON về API & Nhật ký
// ============================================================

const PROBE_URL = "${cleanUrl}/api/locket/mitm-probe";
const targetUrl = $request.url || "";

function sanitizePreview(str) {
  return String(str || "")
    .replace(/Bearer\\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+/g, "[JWT_REDACTED]")
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
`;
}

export interface ConfMergeOptions {
  includeGoldUnlock: boolean;
  usePatchedForceGold?: boolean;
  enableTrafficProbe?: boolean;
  probeOnly?: boolean;
  directNoServer?: boolean;
  scriptBaseUrl?: string;
  aiScriptUrl: string;
  aiPattern?: string;
}

export function generateMergedLocketConf(
  serverUrl: string,
  client: ProxyClient,
  options: ConfMergeOptions = {
    includeGoldUnlock: true,
    usePatchedForceGold: true,
    enableTrafficProbe: false,
    probeOnly: false,
    directNoServer: false,
    scriptBaseUrl: '',
    aiScriptUrl: '',
    aiPattern: DEFAULT_SHADOWROCKET_AI_PATTERN,
  }
): string {
  const cleanServer = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  const rawBase = normalizeGitRawScriptsUrl(options.scriptBaseUrl || '');
  const scriptOrigin = rawBase || `${cleanServer}/scripts`;
  const probeOnly = Boolean(options.probeOnly);
  const directNoServer = probeOnly ? false : Boolean(options.directNoServer);
  const enableTrafficProbe = probeOnly ? true : (options.enableTrafficProbe ?? !directNoServer);
  const includeGoldUnlock = probeOnly ? false : Boolean(options.includeGoldUnlock);

  const scriptSrc =
    options.aiScriptUrl.trim() ||
    (directNoServer
      ? `${scriptOrigin}/locket_ai_direct.js`
      : rawBase
        ? `${scriptOrigin}/locket_ai_redirect.js`
        : `${cleanServer}/scripts/locket_ai_redirect.js?client=${client}`);

  const momentAiSrc = rawBase
    ? `${scriptOrigin}/locket_ai_moment.js`
    : `${cleanServer}/scripts/locket_ai_moment.js?client=${client}`;

  const probeReqSrc = rawBase
    ? `${scriptOrigin}/locket_traffic_probe.js`
    : `${cleanServer}/scripts/locket_traffic_probe.js`;
  const probeResSrc = rawBase
    ? `${scriptOrigin}/locket_response_probe.js`
    : `${cleanServer}/scripts/locket_response_probe.js`;

  const filterUnlockSrc = `${scriptOrigin}/locket_filter_unlock.js`;
  const locketFixSrc = `${scriptOrigin}/locketfix8.js`;
  const locketHeaderSrc = `${scriptOrigin}/header7.js`;
  const forceGoldSrc =
    options.usePatchedForceGold !== false
      ? `${scriptOrigin}/forceGold4.3.js`
      : 'https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/forceGold4.3.js';
  const aiPattern = (options.aiPattern || DEFAULT_SHADOWROCKET_AI_PATTERN).trim();

  const probeReqPattern =
    '^https:\\/\\/(?!(analytics|cdn)\\.)(?!.*(getMoments|fetchMoments|getGroupMessages|getLatestMoment))([^/]+\\.locketcamera\\.com|[^/]*cloudfunctions\\.net|[^/]*\\.a\\.run\\.app|firebaseremoteconfig\\.googleapis\\.com|firestore\\.googleapis\\.com)\\/.*';
  const probeResPattern =
    '^https:\\/\\/(?!(analytics|cdn)\\.)(?!.*(getMoments|fetchMoments|getGroupMessages|getLatestMoment))([^/]+\\.locketcamera\\.com|[^/]*cloudfunctions\\.net|[^/]*\\.a\\.run\\.app|firestore\\.googleapis\\.com)\\/.*';

  if (client === 'quantumultx') {
    const rewriteLines: string[] = [];
    if (includeGoldUnlock) {
      rewriteLines.push(
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$) url script-response-body ${locketFixSrc}`,
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers) url script-request-header ${locketHeaderSrc}`,
        `^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+ url script-request-header ${filterUnlockSrc}`,
        `^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+ url script-response-body ${forceGoldSrc}`,
        `${LOCKET_FILTER_UNLOCK_PATTERN} url script-request-header ${filterUnlockSrc}`,
        `${LOCKET_FILTER_UNLOCK_PATTERN} url script-response-body ${filterUnlockSrc}`
      );
    }
    if (!probeOnly) {
      rewriteLines.push(`${aiPattern} url script-analyze-echo-response ${scriptSrc}`);
    }

    return `# Quantumult X Configuration - ${probeOnly ? 'Passive Probe Only' : '100% Locket Gold + In-App Filter AI'}
[rewrite_local]
${rewriteLines.join('\n')}

[mitm]
hostname = api.revenuecat.com, firebaseremoteconfig.googleapis.com, -analytics.locketcamera.com, -cdn.locketcamera.com, -firebasestorage.googleapis.com, api.locketcamera.com, *.locketcamera.com, us-central1-locket-4252a.cloudfunctions.net, *.cloudfunctions.net, *.a.run.app
`;
  }

  const scriptLines: string[] = [];
  if (includeGoldUnlock) {
    scriptLines.push(
      `revenuecat = type=http-response, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$), script-path=${locketFixSrc}, requires-body=true, max-size=-1, timeout=60`,
      `deleteHeader = type=http-request, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers), script-path=${locketHeaderSrc}, timeout=60`,
      `locket_rc_req = type=http-request, pattern=^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+, script-path=${filterUnlockSrc}, requires-body=false, max-size=-1, timeout=30`,
      `locket_rc = type=http-response, pattern=^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+, script-path=${forceGoldSrc}, requires-body=true, max-size=-1, timeout=60`,
      `locket_filter_unlock_req = type=http-request, pattern=${LOCKET_FILTER_UNLOCK_PATTERN}, script-path=${filterUnlockSrc}, requires-body=false, max-size=-1, timeout=30`,
      `locket_filter_unlock_res = type=http-response, pattern=${LOCKET_FILTER_UNLOCK_PATTERN}, script-path=${filterUnlockSrc}, requires-body=true, max-size=-1, timeout=30`
    );
  }
  if (enableTrafficProbe) {
    scriptLines.push(
      `locket_probe = type=http-request, pattern=${probeReqPattern}, script-path=${probeReqSrc}, requires-body=true, max-size=1048576, timeout=5`,
      `locket_probe_res = type=http-response, pattern=${probeResPattern}, script-path=${probeResSrc}, requires-body=true, max-size=1048576, timeout=5`
    );
  }
  if (!probeOnly) {
    if (directNoServer) {
      scriptLines.push(
        `locket_ai_filter_direct = type=http-request, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=-1, timeout=60`
      );
    } else {
      scriptLines.push(
        `locket_ai_filter_req = type=http-request, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=-1, timeout=60`,
        `locket_ai_moment_req = type=http-request, pattern=${LOCKET_MOMENT_AI_PATTERN}, script-path=${momentAiSrc}, requires-body=true, max-size=-1, timeout=60`
      );
    }
  }

  const mitmHosts = [
    ...(probeOnly ? [] : ['api.revenuecat.com']),
    'firebaseremoteconfig.googleapis.com',
    '-analytics.locketcamera.com',
    '-cdn.locketcamera.com',
    '-firebasestorage.googleapis.com',
    'api.locketcamera.com',
    '*.locketcamera.com',
    'us-central1-locket-4252a.cloudfunctions.net',
    '*.cloudfunctions.net',
    '*.a.run.app',
  ];
  if (enableTrafficProbe) {
    mitmHosts.push('firestore.googleapis.com');
  }

  const modeComment = probeOnly
    ? 'Probe Only · Chỉ soi API gốc · Không sửa request · Không MITM Firebase Storage'
    : directNoServer
      ? 'Thuần GitHub Raw · 0 Server'
      : rawBase
        ? 'GitHub Raw + Backend Img2Img'
        : 'Self-Hosted';

  return `# ${probeOnly ? 'Locket Passive API Probe' : 'Locket Gold + In-App Filter AI'} (${client.toUpperCase()})
# ${modeComment}
[General]
bypass-system = true
loglevel = notify
skip-proxy = 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, localhost, *.local, captive.apple.com

[Rule]
FINAL,DIRECT

[Script]
${scriptLines.join('\n')}

[MITM]
h2 = true
hostname = ${mitmHosts.join(', ')}
`;
}

export function generateStandaloneServerCode(platform: DeployPlatform): string {
  if (platform === 'worker') {
    return `// worker.js — Cloudflare Worker 0đ (Không Sleep, Không Giao Diện Web)
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
        .replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "")
        .trim();

      let imgUrlField = String(body.image_url || body.imageUrl || body.source_url || body.photo_url || "");
      const storagePathField = String(body.storage_path || body.storagePath || body.image_path || "").trim();
      if (!imgUrlField && storagePathField && storagePathField.includes("/")) {
        imgUrlField = "https://firebasestorage.googleapis.com/v0/b/locket-img/o/" + encodeURIComponent(storagePathField.replace(/^\\/+/, "")) + "?alt=media";
      }
      if (!cleanBase64 && /^https?:\\/\\//i.test(imgUrlField)) {
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
`;
  }

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
