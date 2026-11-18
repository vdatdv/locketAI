import 'dotenv/config';
import crypto from 'node:crypto';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildEnhancedPrompt,
  extractLocketGenerateParams,
  generateDirectFilterScript,
  generateFilterUnlockScript,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  generateMomentAiFilterScript,
  generateResponseProbeScript,
  generateStandaloneServerCode,
  generateTrafficProbeScript,
  getDimensionsForAspectRatio,
  patchForceGoldScript,
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

  const deadline = Date.now() + 18000;
  let polls = 0;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    polls += 1;
    const checkRes = await fetch(
      `https://aihorde.net/api/v2/generate/check/${submitData.id}`,
      { headers: { 'Client-Agent': 'LocketFreeAIServer:1.0:web' } }
    );
    if (!checkRes.ok) continue;
    const checkData = (await checkRes.json()) as {
      done?: boolean;
      faulted?: boolean;
      wait_time?: number;
    };
    if (checkData.faulted) {
      throw new Error('AI Horde job faulted');
    }
    if (polls >= 2 && typeof checkData.wait_time === 'number' && checkData.wait_time > 35) {
      throw new Error(`AI Horde queue ${checkData.wait_time}s`);
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

async function fetchFromPollinationsWithRetry(
  enhancedPrompt: string,
  width: number,
  height: number,
  model: FreeAiModel
): Promise<{ imageDataUrl: string; provider: string }> {
  try {
    return await fetchFromPollinations(enhancedPrompt, width, height, model);
  } catch (firstErr) {
    if (model !== 'turbo') {
      return await fetchFromPollinations(enhancedPrompt, width, height, 'turbo');
    }
    throw firstErr;
  }
}

async function fetchRemoteImageAsBase64(imageUrl: string): Promise<string> {
  if (!/^https?:\/\//i.test(imageUrl)) return '';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LocketFreeAIServer/1.0' },
    });
    if (!res.ok) return '';
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 128 || buf.byteLength > 10 * 1024 * 1024) return '';
    return buf.toString('base64');
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

async function handleGenerateRequest(
  req: Request,
  res: Response,
  endpointLabel: string,
  options: { rawImageResponse?: boolean; locketInAppMode?: boolean } = {}
) {
  const { rawImageResponse = false, locketInAppMode = false } = options;
  const startedAt = Date.now();
  const extracted = extractLocketGenerateParams(req.body);
  let filterId = extracted.filterId;
  let rawPrompt = extracted.prompt;
  const { styleId, aspectRatio, model, originalUrl, bodyKeys } = extracted;
  let sourceBase64 = extracted.imageBase64;
  if (!sourceBase64 && extracted.imageUrl) {
    sourceBase64 = await fetchRemoteImageAsBase64(extracted.imageUrl);
  }

  let hasFilter = Boolean(filterId && filterId !== 'none');
  if (!rawPrompt && !hasFilter) {
    if (locketInAppMode) {
      if (sourceBase64) {
        rawPrompt = 'aesthetic portrait enhancement';
      } else {
        filterId = 'flower_crown';
        hasFilter = true;
      }
    } else {
      const latencyMs = Date.now() - startedAt;
      recordLog({
        method: req.method,
        path: endpointLabel,
        status: 400,
        latencyMs,
        provider: 'validation',
        detail: [
          'Empty prompt/filter_id',
          originalUrl ? `from ${originalUrl.replace(/^https?:\/\//, '').slice(0, 70)}` : '',
          bodyKeys.length ? `keys: [${bodyKeys.join(', ')}]` : '',
        ]
          .filter(Boolean)
          .join(' · '),
      });
      return res.status(400).json({
        ok: false,
        error: 'Vui lòng nhập mô tả ảnh (prompt) hoặc chọn một Filter Locket.',
      });
    }
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
        const generated = await fetchFromPollinationsWithRetry(enhancedPrompt, width, height, model);
        imageDataUrl = generated.imageDataUrl;
        provider = generated.provider;
        notice = 'Node Img2Img miễn phí đang quá tải; đã tạo ảnh AI theo mô tả filter.';
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
      const generated = await fetchFromPollinationsWithRetry(enhancedPrompt, width, height, model);
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

  if (rawImageResponse) {
    const cached = mediaCache.get(mediaId);
    if (cached) {
      res.setHeader('Content-Type', cached.mime);
      res.setHeader('X-Locket-Provider', provider);
      return res.status(200).send(cached.buffer);
    }
  }

  const base64Only = imageDataUrl.includes(',') ? imageDataUrl.split(',')[1] : '';
  const dataNode = {
    status: 200,
    outputUrl: hostedUrl,
    output_url: hostedUrl,
    url: hostedUrl,
    imageUrl: hostedUrl,
    image_url: hostedUrl,
  };
  const responsePayload = {
    ok: true,
    status: 200,
    provider,
    model,
    filter_id: hasFilter ? filterId : undefined,
    img2img: hasSourceImage,
    outputUrl: hostedUrl,
    output_url: hostedUrl,
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
    data: dataNode,
  };

  return res.status(200).json(
    extracted.isCallable || locketInAppMode
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
        generateFilteredImage: '/generateFilteredImage',
        momentAiFilter: '/api/locket/moment-ai-filter',
        locketProxy: '/api/locket/ai-generate',
        mitmScript: '/scripts/locket_ai_redirect.js',
        momentAiScript: '/scripts/locket_ai_moment.js',
        filterUnlockScript: '/scripts/locket_filter_unlock.js',
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

  // Free AI Image & Filter Generation (Web Studio UI)
  app.post('/api/ai/generate', async (req, res) => {
    await handleGenerateRequest(req, res, '/api/ai/generate', { rawImageResponse: false });
  });

  // Direct In-App Locket Filter & Photobooth Endpoint (intercepted from generateFilteredImage)
  app.post(['/generateFilteredImage', '/v1/generateFilteredImage'], async (req, res) => {
    await handleGenerateRequest(req, res, '/generateFilteredImage', {
      rawImageResponse: false,
      locketInAppMode: true,
    });
  });

  // Locket-Compatible MITM Endpoint
  app.post('/api/locket/ai-generate', async (req, res) => {
    await handleGenerateRequest(req, res, '/api/locket/ai-generate', {
      rawImageResponse: false,
      locketInAppMode: true,
    });
  });

  // Direct binary image endpoint for Apple Shortcuts (Phím tắt iOS) -> Save to Photos -> Post on Locket
  app.post('/api/locket/ai-generate-image', async (req, res) => {
    await handleGenerateRequest(req, res, '/api/locket/ai-generate-image', {
      rawImageResponse: true,
    });
  });

  // Caption-Triggered Moment AI Filter Override (intercepted from postMomentV2)
  app.post('/api/locket/moment-ai-filter', async (req, res) => {
    const startedAt = Date.now();
    try {
      const wrapper = (req.body || {}) as {
        originalUrl?: string;
        headers?: Record<string, string>;
        payload?: Record<string, unknown>;
      };
      const rawPayload = (wrapper.payload && typeof wrapper.payload === 'object'
        ? wrapper.payload
        : req.body) as Record<string, unknown>;
      const fwdHeaders = wrapper.headers || {};

      const isCallable = Boolean(rawPayload.data && typeof rawPayload.data === 'object');
      const inner = (isCallable
        ? { ...(rawPayload.data as Record<string, unknown>) }
        : { ...rawPayload }) as Record<string, unknown>;

      let filterId = '';
      const overlays = Array.isArray(inner.overlays) ? (inner.overlays as Array<Record<string, unknown>>) : [];
      for (const ov of overlays) {
        const oid = String((ov && (ov.overlay_id || ov.id)) || '');
        if (oid.startsWith('caption:ai_filter_')) {
          filterId = oid.slice('caption:ai_filter_'.length).trim();
          break;
        }
      }

      const origCaption = String(inner.caption || '').trim();
      let customPrompt = '';
      if (/^#ai\b|^\/ai\b|^ai:/i.test(origCaption)) {
        customPrompt = origCaption.replace(/^(#ai|\/ai|ai:)\s*/i, '').trim();
        inner.caption = customPrompt;
      } else if (filterId && origCaption.startsWith('AI · ')) {
        inner.caption = origCaption.replace(/^AI ·\s*/, '').trim();
      }

      const sourceUrl = String(
        inner.thumbnail_url || inner.image_url || inner.photo_url || inner.media_url || ''
      ).trim();

      if (!filterId && !customPrompt) {
        return res.json({ ok: false, skipped: true });
      }

      const { prompt: translatedPrompt } = await translatePromptIfNeeded(customPrompt);
      const enhancedPrompt = buildEnhancedPrompt(customPrompt, 'natural', translatedPrompt, filterId || undefined);
      const sourceBase64 = sourceUrl ? await fetchRemoteImageAsBase64(sourceUrl) : '';

      let imageDataUrl = '';
      let provider = '';
      if (sourceBase64.length > 32) {
        try {
          const hordeRes = await fetchFromAiHorde(enhancedPrompt, '3:4', sourceBase64);
          imageDataUrl = hordeRes.imageDataUrl;
          provider = hordeRes.provider;
        } catch {
          const fallbackRes = await fetchFromPollinationsWithRetry(enhancedPrompt, 768, 1024, 'flux');
          imageDataUrl = fallbackRes.imageDataUrl;
          provider = fallbackRes.provider;
        }
      } else {
        const genRes = await fetchFromPollinationsWithRetry(enhancedPrompt, 768, 1024, 'flux');
        imageDataUrl = genRes.imageDataUrl;
        provider = genRes.provider;
      }

      const { mediaId, ext } = storeMediaInCache(imageDataUrl);
      const cached = mediaCache.get(mediaId);
      const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers.host || `localhost:${PORT}`;
      let finalImageUrl = `${proto}://${host}/api/locket/media/${mediaId}.${ext}`;
      let storageUploaded = false;
      let storageStatus = 'skipped';

      const authHeader = fwdHeaders['Authorization'] || fwdHeaders['authorization'] || '';
      const appCheckHeader = fwdHeaders['X-Firebase-AppCheck'] || fwdHeaders['x-firebase-appcheck'] || '';
      const uidMatch = sourceUrl.match(/users(?:%2F|\/)([A-Za-z0-9_-]+)/);
      const uid = uidMatch ? uidMatch[1] : '';

      if (cached && authHeader && uid) {
        try {
          const objectPath = `users/${uid}/moments/ai_${Date.now()}.${ext}`;
          const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/locket-img/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;
          const upHeaders: Record<string, string> = {
            Authorization: authHeader,
            'Content-Type': cached.mime,
          };
          if (appCheckHeader) {
            upHeaders['X-Firebase-AppCheck'] = appCheckHeader;
          }
          const upRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: upHeaders,
            body: new Uint8Array(cached.buffer),
          });
          storageStatus = `HTTP ${upRes.status}`;
          if (upRes.ok) {
            const upJson = (await upRes.json()) as { name?: string; downloadTokens?: string };
            if (upJson.name && upJson.downloadTokens) {
              const token = upJson.downloadTokens.split(',')[0].trim();
              const useCdnHost = sourceUrl.includes('cdn.locketcamera.com')
                ? 'cdn.locketcamera.com'
                : 'firebasestorage.googleapis.com';
              finalImageUrl = `https://${useCdnHost}/v0/b/locket-img/o/${encodeURIComponent(upJson.name)}?alt=media&token=${token}`;
              storageUploaded = true;
            }
          }
        } catch (upErr) {
          storageStatus = upErr instanceof Error ? upErr.message : 'upload_error';
        }
      }

      if (inner.thumbnail_url) inner.thumbnail_url = finalImageUrl;
      if (inner.image_url) inner.image_url = finalImageUrl;
      if (inner.md5 && cached) {
        inner.md5 = crypto.createHash('md5').update(cached.buffer).digest('hex');
      }

      const updatedPayload = isCallable ? { ...rawPayload, data: inner } : inner;
      const latencyMs = Date.now() - startedAt;
      recordLog({
        method: 'POST',
        path: '/api/locket/moment-ai-filter',
        status: 200,
        latencyMs,
        provider,
        detail: [
          filterId ? `[CaptionAI: ${filterId}]` : '[CaptionAI: #ai]',
          sourceBase64 ? '[Img2Img]' : '[Txt2Img]',
          `FirebaseStorage: ${storageUploaded ? 'OK' : storageStatus}`,
        ].join(' · '),
      });

      return res.json({
        ok: true,
        provider,
        storageUploaded,
        storageStatus,
        outputUrl: finalImageUrl,
        payload: updatedPayload,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'moment-ai-filter error';
      recordLog({
        method: 'POST',
        path: '/api/locket/moment-ai-filter',
        status: 500,
        latencyMs: Date.now() - startedAt,
        provider: 'error',
        detail: msg,
      });
      return res.status(500).json({ ok: false, error: msg });
    }
  });

  // Clean self-hosted Locket Filter & Account Unlocker
  app.get('/scripts/locket_filter_unlock.js', (req, res) => {
    const startedAt = Date.now();
    const scriptBody = generateFilterUnlockScript();
    recordLog({
      method: 'GET',
      path: '/scripts/locket_filter_unlock.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: 'Served clean Locket Filter & Gold Account Unlock script',
    });
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.send(scriptBody);
  });

  // Self-hosted RevenueCat Gold script & header script
  app.get('/scripts/locketfix8.js', (_req, res) => {
    const filePath = path.resolve(process.cwd(), 'public/assets/aistudio/locketfix8_5e38e8cf.js');
    if (!fs.existsSync(filePath)) return res.status(404).send('// locketfix8.js not found');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.send(fs.readFileSync(filePath, 'utf-8'));
  });

  app.get('/scripts/header7.js', (_req, res) => {
    const filePath = path.resolve(process.cwd(), 'public/assets/aistudio/header7_8b57ec54.js');
    if (!fs.existsSync(filePath)) return res.status(404).send('// header7.js not found');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.send(fs.readFileSync(filePath, 'utf-8'));
  });

  function getPatchedForceGoldBody(): string | null {
    const sourcePath = path.resolve(
      process.cwd(),
      'public/assets/aistudio/forceGold4.3_1321ffca.js'
    );
    if (!fs.existsSync(sourcePath)) {
      return null;
    }
    const rawSource = fs.readFileSync(sourcePath, 'utf-8');
    return patchForceGoldScript(rawSource);
  }

  // Patched forceGold4.3.js Remote Config script with AI filter flags enabled
  app.get('/scripts/forceGold4.3.js', (_req, res) => {
    const startedAt = Date.now();
    const scriptBody = getPatchedForceGoldBody();
    if (!scriptBody) {
      return res.status(404).send('// forceGold4.3 source not found');
    }

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

  // 100% No-Server Direct Filter AI Script (for pure GitHub Raw hosting)
  app.get('/scripts/locket_ai_direct.js', (_req, res) => {
    const startedAt = Date.now();
    const scriptBody = generateDirectFilterScript();
    recordLog({
      method: 'GET',
      path: '/scripts/locket_ai_direct.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: 'Served 0-server Direct Filter AI script (AI Horde Img2Img + Pollinations)',
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

  // Caption AI Filter Override Script (postMomentV2 Img2Img interception)
  app.get('/scripts/locket_ai_moment.js', (req, res) => {
    const startedAt = Date.now();
    const clientParam = String(req.query.client || 'shadowrocket').toLowerCase();
    const client: ProxyClient =
      clientParam === 'loon' || clientParam === 'surge' || clientParam === 'quantumultx'
        ? clientParam
        : 'shadowrocket';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const scriptBody = generateMomentAiFilterScript(origin, client);

    recordLog({
      method: 'GET',
      path: '/scripts/locket_ai_moment.js',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'script-host',
      detail: `Served Caption AI Moment override script (${client})`,
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
    const directNoServer = req.query.direct === '1';
    const scriptBaseUrl = typeof req.query.rawBase === 'string' ? req.query.rawBase : '';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const origin = `${proto}://${host}`;
    const confBody = generateMergedLocketConf(origin, client, {
      includeGoldUnlock: true,
      usePatchedForceGold,
      enableTrafficProbe,
      directNoServer,
      scriptBaseUrl,
      aiScriptUrl: '',
    });

    recordLog({
      method: 'GET',
      path: '/Locket.conf',
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: 'config-host',
      detail: `Served Locket.conf (${client}${directNoServer ? ' · direct-0-server' : ''}${enableTrafficProbe ? ' + probe' : ''})`,
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
          if (childRel.startsWith('public/assets/aistudio/')) {
            const allowedAssets = new Set([
              'forceGold4.3_1321ffca.js',
              'locketfix8_5e38e8cf.js',
              'header7_8b57ec54.js',
            ]);
            if (!allowedAssets.has(entry.name)) {
              continue;
            }
          }
          zipEntries.push({
            name: childRel,
            data: fs.readFileSync(path.join(rootDir, childRel)),
          });
        }
      }
    };

    walkDir('src');
    walkDir('public');

    // Bundle ready-to-push GitHub Raw files + Cloudflare Worker (no web UI needed)
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'locketai.onrender.com';
    const currentOrigin = `${proto}://${host}`;
    const gitRawScriptsPlaceholder = 'https://raw.githubusercontent.com/vdatdv/locketAI/main/github-raw/scripts';

    const readAsset = (name: string) => {
      const p = path.join(rootDir, 'public/assets/aistudio', name);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : '';
    };
    const patchedForceGold = getPatchedForceGoldBody() || readAsset('forceGold4.3_1321ffca.js');
    zipEntries.push(
      {
        name: 'github-raw/Locket_Direct_GitRaw.conf',
        data: Buffer.from(
          generateMergedLocketConf(currentOrigin, 'shadowrocket', {
            includeGoldUnlock: true,
            usePatchedForceGold: true,
            enableTrafficProbe: false,
            directNoServer: true,
            scriptBaseUrl: gitRawScriptsPlaceholder,
            aiScriptUrl: '',
          }),
          'utf8'
        ),
      },
      {
        name: 'github-raw/Locket_Backend_GitRaw.conf',
        data: Buffer.from(
          generateMergedLocketConf(currentOrigin, 'shadowrocket', {
            includeGoldUnlock: true,
            usePatchedForceGold: true,
            enableTrafficProbe: false,
            directNoServer: false,
            scriptBaseUrl: gitRawScriptsPlaceholder,
            aiScriptUrl: '',
          }),
          'utf8'
        ),
      },
      { name: 'github-raw/scripts/locketfix8.js', data: Buffer.from(readAsset('locketfix8_5e38e8cf.js'), 'utf8') },
      { name: 'github-raw/scripts/header7.js', data: Buffer.from(readAsset('header7_8b57ec54.js'), 'utf8') },
      { name: 'github-raw/scripts/forceGold4.3.js', data: Buffer.from(patchedForceGold, 'utf8') },
      { name: 'github-raw/scripts/locket_filter_unlock.js', data: Buffer.from(generateFilterUnlockScript(), 'utf8') },
      { name: 'github-raw/scripts/locket_ai_direct.js', data: Buffer.from(generateDirectFilterScript(), 'utf8') },
      { name: 'github-raw/scripts/locket_ai_redirect.js', data: Buffer.from(generateMitmRedirectScript(currentOrigin, 'shadowrocket'), 'utf8') },
      { name: 'github-raw/scripts/locket_ai_moment.js', data: Buffer.from(generateMomentAiFilterScript(currentOrigin, 'shadowrocket'), 'utf8') },
      { name: 'cloudflare-worker/worker.js', data: Buffer.from(generateStandaloneServerCode('worker'), 'utf8') }
    );

    const readmeContent = `# Locket In-App AI Filter (Thuần Locket · Hỗ trợ 100% GitHub Raw)

## Cách 1: Dùng 100% file Raw trên GitHub (Không cần Render, không cần Web)
1. Đẩy thư mục \`github-raw/\` lên repo GitHub của bạn (ví dụ \`vdatdv/locketAI\`).
2. Trong Shadowrocket -> Config -> bấm **+** -> dán link Raw của \`github-raw/Locket_Direct_GitRaw.conf\` -> **Use Config**.
3. Trong \`Locket_Direct_GitRaw.conf\`, toàn bộ script (kể cả \`locket_ai_direct.js\` tự gọi AI Horde Img2Img & Pollinations) đều lấy từ GitHub Raw!

## Cách 2: GitHub Raw + API ngầm Img2Img (Render hoặc Cloudflare Worker 0đ)
- \`cloudflare-worker/worker.js\`: Dán 1 file lên Cloudflare Workers (0đ, không bị sleep, không giao diện web).
- Hoặc deploy repo này lên Render.com (Build: \`npm install --include=dev && npm run build\`, Start: \`npx tsx server.ts\`) và dùng \`github-raw/Locket_Backend_GitRaw.conf\`.
`;
    zipEntries.push({ name: '.npmrc', data: Buffer.from('legacy-peer-deps=true\n', 'utf8') });
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
