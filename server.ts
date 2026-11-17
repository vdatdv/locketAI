import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildEnhancedPrompt,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  generateResponseProbeScript,
  generateTrafficProbeScript,
  getDimensionsForAspectRatio,
  type AspectRatioOption,
  type FreeAiModel,
  type ProxyClient,
} from './src/utils/locketConfig.ts';
import { buildStoreZip, type ZipEntryInput } from './src/utils/zipBuilder.ts';

interface ServerLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  provider: string;
  detail: string;
}

const PORT = Number(process.env.PORT || 3000);
const START_TIME = Date.now();
const requestLogs: ServerLogEntry[] = [];
const mediaCache = new Map<string, { buffer: Buffer; mime: string }>();

function storeMediaInCache(imageDataUrl: string): { mediaId: string; ext: string } {
  const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  let mime = 'image/jpeg';
  let buffer: Buffer;
  if (match) {
    mime = match[1];
    buffer = Buffer.from(match[2], 'base64');
  } else {
    buffer = Buffer.from(imageDataUrl, 'utf-8');
    mime = 'image/svg+xml';
  }

  const ext = mime.includes('png')
    ? 'png'
    : mime.includes('webp')
      ? 'webp'
      : mime.includes('svg')
        ? 'svg'
        : 'jpg';
  const mediaId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  mediaCache.set(mediaId, { buffer, mime });
  if (mediaCache.size > 50) {
    const oldestKey = mediaCache.keys().next().value;
    if (oldestKey) mediaCache.delete(oldestKey);
  }
  return { mediaId, ext };
}

function recordLog(entry: Omit<ServerLogEntry, 'id' | 'timestamp'>) {
  requestLogs.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  if (requestLogs.length > 100) {
    requestLogs.length = 100;
  }
}

let cachedAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

async function translatePromptIfNeeded(rawPrompt: string): Promise<{ prompt: string; translated: boolean }> {
  if (!rawPrompt) {
    return { prompt: '', translated: false };
  }
  const hasNonAscii = /[^\x00-\x7F]/.test(rawPrompt);
  const ai = getGeminiClient();
  if (!ai || !hasNonAscii) {
    return { prompt: rawPrompt, translated: false };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate and refine this Vietnamese photo/image description into a concise, vivid English image generation prompt (under 40 words, no quotes, no commentary): "${rawPrompt}"`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });
    const text = response.text?.trim();
    if (text && text.length > 3) {
      return { prompt: text.replace(/^["']|["']$/g, ''), translated: true };
    }
  } catch {
    // Gracefully keep original prompt if Gemini translation fails or rate-limits
  }
  return { prompt: rawPrompt, translated: false };
}

function buildOfflinePreviewSvgDataUrl(
  prompt: string,
  width: number,
  height: number,
  style: string,
  filterId?: string
): string {
  const safePrompt = (prompt || filterId || 'Locket AI Filter')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 90);
  const safeStyle = (filterId && filterId !== 'none' ? `Filter: ${filterId}` : `Style: ${style}`).replace(
    /[<>&]/g,
    ''
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="45%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="${width / 2}" cy="${height * 0.42}" r="${Math.min(width, height) * 0.35}" fill="url(#glow)"/>
  <rect x="${width * 0.12}" y="${height * 0.25}" width="${width * 0.76}" height="${height * 0.48}" rx="36" fill="rgba(15,23,42,0.55)" stroke="rgba(251,191,36,0.45)" stroke-width="3"/>
  <text x="50%" y="${height * 0.43}" text-anchor="middle" fill="#FDE68A" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.042)}" font-weight="700">Locket AI Free Preview</text>
  <text x="50%" y="${height * 0.51}" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.026)}">${safePrompt}</text>
  <text x="50%" y="${height * 0.58}" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="${Math.round(width * 0.02)}">${safeStyle} · ${width}x${height}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;
}

async function fetchFromPollinations(
  enhancedPrompt: string,
  width: number,
  height: number,
  model: FreeAiModel
): Promise<{ imageDataUrl: string; provider: string }> {
  const upstreamModel = model === 'turbo' ? 'turbo' : 'flux';
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    enhancedPrompt
  )}?width=${width}&height=${height}&model=${upstreamModel}&seed=${seed}&nologo=true`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'LocketFreeAIServer/1.0',
        Accept: 'image/*',
      },
    });
    if (!res.ok) {
      throw new Error(`Pollinations HTTP ${res.status}`);
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength < 1024) {
      throw new Error('Image payload too small');
    }
    return {
      imageDataUrl: `data:${contentType};base64,${bytes.toString('base64')}`,
      provider: `pollinations-${upstreamModel}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromAiHorde(
  enhancedPrompt: string,
  aspectRatio: AspectRatioOption,
  sourceBase64?: string
): Promise<{ imageDataUrl: string; provider: string }> {
  // Anonymous key "0000000000" allows free generation (both txt2img and img2img) up to 576px / 25 steps without kudos
  const hordeDims =
    aspectRatio === '3:4'
      ? { width: 512, height: 640 }
      : aspectRatio === '9:16'
        ? { width: 448, height: 768 }
        : { width: 512, height: 512 };

  const cleanSource = (sourceBase64 || '')
    .replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '')
    .trim();
  const isImg2Img = cleanSource.length > 32;

  const submitRes = await fetch('https://aihorde.net/api/v2/generate/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: '0000000000',
      'Client-Agent': 'LocketFreeAIServer:1.0:web',
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      params: {
        width: hordeDims.width,
        height: hordeDims.height,
        steps: 20,
        n: 1,
        sampler_name: 'k_euler_a',
        ...(isImg2Img ? { denoising_strength: 0.58 } : {}),
      },
      ...(isImg2Img ? { source_image: cleanSource, source_processing: 'img2img' } : {}),
      nsfw: false,
      censor_nsfw: true,
      r2: true,
    }),
  });

  if (!submitRes.ok) {
    throw new Error(`AI Horde submit HTTP ${submitRes.status}`);
  }
  const submitData = (await submitRes.json()) as { id?: string };
  if (!submitData.id) {
    throw new Error('AI Horde did not return job id');
  }

  const deadline = Date.now() + 26000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const checkRes = await fetch(
      `https://aihorde.net/api/v2/generate/check/${submitData.id}`,
      { headers: { 'Client-Agent': 'LocketFreeAIServer:1.0:web' } }
    );
    if (!checkRes.ok) continue;
    const checkData = (await checkRes.json()) as { done?: boolean; faulted?: boolean };
    if (checkData.faulted) {
      throw new Error('AI Horde job faulted');
    }
    if (checkData.done) {
      const statusRes = await fetch(
        `https://aihorde.net/api/v2/generate/status/${submitData.id}`,
        { headers: { 'Client-Agent': 'LocketFreeAIServer:1.0:web' } }
      );
      if (!statusRes.ok) {
        throw new Error(`AI Horde status HTTP ${statusRes.status}`);
      }
      const statusData = (await statusRes.json()) as {
        generations?: Array<{ img?: string; model?: string }>;
      };
      const firstGen = statusData.generations?.[0];
      const imgField = firstGen?.img;
      if (!imgField) {
        throw new Error('AI Horde returned empty image');
      }
      const prefix = isImg2Img ? 'ai-horde-img2img' : 'ai-horde';
      if (imgField.startsWith('http')) {
        const imgRes = await fetch(imgField);
        if (!imgRes.ok) throw new Error(`AI Horde image download HTTP ${imgRes.status}`);
        const mime = imgRes.headers.get('content-type') || 'image/webp';
        const buf = Buffer.from(await imgRes.arrayBuffer());
        return {
          imageDataUrl: `data:${mime};base64,${buf.toString('base64')}`,
          provider: `${prefix} (${firstGen?.model || 'free-gpu'})`,
        };
      }
      return {
        imageDataUrl: `data:image/webp;base64,${imgField}`,
        provider: `${prefix} (${firstGen?.model || 'free-gpu'})`,
      };
    }
  }
  throw new Error('AI Horde timeout');
}

async function handleGenerateRequest(req: Request, res: Response, endpointLabel: string) {
  const startedAt = Date.now();
  const rawBody = (req.body || {}) as Record<string, unknown>;
  const callablePayload =
    rawBody.data && typeof rawBody.data === 'object'
      ? (rawBody.data as Record<string, unknown>)
      : null;
  const body = callablePayload || rawBody;
  const isCallable = Boolean(callablePayload || rawBody.callable);

  const filterId = String(body.filter_id || body.filterId || body.filter || '').trim();
  const rawPrompt = String(
    body.prompt || body.custom_prompt || body.text || body.caption || ''
  ).trim();
  const styleId = String(body.style || body.preset || 'natural').trim();
  const aspectRatioRaw = String(body.aspect_ratio || body.aspectRatio || '1:1');
  const aspectRatio: AspectRatioOption =
    aspectRatioRaw === '3:4' || aspectRatioRaw === '9:16' ? aspectRatioRaw : '1:1';
  const modelRaw = String(body.model || 'flux');
  const model: FreeAiModel =
    modelRaw === 'turbo' || modelRaw === 'anime' ? modelRaw : 'flux';
  const sourceBase64 = String(
    body.image_base64 || body.image || body.photo || body.imageData || ''
  ).trim();
  const originalUrl = String(body.original_url || '').trim();

  const hasFilter = Boolean(filterId && filterId !== 'none');
  if (!rawPrompt && !hasFilter) {
    const latencyMs = Date.now() - startedAt;
    const bodyKeys = Object.keys(body).slice(0, 8).join(', ');
    recordLog({
      method: req.method,
      path: endpointLabel,
      status: 400,
      latencyMs,
      provider: 'validation',
      detail: [
        'Empty prompt/filter_id',
        originalUrl ? `from ${originalUrl.replace(/^https?:\/\//, '').slice(0, 70)}` : '',
        bodyKeys ? `keys: [${bodyKeys}]` : '',
      ]
        .filter(Boolean)
        .join(' · '),
    });
    return res.status(400).json({
      ok: false,
      error: 'Vui lòng nhập mô tả ảnh (prompt) hoặc chọn một Filter Locket.',
    });
  }

  const { width, height } = getDimensionsForAspectRatio(aspectRatio);
  const { prompt: promptForModel, translated } = await translatePromptIfNeeded(rawPrompt);
  const enhancedPrompt = buildEnhancedPrompt(rawPrompt, styleId, promptForModel, filterId);
  const hasSourceImage = sourceBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').length > 32;

  let imageDataUrl = '';
  let provider = '';
  let notice = '';

  if (hasSourceImage) {
    try {
      const hordeImg2Img = await fetchFromAiHorde(enhancedPrompt, aspectRatio, sourceBase64);
      imageDataUrl = hordeImg2Img.imageDataUrl;
      provider = hordeImg2Img.provider;
    } catch {
      try {
        const generated = await fetchFromPollinations(enhancedPrompt, width, height, model);
        imageDataUrl = generated.imageDataUrl;
        provider = generated.provider;
        notice = 'Node Img2Img miễn phí đang quá tải; đã tạo ảnh theo mô tả filter.';
      } catch (fallbackErr) {
        imageDataUrl = buildOfflinePreviewSvgDataUrl(rawPrompt, width, height, styleId, filterId);
        provider = 'local-svg-fallback';
        notice =
          fallbackErr instanceof Error
            ? `Các node AI miễn phí đang bận (${fallbackErr.message}); đã trả về ảnh xem trước cục bộ.`
            : 'Không kết nối được dịch vụ ảnh bên ngoài; đã trả về ảnh xem trước cục bộ.';
      }
    }
  } else {
    try {
      const generated = await fetchFromPollinations(enhancedPrompt, width, height, model);
      imageDataUrl = generated.imageDataUrl;
      provider = generated.provider;
    } catch {
      try {
        const hordeGenerated = await fetchFromAiHorde(enhancedPrompt, aspectRatio);
        imageDataUrl = hordeGenerated.imageDataUrl;
        provider = hordeGenerated.provider;
      } catch (fallbackErr) {
        imageDataUrl = buildOfflinePreviewSvgDataUrl(rawPrompt, width, height, styleId, filterId);
        provider = 'local-svg-fallback';
        notice =
          fallbackErr instanceof Error
            ? `Các node AI miễn phí đang bận (${fallbackErr.message}); đã trả về ảnh xem trước cục bộ.`
            : 'Không kết nối được dịch vụ ảnh bên ngoài; đã trả về ảnh xem trước cục bộ.';
      }
    }
  }

  const { mediaId, ext } = storeMediaInCache(imageDataUrl);
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers.host || `localhost:${PORT}`;
  const hostedUrl = `${proto}://${host}/api/locket/media/${mediaId}.${ext}`;

  const detailTags = [
    hasFilter ? `[Filter: ${filterId}]` : '',
    hasSourceImage ? '[Img2Img]' : '',
    aspectRatio,
    rawPrompt ? rawPrompt.slice(0, 36) : '',
    originalUrl ? `from ${originalUrl.replace(/^https?:\/\//, '').slice(0, 42)}` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const latencyMs = Date.now() - startedAt;
  recordLog({
    method: req.method,
    path: endpointLabel,
    status: 200,
    latencyMs,
    provider,
    detail: detailTags,
  });

  const base64Only = imageDataUrl.includes(',') ? imageDataUrl.split(',')[1] : '';
  const responsePayload = {
    ok: true,
    provider,
    model,
    filter_id: hasFilter ? filterId : undefined,
    img2img: hasSourceImage,
    url: hostedUrl,
    imageUrl: hostedUrl,
    image_url: hostedUrl,
    width,
    height,
    aspectRatio,
    translated,
    promptUsed: rawPrompt || filterId,
    enhancedPrompt,
    imageDataUrl,
    image_data_url: imageDataUrl,
    imageBase64: base64Only,
    image: base64Only,
    notice: notice || undefined,
    latencyMs,
  };

  return res.status(200).json(
    isCallable
      ? { ...responsePayload, result: responsePayload }
      : responsePayload
  );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Allow cross-origin requests from proxy scripts / Locket tools
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Locket-Proxy');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Health & Server Status
  app.get('/api/locket/health', (req, res) => {
    const startedAt = Date.now();
    const uptimeSec = Math.floor((Date.now() - START_TIME) / 1000);
    const hasGeminiPromptTranslator = Boolean(getGeminiClient());
    const latencyMs = Date.now() - startedAt;

    recordLog({
      method: 'GET',
      path: '/api/locket/health',
      status: 200,
      latencyMs,
      provider: 'express-server',
      detail: 'Health check OK',
    });

    res.json({
      ok: true,
      service: 'Locket Free AI & Filter Server',
      freeTier: true,
      img2img: true,
      uptimeSec,
      providers: ['pollinations-flux', 'pollinations-turbo', 'ai-horde-img2img'],
      promptEnhancer: hasGeminiPromptTranslator ? 'gemini-4-hydrogen' : 'rule-based',
      endpoints: {
        generate: '/api/ai/generate',
        locketProxy: '/api/locket/ai-generate',
        mitmScript: '/scripts/locket_ai_redirect.js',
        forceGoldScript: '/scripts/forceGold4.3.js',
        media: '/api/locket/media/:id.jpg',
      },
    });
  });

  // Hosted binary image URLs for Locket iOS client
  app.get('/api/locket/media/:filename', (req, res) => {
    const id = req.params.filename.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
    const item = mediaCache.get(id);
    if (!item) {
      return res.status(404).json({ ok: false, error: 'Media expired or not found' });
    }
    res.setHeader('Content-Type', item.mime);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(item.buffer);
  });

  // Free AI Image & Filter Generation
  app.post('/api/ai/generate', async (req, res) => {
    await handleGenerateRequest(req, res, '/api/ai/generate');
  });

  // Locket-Compatible MITM Endpoint
  app.post('/api/locket/ai-generate', async (req, res) => {
    await handleGenerateRequest(req, res, '/api/locket/ai-generate');
  });

  // Patched forceGold4.3.js Remote Config script with AI filter flags enabled
  app.get('/scripts/forceGold4.3.js', (req, res) => {
    const startedAt = Date.now();
    const sourcePath = path.resolve(
      process.cwd(),
      'public/assets/aistudio/forceGold4.3_1321ffca.js'
    );
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).send('// forceGold4.3 source not found');
    }

    let scriptBody = fs.readFileSync(sourcePath, 'utf-8');
    const aiFilterPatch = `
if (typeof obj === "object" && obj && obj.entries && ua.includes("Locket")) {
    try {
        var fg = JSON.parse(obj.entries.feature_gates || "{}");
        fg.camera_filters = "enabled";
        fg.ai_filters = "enabled";
        fg.custom_filters = "enabled";
        fg.filters = "enabled";
        obj.entries.feature_gates = JSON.stringify(fg);
    } catch (e) {}
    try {
        var uf = JSON.parse(obj.entries.upsell_features || "{}");
        uf.camera_filters = true;
        uf.ai_filters = true;
        uf.custom_filters = true;
        uf.filters = true;
        obj.entries.upsell_features = JSON.stringify(uf);
    } catch (e) {}
    Object.assign(obj.entries, {
        ai_filters_enabled: "true",
        custom_filters_enabled: "true",
        filter_generation_enabled: "true",
        ai_camera_filters_enabled: "true",
        camera_filters_enabled: "true"
    });
}
$done({ body: JSON.stringify(obj) });`;

    scriptBody = scriptBody.replace(
      /\$done\(\{\s*body:\s*JSON\.stringify\(obj\)\s*\}\);?\s*$/,
      aiFilterPatch
    );

    recordLog({
      method: 'GET',
      path: '/scripts/forceGold4.3.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: 'Served patched forceGold4.3.js (AI Filters + Feature Gates enabled)',
    });

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.send(scriptBody);
  });

  // Dynamic MITM Redirect Script hosted directly by this server
  app.get('/scripts/locket_ai_redirect.js', (req, res) => {
    const startedAt = Date.now();
    const clientParam = String(req.query.client || 'shadowrocket').toLowerCase();
    const client: ProxyClient =
      clientParam === 'loon' || clientParam === 'surge' || clientParam === 'quantumultx'
        ? clientParam
        : 'shadowrocket';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const scriptBody = generateMitmRedirectScript(origin, client);

    recordLog({
      method: 'GET',
      path: '/scripts/locket_ai_redirect.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: `Served MITM Filter redirect script (${client})`,
    });

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(scriptBody);
  });

  // Optional non-blocking Traffic Probe script to inspect actual Locket iOS URLs
  app.get('/scripts/locket_traffic_probe.js', (req, res) => {
    const startedAt = Date.now();
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const scriptBody = generateTrafficProbeScript(origin);

    recordLog({
      method: 'GET',
      path: '/scripts/locket_traffic_probe.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: 'Served passive Traffic Probe script',
    });

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(scriptBody);
  });

  // Optional non-blocking Response Probe script to inspect getFilters / Filter API responses
  app.get('/scripts/locket_response_probe.js', (req, res) => {
    const startedAt = Date.now();
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const scriptBody = generateResponseProbeScript(origin);

    recordLog({
      method: 'GET',
      path: '/scripts/locket_response_probe.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: 'Served passive Response Probe script',
    });

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(scriptBody);
  });

  app.post('/api/locket/mitm-probe', (req, res) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const kind = String(body.kind || 'req');
    const method = String(body.method || (kind === 'res' ? 'RES' : 'POST'));
    const status = Number(body.status) || 200;
    const url = String(body.url || '').slice(0, 140);
    const keys = Array.isArray(body.keys) ? body.keys.join(', ') : '';
    const preview =
      kind === 'res' && body.bodyPreview
        ? String(body.bodyPreview).replace(/\s+/g, ' ').slice(0, 220)
        : '';

    recordLog({
      method,
      path: '/api/locket/mitm-probe',
      status,
      latencyMs: 1,
      provider: kind === 'res' ? 'response-probe' : 'traffic-probe',
      detail: [
        url,
        keys ? `keys: [${keys}]` : '',
        preview ? `body: ${preview}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
    });
    res.json({ ok: true });
  });

  // Live Shadowrocket / Loon / Surge Config hosted directly by this server
  app.get('/Locket.conf', (req, res) => {
    const startedAt = Date.now();
    const clientParam = String(req.query.client || 'shadowrocket').toLowerCase();
    const client: ProxyClient =
      clientParam === 'loon' || clientParam === 'surge' || clientParam === 'quantumultx'
        ? clientParam
        : 'shadowrocket';
    const usePatchedForceGold = req.query.patchedForceGold !== '0';
    const enableTrafficProbe = req.query.probe === '1';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const confBody = generateMergedLocketConf(origin, client, {
      includeYoutubeAdblock: true,
      includeGoldUnlock: true,
      usePatchedForceGold,
      enableTrafficProbe,
      aiScriptUrl: '',
    });

    recordLog({
      method: 'GET',
      path: '/Locket.conf',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'config-host',
      detail: `Served merged Locket.conf (${client}${enableTrafficProbe ? ' + probe' : ''})`,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(confBody);
  });

  // Real Request Logs
  app.get('/api/logs', (_req, res) => {
    res.json({
      ok: true,
      logs: requestLogs,
      total: requestLogs.length,
    });
  });

  app.delete('/api/logs', (_req, res) => {
    requestLogs.length = 0;
    res.json({ ok: true, logs: [], total: 0 });
  });

  // Download full deployable source code ZIP for Render / Railway / Koyeb
  app.get('/api/download-project', (req, res) => {
    const startedAt = Date.now();
    const rootDir = process.cwd();
    const zipEntries: ZipEntryInput[] = [];

    const rootFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'index.html',
      'metadata.json',
      '.env.example',
      '.gitignore',
      'server.ts',
    ];

    for (const relPath of rootFiles) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        zipEntries.push({ name: relPath, data: fs.readFileSync(fullPath) });
      }
    }

    const walkDir = (relDir: string) => {
      const absDir = path.join(rootDir, relDir);
      if (!fs.existsSync(absDir)) return;
      for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
        const childRel = path.posix.join(relDir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
            continue;
          }
          walkDir(childRel);
        } else if (entry.isFile()) {
          zipEntries.push({
            name: childRel,
            data: fs.readFileSync(path.join(rootDir, childRel)),
          });
        }
      }
    };

    walkDir('src');
    walkDir('public');

    const readmeContent = `# Locket Free AI & Filter Server

## Deploy miễn phí trên Render.com (0đ)
- Build Command: \`npm install --include=dev --legacy-peer-deps && npm run build\`
- Start Command: \`npx tsx server.ts\`
- Environment Variable: \`NODE_ENV=production\`

## Endpoints sau khi Deploy
- \`/Locket.conf?client=shadowrocket\` — File cấu hình gộp cho Shadowrocket
- \`/scripts/forceGold4.3.js\` — Remote Config đã bật AI Filter
- \`/scripts/locket_ai_redirect.js\` — Script MITM chuyển hướng Filter/AI
- \`/api/locket/ai-generate\` — API xử lý tạo ảnh AI & Img2Img Filter
- \`/api/locket/health\` — Kiểm tra trạng thái server
`;
    zipEntries.push({ name: 'README.md', data: Buffer.from(readmeContent, 'utf8') });

    const zipBuffer = buildStoreZip(zipEntries);
    recordLog({
      method: req.method,
      path: '/api/download-project',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'archive-host',
      detail: `Exported ${zipEntries.length} files (${Math.round(zipBuffer.length / 1024)} KB)`,
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="locket-ai-server.zip"');
    res.setHeader('Content-Length', String(zipBuffer.length));
    return res.send(zipBuffer);
  });

  // Vite middleware in development; static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Locket AI Server Studio listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
