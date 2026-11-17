export type ProxyClient = 'shadowrocket' | 'loon' | 'surge' | 'quantumultx';
export type AspectRatioOption = '1:1' | '3:4' | '9:16';
export type FreeAiModel = 'flux' | 'turbo' | 'anime';
export type DeployPlatform = 'worker' | 'render' | 'railway' | 'vercel' | 'termux';

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

// Matches Locket in-app AI Filter & Photobooth endpoints (including generateFilteredImage) while excluding read/config/analytics/moment endpoints (such as getFilters)
export const DEFAULT_SHADOWROCKET_AI_PATTERN =
  '^https:\\/\\/(api\\.locketcamera\\.com|.*cloudfunctions\\.net|.*-uc\\.a\\.run\\.app)\\/(?!.*(getFilters|get[A-Z]|fetch[A-Z]|list[A-Z]|set[A-Z]|update[A-Z]|delete[A-Z]|postMoment|rollcall|account|login|streak|reaction|chat|message|friend|telemetry|analytics|log)).*([Gg]enerate[Ff]iltered[Ii]mage|[Cc]reate[Ff]iltered[Ii]mage|[Aa]pply[Ff]ilter|[Gg]enerate[Ff]ilter|[Cc]reate[Ff]ilter|[Cc]ustom[Ff]ilter|[Pp]rocess[Ff]ilter|[Rr]ender[Ff]ilter|[Cc]amera[Ff]ilter|[Mm]agic[Ff]ilter|[Aa][Ii][Ff]ilter|[Ff]ilter[Aa][Ii]|[Gg]enerate[Aa][Ii]|[Gg]enerate[Mm]agic|[Gg]enerate[Pp]hotobooth|[Pp]hotobooth|[Gg]enerate[Ii]mage|[Gg]enerate[Pp]hoto|[Aa][Ii][Gg]enerate|filters?\\/(apply|generate|create|process|render)|ai\\/(generate|image|filter|remix|transform)|[Tt]ransform[Ii]mage|[Rr]estyle|[Pp]hoto[Ee]ffect|[Aa]pply[Ee]ffect).*';

export const LOCKET_FILTER_UNLOCK_PATTERN =
  '^https:\\/\\/api\\.locketcamera\\.com\\/(?!.*([Gg]enerate[Ff]iltered[Ii]mage|[Cc]reate[Ff]iltered[Ii]mage|[Gg]enerate[Ff]ilter|[Aa]pply[Ff]ilter)).*';

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
  // Holidays & Seasonal
  {
    id: 'santa_cutout',
    category: 'Holidays',
    label: 'Santa Cutout (Noel)',
    promptInstruction: 'dressed up as Santa Claus with cozy red Santa hat and white fur trim, preserving exact pose and background, warm holiday lights',
  },
  {
    id: 'elf_cutout',
    category: 'Holidays',
    label: 'Elf Cutout',
    promptInstruction: 'dressed up as a festive Christmas Elf with green hat and pointed ears, preserving exact pose and background',
  },
  {
    id: 'sweet_hearts',
    category: 'Holidays',
    label: 'Sweet Hearts (Valentine)',
    promptInstruction: 'romantic Valentine pastel pink heart confetti atmosphere, dreamy warm portrait',
  },
  {
    id: 'easter_bunney_cutout',
    category: 'Holidays',
    label: 'Easter Bunny',
    promptInstruction: 'wearing a cute pastel Easter bunny ear headband and spring aesthetic, preserving exact pose and background',
  },
  {
    id: 'easter_chick_cutout',
    category: 'Holidays',
    label: 'Easter Chick',
    promptInstruction: 'wearing a bright yellow fluffy Easter chick costume, preserving exact pose and background',
  },
  {
    id: 'leprechaun',
    category: 'Holidays',
    label: 'Leprechaun',
    promptInstruction: 'wearing a green top hat with shamrock and festive leprechaun costume, preserving exact pose and background',
  },
  {
    id: 'lucky_face',
    category: 'Holidays',
    label: 'Lucky Face (Tàn nhang)',
    promptInstruction: 'cute subtle freckles across the bridge of the nose and cheeks, warm golden glow, preserving exact pose and background',
  },
  {
    id: 'frosty',
    category: 'Holidays',
    label: 'Frosty (Băng giá)',
    promptInstruction: 'cozy winter snow and icy frosted sparkle atmosphere around the portrait, preserving exact pose',
  },
  // Photobooth 4-Cut & Frames
  {
    id: 'photobooth',
    category: 'Photobooth',
    label: 'Korean Photobooth 4-Cut',
    promptInstruction: 'captured with a Korean photobooth 4-cut aesthetic, vintage soft lighting, clear facial features, modern iPhone camera look',
  },
  {
    id: 'photobooth_cute',
    category: 'Photobooth',
    label: 'Photobooth Cute Pastel',
    promptInstruction: 'captured with a cute pastel photobooth aesthetic, soft dreamy lighting, clear facial features',
  },
  {
    id: 'pb_strawberry',
    category: 'Photobooth',
    label: 'Photobooth Strawberry',
    promptInstruction: 'captured with a cute pastel strawberry photobooth aesthetic, soft rosy lighting, modern iPhone camera look',
  },
  {
    id: 'pb_vintage',
    category: 'Photobooth',
    label: 'Photobooth Vintage 90s',
    promptInstruction: 'captured with vintage 90s film photobooth aesthetic, warm nostalgic grain and soft flash lighting',
  },
  {
    id: 'pb_galaxy',
    category: 'Photobooth',
    label: 'Photobooth Galaxy',
    promptInstruction: 'captured with dreamy galaxy stars ambient glow aesthetic, soft cosmic studio lighting',
  },
  {
    id: 'pb_holo_4cut',
    category: 'Photobooth',
    label: 'Photobooth Holographic Y2K',
    promptInstruction: 'captured with holographic Y2K photobooth aesthetic, iridescent chrome shine and soft studio lighting',
  },
  {
    id: 'frame_classic_pb',
    category: 'Photobooth',
    label: 'Classic B&W Photobooth',
    promptInstruction: 'captured with classic black and white film photobooth aesthetic, dramatic soft studio contrast',
  },
  // Effects & Fantasy
  {
    id: 'rose_flower',
    category: 'Effects',
    label: 'Rose Flower (Hoa hồng)',
    promptInstruction: 'holding a single red rose flower with romantic warm cinematic lighting, preserving exact pose and background',
  },
  {
    id: 'golden_hour',
    category: 'Effects',
    label: 'Golden Hour (Nắng chiều)',
    promptInstruction: 'bathed in rich warm sunset golden hour sunlight glow and soft shadows, preserving exact pose and background',
  },
  {
    id: 'watercolor_art',
    category: 'Effects',
    label: 'Watercolor Art (Màu nước)',
    promptInstruction: 'delicate hand-painted watercolor illustration artwork with soft brush strokes and artistic paper texture',
  },
  {
    id: 'harry_potter',
    category: 'Effects',
    label: 'Harry Potter Wizard',
    promptInstruction: 'dressed as a Hogwarts wizard wearing a dark academic robe and scarf, magical candlelit castle lighting',
  },
  {
    id: 'minecraft',
    category: 'Effects',
    label: 'Minecraft Voxel',
    promptInstruction: 'transformed into a stylized blocky Minecraft 3D voxel world aesthetic while preserving pose and scene',
  },
  {
    id: 'shrek_ogre',
    category: 'Effects',
    label: 'Shrek Ogre',
    promptInstruction: 'playful transformation with green Shrek ogre rounded ears and rustic tunic while preserving exact pose',
  },
  {
    id: 'superhero_cape',
    category: 'Effects',
    label: 'Superhero Cape',
    promptInstruction: 'dressed in a vibrant blue and red superhero suit with flowing red cape, dramatic studio lighting',
  },
  {
    id: 'pirate_hat',
    category: 'Effects',
    label: 'Pirate Captain',
    promptInstruction: 'dressed like a movie pirate captain with weathered leather tricorn hat and coat, preserving exact pose',
  },
  {
    id: 'ocean_underwater',
    category: 'Effects',
    label: 'Ocean Underwater',
    promptInstruction: 'underwater ocean blue light caustics and floating bubbles around the portrait, preserving exact pose',
  },
  {
    id: 'fireworks',
    category: 'Effects',
    label: 'Fireworks (Pháo hoa)',
    promptInstruction: 'night sky filled with colorful exploding fireworks reflections across the scene, preserving exact pose',
  },
];

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
  originalUrl: string;
  isCallable: boolean;
  bodyKeys: string[];
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
    'id',
    'name',
  ]);
  const filterId = normalizeFilterId(rawFilterId);

  const prompt = pickString([
    'prompt',
    'custom_prompt',
    'customPrompt',
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

  const genericImage = pickString(['image', 'photo', 'input_image', 'source_image', 'media']);
  if (genericImage) {
    if (/^https?:\/\//i.test(genericImage) && !imageUrl) {
      imageUrl = genericImage;
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
      "X-Locket-Proxy": "QuantumultX"
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
// Chuyển hướng trực tiếp POST /generateFilteredImage từ app Locket
// về máy chủ AI 0đ của bạn (giữ nguyên toàn bộ body ảnh selfie + filter)
// ============================================================

const TARGET_ENDPOINT = "${cleanUrl}/generateFilteredImage";
const TARGET_HOST = "${serverHost}";

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
      headers["X-Locket-Proxy"] = "${client}";
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
`;
}

export function generateDirectFilterScript(): string {
  return `// ============================================================
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
      ((merged.image && !/^https?:\\/\\//i.test(merged.image)) ? merged.image : "") ||
      ((merged.photo && !/^https?:\\/\\//i.test(merged.photo)) ? merged.photo : "") ||
      ""
    );
    const cleanBase64 = rawImg.replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "").trim();

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

if (
  targetUrl.includes("analytics.locketcamera.com") ||
  targetUrl.includes("cdn.locketcamera.com") ||
  (!ua.includes("Locket") && !targetUrl.includes("locket"))
) {
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
        kind: "req",
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

export function generateResponseProbeScript(serverUrl: string): string {
  const cleanUrl = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  return `// ============================================================
// Locket Response Probe (Shadowrocket) — Đọc phản hồi getFilters / Filter API
// Không sửa response ($done({})), chỉ gửi cấu trúc JSON về tab API & Nhật ký
// ============================================================

const PROBE_URL = "${cleanUrl}/api/locket/mitm-probe";
const targetUrl = $request.url || "";
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
      bodyPreview: String(raw).slice(0, 380)
    }),
    timeout: 2
  },
  function () {
    $done({});
  }
);
`;
}

export interface ConfMergeOptions {
  includeGoldUnlock: boolean;
  usePatchedForceGold?: boolean;
  enableTrafficProbe?: boolean;
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
    directNoServer: false,
    scriptBaseUrl: '',
    aiScriptUrl: '',
    aiPattern: DEFAULT_SHADOWROCKET_AI_PATTERN,
  }
): string {
  const cleanServer = normalizeServerUrl(serverUrl) || 'https://your-free-locket-ai.onrender.com';
  const rawBase = normalizeGitRawScriptsUrl(options.scriptBaseUrl || '');
  const scriptOrigin = rawBase || `${cleanServer}/scripts`;
  const directNoServer = Boolean(options.directNoServer);

  const scriptSrc =
    options.aiScriptUrl.trim() ||
    (directNoServer
      ? `${scriptOrigin}/locket_ai_direct.js`
      : rawBase
        ? `${scriptOrigin}/locket_ai_redirect.js`
        : `${cleanServer}/scripts/locket_ai_redirect.js?client=${client}`);

  const filterUnlockSrc = `${scriptOrigin}/locket_filter_unlock.js`;
  const locketFixSrc = `${scriptOrigin}/locketfix8.js`;
  const locketHeaderSrc = `${scriptOrigin}/header7.js`;
  const forceGoldSrc =
    options.usePatchedForceGold !== false
      ? `${scriptOrigin}/forceGold4.3.js`
      : 'https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/forceGold4.3.js';
  const aiPattern = (options.aiPattern || DEFAULT_SHADOWROCKET_AI_PATTERN).trim();

  if (client === 'quantumultx') {
    const rewriteLines: string[] = [];
    if (options.includeGoldUnlock) {
      rewriteLines.push(
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$) url script-response-body ${locketFixSrc}`,
        `^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers) url script-request-header ${locketHeaderSrc}`,
        `^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+ url script-response-body ${forceGoldSrc}`,
        `${LOCKET_FILTER_UNLOCK_PATTERN} url script-request-header ${filterUnlockSrc}`,
        `${LOCKET_FILTER_UNLOCK_PATTERN} url script-response-body ${filterUnlockSrc}`
      );
    }
    rewriteLines.push(`${aiPattern} url script-analyze-echo-response ${scriptSrc}`);

    return `# Quantumult X Configuration - 100% Locket Gold + In-App Filter AI
[rewrite_local]
${rewriteLines.join('\n')}

[mitm]
hostname = api.revenuecat.com, firebaseremoteconfig.googleapis.com, -analytics.locketcamera.com, -cdn.locketcamera.com, api.locketcamera.com, us-central1-locket-4252a.cloudfunctions.net, *.cloudfunctions.net, *-uc.a.run.app
`;
  }

  const scriptLines: string[] = [];
  if (options.includeGoldUnlock) {
    scriptLines.push(
      `revenuecat = type=http-response, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$), script-path=${locketFixSrc}, requires-body=true, max-size=-1, timeout=60`,
      `deleteHeader = type=http-request, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers), script-path=${locketHeaderSrc}, timeout=60`,
      `locket_rc = type=http-response, pattern=^https:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/locket-4252a\\/.+, script-path=${forceGoldSrc}, requires-body=true, max-size=-1, timeout=60`,
      `locket_filter_unlock_req = type=http-request, pattern=${LOCKET_FILTER_UNLOCK_PATTERN}, script-path=${filterUnlockSrc}, requires-body=false, max-size=-1, timeout=30`,
      `locket_filter_unlock_res = type=http-response, pattern=${LOCKET_FILTER_UNLOCK_PATTERN}, script-path=${filterUnlockSrc}, requires-body=true, max-size=-1, timeout=30`
    );
  }
  if (options.enableTrafficProbe && !directNoServer) {
    scriptLines.push(
      `locket_probe = type=http-request, pattern=^https:\\/\\/(?!(analytics|cdn)\\.).*(locketcamera\\.com|cloudfunctions\\.net|uc\\.a\\.run\\.app)\\/.*, script-path=${cleanServer}/scripts/locket_traffic_probe.js, requires-body=true, max-size=1048576, timeout=5`,
      `locket_probe_res = type=http-response, pattern=^https:\\/\\/api\\.locketcamera\\.com\\/(getFilters|.*[Ff]ilter.*), script-path=${cleanServer}/scripts/locket_response_probe.js, requires-body=true, max-size=1048576, timeout=5`
    );
  }
  if (directNoServer) {
    scriptLines.push(
      `locket_ai_filter_direct = type=http-request, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=0, timeout=60`
    );
  } else {
    scriptLines.push(
      `locket_ai_filter_req = type=http-request, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=-1, timeout=60`,
      `locket_ai_filter_res = type=http-response, pattern=${aiPattern}, script-path=${scriptSrc}, requires-body=true, max-size=-1, timeout=60`
    );
  }

  const mitmHosts = [
    'api.revenuecat.com',
    'firebaseremoteconfig.googleapis.com',
    '-analytics.locketcamera.com',
    '-cdn.locketcamera.com',
    'api.locketcamera.com',
    'us-central1-locket-4252a.cloudfunctions.net',
    '*.cloudfunctions.net',
    '*-uc.a.run.app',
  ];

  return `# Locket Gold + In-App Filter AI (${client.toUpperCase()})
# 100% thuần Locket (${directNoServer ? 'Thuần GitHub Raw · 0 Server' : rawBase ? 'GitHub Raw + Backend Img2Img' : 'Self-Hosted'})
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
  const submit = await fetch("https://aihorde.net/api/v2/generate/async", {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: "0000000000", "Client-Agent": "LocketCFWorker:1.0" },
    body: JSON.stringify({
      prompt,
      params: { width: 512, height: 640, steps: 20, n: 1, sampler_name: "k_euler_a", denoising_strength: 0.58 },
      source_image: cleanBase64,
      source_processing: "img2img",
      nsfw: false,
      censor_nsfw: true,
      r2: true
    })
  });
  if (!submit.ok) throw new Error("Horde submit " + submit.status);
  const { id } = await submit.json();
  if (!id) throw new Error("Missing Horde id");

  for (let i = 0; i < 14; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const chk = await (await fetch("https://aihorde.net/api/v2/generate/check/" + id)).json();
    if (chk.faulted) throw new Error("Horde faulted");
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
      let filterId = String(body.filter_id || body.filterId || body.sticker_id || "").trim().toLowerCase();
      filterId = filterId.replace(/^stk_dio_/, "").replace(/^stk_/, "");
      const hint = FILTER_PROMPTS[filterId] || (filterId ? filterId.replace(/_/g, " ") + " filter" : "aesthetic portrait");
      const rawPrompt = String(body.prompt || body.custom_prompt || body.text || "").trim();
      const fullPrompt = [rawPrompt, hint, "authentic candid 35mm portrait"].filter(Boolean).join(", ");

      let cleanBase64 = String(body.image_base64 || body.imageBase64 || body.photo_base64 || body.base64 || "")
        .replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "")
        .trim();

      const imgUrlField = String(body.image_url || body.imageUrl || body.source_url || body.photo_url || "");
      if (!cleanBase64 && /^https?:\\/\\//i.test(imgUrlField)) {
        const imgRes = await fetch(imgUrlField);
        if (imgRes.ok) cleanBase64 = arrayBufferToBase64(await imgRes.arrayBuffer());
      }

      let outputUrl = "";
      let provider = "pollinations-flux";
      if (cleanBase64.length > 64) {
        try {
          outputUrl = await runImg2ImgHorde(fullPrompt, cleanBase64);
          provider = "ai-horde-img2img";
        } catch {}
      }
      if (!outputUrl) {
        const seed = Math.floor(Math.random() * 1000000);
        outputUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(fullPrompt) + "?width=768&height=1024&model=flux&seed=" + seed + "&nologo=true";
      }

      const dataNode = { status: 200, outputUrl, output_url: outputUrl, url: outputUrl, imageUrl: outputUrl, image_url: outputUrl };
      const payload = { ok: true, status: 200, provider, filter_id: filterId || undefined, ...dataNode, data: dataNode };
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
