import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {
  buildEnhancedPrompt,
  DEFAULT_SHADOWROCKET_AI_PATTERN,
  extractLocketGenerateParams,
  generateDirectFilterScript,
  generateFilterUnlockScript,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  generateMomentAiFilterScript,
  generateStandaloneServerCode,
  generateTrafficProbeScript,
  getDimensionsForAspectRatio,
  isValidServerUrl,
  LOCKET_CAPTIONS,
  LOCKET_FILTERS,
  LOCKET_FILTER_UNLOCK_PATTERN,
  LOCKET_MOMENT_AI_PATTERN,
  mapFilterIdToPrompt,
  normalizeFilterId,
  normalizeGitRawScriptsUrl,
  normalizeServerUrl,
  patchForceGoldScript,
} from './locketConfig';

test('getDimensionsForAspectRatio returns expected dimensions', () => {
  assert.deepEqual(getDimensionsForAspectRatio('1:1'), { width: 1024, height: 1024 });
  assert.deepEqual(getDimensionsForAspectRatio('3:4'), { width: 768, height: 1024 });
  assert.deepEqual(getDimensionsForAspectRatio('9:16'), { width: 720, height: 1280 });
});

test('normalizeFilterId and mapFilterIdToPrompt resolve Locket filters, sticker aliases, and photobooth IDs', () => {
  assert.equal(normalizeFilterId('stk_dio_flower_crown'), 'flower_crown');
  assert.equal(normalizeFilterId('stk_dio_bleached_hair'), 'blonde_bleached');
  assert.equal(normalizeFilterId('photobooth_4cut'), 'photobooth');
  assert.equal(normalizeFilterId('stk_harry_potter'), 'harry_potter');

  const crown = mapFilterIdToPrompt('stk_dio_flower_crown');
  assert.ok(crown.includes('flower crown'));
  const pb = mapFilterIdToPrompt('pb_strawberry');
  assert.ok(pb.includes('strawberry photobooth'));
  const combined = mapFilterIdToPrompt('disco_lights', 'girl smiling');
  assert.ok(combined.startsWith('girl smiling,'));
  assert.ok(combined.includes('disco ball'));
  const customOnly = mapFilterIdToPrompt('none', 'cute cat');
  assert.equal(customOnly, 'cute cat');
});

test('extractLocketGenerateParams extracts filter_id, sticker_id, image_url, image_base64, and nested callable data', () => {
  const fromCallable = extractLocketGenerateParams({
    data: {
      sticker_id: 'stk_dio_princess',
      image_url: 'https://cdn.locketcamera.com/selfie.jpg',
      aspect_ratio: '3:4',
    },
  });
  assert.equal(fromCallable.isCallable, true);
  assert.equal(fromCallable.filterId, 'princess');
  assert.equal(fromCallable.imageUrl, 'https://cdn.locketcamera.com/selfie.jpg');
  assert.equal(fromCallable.aspectRatio, '3:4');

  const fromBase64 = extractLocketGenerateParams({
    filter: 'pb_vintage',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  });
  assert.equal(fromBase64.filterId, 'pb_vintage');
  assert.ok(fromBase64.imageBase64.startsWith('data:image/jpeg;base64,'));
});

test('buildEnhancedPrompt appends style suffix and filter instruction', () => {
  assert.equal(buildEnhancedPrompt('   ', 'ghibli'), '');
  const prompt = buildEnhancedPrompt('chú mèo đáng yêu', 'ghibli', 'cute little cat', 'princess');
  assert.ok(prompt.startsWith('cute little cat,'));
  assert.ok(prompt.includes('tiara crown'));
  assert.ok(prompt.includes('Ghibli'));
});

test('DEFAULT_SHADOWROCKET_AI_PATTERN matches generateFilteredImage & filter endpoints while excluding getFilters/moments', () => {
  const regex = new RegExp(DEFAULT_SHADOWROCKET_AI_PATTERN.replace(/\\\//g, '/'));
  assert.equal(
    regex.test('https://api.locketcamera.com/generateFilteredImage'),
    true
  );
  assert.equal(
    regex.test('https://us-central1-locket-4252a.cloudfunctions.net/generateFilteredImage'),
    true
  );
  assert.equal(
    regex.test('https://us-central1-locket-4252a.cloudfunctions.net/applyFilter'),
    true
  );
  assert.equal(
    regex.test('https://generatefilteredimage-abc123-uc.a.run.app/'),
    true
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/v1/photobooth'),
    true
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/getFilters'),
    false
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/setClientData'),
    false
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/getAccountDetails'),
    false
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/getGroupMessages'),
    false
  );
  assert.equal(
    regex.test('https://analytics.locketcamera.com/2/httpapi'),
    false
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/postMomentV2'),
    false
  );
});

test('LOCKET_FILTER_UNLOCK_PATTERN covers api.locketcamera.com and cloudfunctions.net except generateFilteredImage', () => {
  const regex = new RegExp(LOCKET_FILTER_UNLOCK_PATTERN.replace(/\\\//g, '/'));
  assert.equal(regex.test('https://api.locketcamera.com/getFilters'), true);
  assert.equal(regex.test('https://us-central1-locket-4252a.cloudfunctions.net/getFilters'), true);
  assert.equal(regex.test('https://api.locketcamera.com/fetchUser'), true);
  assert.equal(regex.test('https://api.locketcamera.com/changeProfileInfo'), true);
  assert.equal(regex.test('https://api.locketcamera.com/generateFilteredImage'), false);
});

test('URL validation and normalization', () => {
  assert.equal(normalizeServerUrl('https://example.com/// '), 'https://example.com');
  assert.equal(isValidServerUrl('https://my-server.onrender.com'), true);
  assert.equal(isValidServerUrl('http://localhost:3000'), true);
  assert.equal(isValidServerUrl('ftp://bad-protocol.com'), false);
  assert.equal(isValidServerUrl('not a url'), false);
});

test('generateFilterUnlockScript unlocks user permissions & strips locks with zero external tracking', () => {
  const script = generateFilterUnlockScript();
  assert.equal(script.includes('workers.dev'), false);
  assert.equal(script.includes('mhiep20077'), false);

  let doneRes: { status?: number; body?: string } | undefined;
  vm.runInNewContext(script, {
    $request: { url: 'https://api.locketcamera.com/fetchUser', headers: {} },
    $response: {
      status: 403,
      headers: { 'Content-Encoding': 'gzip' },
      body: JSON.stringify({
        result: {
          data: {
            email: 'user@example.com',
            is_locked: true,
            requires_gold: true,
            can_use_filters: false,
          },
        },
      }),
    },
    $done: (out: { status?: number; body?: string }) => {
      doneRes = out;
    },
  });

  if (!doneRes) assert.fail('Expected $done to be called');
  const resolvedRes: { status?: number; body?: string } = doneRes;
  assert.equal(resolvedRes.status, 200);
  const parsed = JSON.parse(resolvedRes.body || '{}');
  assert.equal(parsed.result.data.is_gold, true);
  assert.equal(parsed.result.data.can_use_filters, true);
  assert.equal(parsed.result.data.can_generate_filtered_image, true);
  assert.equal(parsed.result.data.is_locked, false);
  assert.equal(parsed.result.data.requires_gold, false);
  assert.equal(parsed.result.data.remaining_filters, 999);

  let okRes: { status?: number; body?: string } | undefined;
  vm.runInNewContext(script, {
    $request: { url: 'https://api.locketcamera.com/getAccount', headers: {} },
    $response: {
      status: 200,
      headers: { ':status': '200', 'content-type': 'application/json' },
      body: JSON.stringify({ result: { data: { email: 'user@example.com', can_use_filters: false } } }),
    },
    $done: (out: { status?: number; body?: string }) => {
      okRes = out;
    },
  });
  assert.ok(okRes?.body);
  assert.equal(okRes?.status, undefined);

  let getFiltersRes: { body?: string } | undefined;
  vm.runInNewContext(script, {
    $request: { url: 'https://api.locketcamera.com/getFilters', headers: {} },
    $response: {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ result: { data: { filters: [], friend_filters: [] }, status: 200 } }),
    },
    $done: (out: { body?: string }) => {
      getFiltersRes = out;
    },
  });
  const parsedFilters = JSON.parse(getFiltersRes?.body || '{}');
  assert.ok(Array.isArray(parsedFilters.result.data.filters));
  assert.ok(parsedFilters.result.data.filters.length >= 25);
  assert.ok(parsedFilters.result.data.filters.some((f: { id?: string }) => f.id === 'flower_crown'));
  assert.ok(parsedFilters.result.data.filters.some((f: { id?: string }) => f.id === 'photobooth'));
  assert.equal(parsedFilters.result.data.can_use_filters, true);
  assert.equal(parsedFilters.result.data.can_use_photobooth, true);
});

test('generateMitmRedirectScript forwards generateFilteredImage via $httpClient.post and returns clean 200 response', () => {
  const srScript = generateMitmRedirectScript('https://free-ai.onrender.com/', 'shadowrocket');
  assert.ok(srScript.includes('https://free-ai.onrender.com/generateFilteredImage'));
  assert.equal(srScript.includes('locket-mod-backend.onrender.com'), false);

  let forwardedUrl = '';
  let forwardedHost = '';
  let reqDone: { response?: { status?: number; body?: string } } | undefined;
  vm.runInNewContext(srScript, {
    $request: {
      url: 'https://api.locketcamera.com/generateFilteredImage?v=2',
      headers: { Host: 'api.locketcamera.com', Authorization: 'Bearer abc' },
      body: '{"data":{"filter_id":"flower_crown"}}',
    },
    $httpClient: {
      post: (
        opts: { url: string; headers: Record<string, string>; body: string },
        cb: (err: unknown, resp: unknown, data: string) => void
      ) => {
        forwardedUrl = opts.url;
        forwardedHost = opts.headers.Host;
        cb(null, { status: 200 }, JSON.stringify({ ok: true, error: 'ignore', result: { outputUrl: 'https://cdn/out.jpg' } }));
      },
    },
    $done: (out: { response?: { status?: number; body?: string } }) => {
      reqDone = out;
    },
  });
  assert.equal(forwardedUrl, 'https://free-ai.onrender.com/generateFilteredImage?v=2');
  assert.equal(forwardedHost, 'free-ai.onrender.com');
  if (!reqDone || !reqDone.response) assert.fail('Expected $done({ response }) to be called');
  assert.equal(reqDone.response.status, 200);
  const parsedOut = JSON.parse(reqDone.response.body || '{}');
  assert.equal(parsedOut.error, undefined);
  assert.equal(parsedOut.result.outputUrl, 'https://cdn/out.jpg');
});

test('generateMergedLocketConf includes Gold, filter unlock, generateFilteredImage hooks, and strictly excludes non-Locket clutter', () => {
  const conf = generateMergedLocketConf('https://free-ai.onrender.com', 'shadowrocket', {
    includeGoldUnlock: true,
    usePatchedForceGold: true,
    enableTrafficProbe: true,
    aiScriptUrl: '',
    aiPattern: DEFAULT_SHADOWROCKET_AI_PATTERN,
  });
  assert.ok(conf.includes('locketfix8.js'));
  assert.ok(conf.includes('header7.js'));
  assert.ok(conf.includes('https://free-ai.onrender.com/scripts/forceGold4.3.js'));
  assert.ok(conf.includes('locket_rc_req = type=http-request'));
  assert.ok(conf.includes('locket_filter_unlock_req = type=http-request'));
  assert.ok(conf.includes('locket_filter_unlock_res = type=http-response'));
  assert.ok(conf.includes('locket_ai_filter_req = type=http-request'));
  assert.ok(conf.includes('locket_ai_moment_req = type=http-request'));
  assert.ok(conf.includes('locket_probe = type=http-request'));
  assert.ok(conf.includes('locket_probe_res = type=http-response'));
  assert.ok(conf.includes('-analytics.locketcamera.com'));
  assert.ok(conf.includes('-cdn.locketcamera.com'));
  assert.ok(conf.includes('*.a.run.app'));
  assert.ok(conf.includes('us-central1-locket-4252a.cloudfunctions.net'));
  assert.equal(/youtube|googlevideo|hostsvn|phl|phamlong/i.test(conf), false);
});

test('generateStandaloneServerCode includes filter prompts and img2img support', () => {
  const vercelCode = generateStandaloneServerCode('vercel');
  assert.ok(vercelCode.includes('FILTER_PROMPTS'));
  assert.ok(vercelCode.includes('export default async function handler'));

  const renderCode = generateStandaloneServerCode('render');
  assert.ok(renderCode.includes('source_image'));
  assert.ok(renderCode.includes('FILTER_PROMPTS'));
});

test('LOCKET_CAPTIONS and LOCKET_FILTERS include forceGold4.3 and Photobooth presets', () => {
  assert.ok(LOCKET_CAPTIONS.some((c) => c.id === 'caption:em_nho_anhh'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'okay_wig'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'flower_crown'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'photobooth'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'pb_strawberry'));
});

test('normalizeGitRawScriptsUrl converts GitHub repo URL to raw.githubusercontent.com path', () => {
  assert.equal(
    normalizeGitRawScriptsUrl('https://github.com/vdatdv/locketAI'),
    'https://raw.githubusercontent.com/vdatdv/locketAI/main/github-raw/scripts'
  );
  assert.equal(
    normalizeGitRawScriptsUrl('https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts/'),
    'https://raw.githubusercontent.com/vdatdv/LocketGold/main/scripts'
  );
});

test('generateDirectFilterScript returns Locket outputUrl JSON without backend server', () => {
  const directScript = generateDirectFilterScript();
  let doneOut: { response?: { status?: number; body?: string } } | undefined;

  vm.runInNewContext(directScript, {
    $request: {
      url: 'https://api.locketcamera.com/generateFilteredImage',
      body: JSON.stringify({ data: { filter_id: 'stk_dio_flower_crown', prompt: 'selfie' } }),
    },
    $done: (out: { response?: { status?: number; body?: string } }) => {
      doneOut = out;
    },
  });

  if (!doneOut || !doneOut.response) assert.fail('Expected $done({ response })');
  assert.equal(doneOut.response.status, 200);
  const parsed = JSON.parse(doneOut.response.body || '{}');
  assert.equal(parsed.filter_id, 'flower_crown');
  assert.ok(parsed.result.outputUrl.startsWith('https://image.pollinations.ai/prompt/'));
  assert.ok(parsed.result.data.output_url.startsWith('https://'));
});

test('generateMergedLocketConf supports 100% pure GitHub Raw direct mode and Cloudflare Worker generator', () => {
  const gitDirectConf = generateMergedLocketConf('https://locketai.onrender.com', 'shadowrocket', {
    includeGoldUnlock: true,
    usePatchedForceGold: true,
    directNoServer: true,
    scriptBaseUrl: 'https://raw.githubusercontent.com/vdatdv/locketAI/main/github-raw/scripts',
    aiScriptUrl: '',
  });
  assert.ok(gitDirectConf.includes('https://raw.githubusercontent.com/vdatdv/locketAI/main/github-raw/scripts/locket_ai_direct.js'));
  assert.ok(gitDirectConf.includes('locket_ai_filter_direct = type=http-request'));
  assert.ok(gitDirectConf.includes('max-size=-1'));
  assert.equal(gitDirectConf.includes('max-size=0'), false);
  assert.equal(gitDirectConf.includes('locket_ai_filter_res'), false);

  const workerCode = generateStandaloneServerCode('worker');
  assert.ok(workerCode.includes('runImg2ImgHorde'));
  assert.ok(workerCode.includes('outputUrl'));
});

test('patchForceGoldScript prepends Caption AI Filter section and handles empty 304 bodies safely', () => {
  const sampleUpstream = [
    'var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";',
    'var obj = JSON.parse($response.body);',
    'if (ua.includes("Locket")) {',
    '  obj.entries = obj.entries || {};',
    '}',
    '$done({ body: JSON.stringify(obj) });',
  ].join('\n');

  const patched = patchForceGoldScript(sampleUpstream);

  let emptyDone: Record<string, unknown> | undefined;
  vm.runInNewContext(patched, {
    $request: { url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch', headers: {} },
    $response: { status: 304, body: '' },
    $done: (out: Record<string, unknown>) => {
      emptyDone = out;
    },
  });
  assert.equal(JSON.stringify(emptyDone), '{}');

  let rcDone: { body?: string } | undefined;
  vm.runInNewContext(patched, {
    $request: { url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch', headers: { 'User-Agent': 'Firebase-RemoteConfig/11.0' } },
    $response: {
      status: 200,
      body: JSON.stringify({
        entries: {
          feature_gates: '{}',
          upsell_features: '{}',
          camera_filter_config: JSON.stringify({
            sheet_filters: [{ title: { en: 'Cute' }, filter_ids: ['flower_crown'] }],
            picker_filters: ['flower_crown'],
          }),
          overlay_items: JSON.stringify([{ section: 'Orig', items: [] }]),
        },
      }),
    },
    $done: (out: { body?: string }) => {
      rcDone = out;
    },
  });
  if (!rcDone?.body) assert.fail('Expected patched forceGold output');
  const rcObj = JSON.parse(rcDone.body);
  const overlays = JSON.parse(rcObj.entries.overlay_items);
  assert.equal(overlays.length, 2);
  assert.ok(overlays[0].section.includes('Filter AI'));
  assert.ok(overlays[0].items.some((i: { overlay_id?: string }) => i.overlay_id === 'caption:ai_filter_flower_crown'));
  const filterCfg = JSON.parse(rcObj.entries.camera_filter_config);
  assert.ok(filterCfg.picker_filters.includes('photobooth'));
  assert.ok(filterCfg.sheet_filters.some((s: { title?: { en?: string } }) => s.title?.en === 'Photobooth'));
  assert.equal(rcObj.entries.camera_filters_free_tier_enabled, 'true');
});

test('generateMomentAiFilterScript passes normal captions through and intercepts AI captions & #ai tags', () => {
  const regex = new RegExp(LOCKET_MOMENT_AI_PATTERN.replace(/\\\//g, '/'));
  assert.equal(regex.test('https://api.locketcamera.com/postMomentV2'), true);

  const script = generateMomentAiFilterScript('https://locketai.onrender.com', 'shadowrocket');

  let passthroughDone: Record<string, unknown> | undefined;
  vm.runInNewContext(script, {
    $request: {
      url: 'https://api.locketcamera.com/postMomentV2',
      headers: {},
      body: JSON.stringify({ data: { caption: 'Hello friends', thumbnail_url: 'https://cdn/1.jpg', overlays: [] } }),
    },
    $done: (out: Record<string, unknown>) => {
      passthroughDone = out;
    },
  });
  assert.equal(JSON.stringify(passthroughDone), '{}');

  let forwardedUrl = '';
  let aiDone: { body?: string } | undefined;
  vm.runInNewContext(script, {
    $request: {
      url: 'https://api.locketcamera.com/postMomentV2',
      headers: { Authorization: 'Bearer tok', 'X-Firebase-AppCheck': 'appchk' },
      body: JSON.stringify({
        data: {
          caption: 'AI · Vòng hoa',
          thumbnail_url: 'https://firebasestorage.googleapis.com/orig.jpg',
          overlays: [{ overlay_id: 'caption:ai_filter_flower_crown' }],
        },
      }),
    },
    $httpClient: {
      post: (opts: { url: string; body: string }, cb: (err: unknown, resp: unknown, data: string) => void) => {
        forwardedUrl = opts.url;
        const sent = JSON.parse(opts.body);
        sent.payload.data.thumbnail_url = 'https://firebasestorage.googleapis.com/transformed.jpg';
        cb(null, { status: 200 }, JSON.stringify({ ok: true, payload: sent.payload }));
      },
    },
    $done: (out: { body?: string }) => {
      aiDone = out;
    },
  });
  assert.equal(forwardedUrl, 'https://locketai.onrender.com/api/locket/moment-ai-filter');
  if (!aiDone?.body) assert.fail('Expected transformed postMomentV2 payload');
  const finalPayload = JSON.parse(aiDone.body);
  assert.equal(finalPayload.data.thumbnail_url, 'https://firebasestorage.googleapis.com/transformed.jpg');
});

test('generateTrafficProbeScript avoids /api/locket/ loop and tracks firebaseremoteconfig hosts', () => {
  const probeScript = generateTrafficProbeScript('https://locketai.onrender.com');
  let selfLoopDone: Record<string, unknown> | undefined;
  vm.runInNewContext(probeScript, {
    $request: { url: 'https://locketai.onrender.com/api/locket/mitm-probe', headers: { 'User-Agent': 'Locket/2.0' } },
    $done: (out: Record<string, unknown>) => {
      selfLoopDone = out;
    },
  });
  assert.equal(JSON.stringify(selfLoopDone), '{}');

  let probedRemoteConfig = false;
  vm.runInNewContext(probeScript, {
    $request: {
      url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch',
      method: 'POST',
      headers: { 'User-Agent': 'Firebase-RemoteConfig/11.0' },
      body: '{}',
    },
    $httpClient: {
      post: (_opts: unknown, cb: () => void) => {
        probedRemoteConfig = true;
        cb();
      },
    },
    $done: () => {},
  });
  assert.equal(probedRemoteConfig, true);
});



