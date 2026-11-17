import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEnhancedPrompt,
  DEFAULT_SHADOWROCKET_AI_PATTERN,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  generateStandaloneServerCode,
  getDimensionsForAspectRatio,
  isValidServerUrl,
  LOCKET_CAPTIONS,
  LOCKET_FILTERS,
  mapFilterIdToPrompt,
  normalizeServerUrl,
} from './locketConfig';

test('getDimensionsForAspectRatio returns expected dimensions', () => {
  assert.deepEqual(getDimensionsForAspectRatio('1:1'), { width: 1024, height: 1024 });
  assert.deepEqual(getDimensionsForAspectRatio('3:4'), { width: 768, height: 1024 });
  assert.deepEqual(getDimensionsForAspectRatio('9:16'), { width: 720, height: 1280 });
});

test('mapFilterIdToPrompt resolves known Locket filters and unknown IDs', () => {
  const crown = mapFilterIdToPrompt('flower_crown');
  assert.ok(crown.includes('flower crown'));
  const combined = mapFilterIdToPrompt('disco_lights', 'girl smiling');
  assert.ok(combined.startsWith('girl smiling,'));
  assert.ok(combined.includes('disco ball'));
  const customOnly = mapFilterIdToPrompt('none', 'cute cat');
  assert.equal(customOnly, 'cute cat');
});

test('buildEnhancedPrompt appends style suffix and filter instruction', () => {
  assert.equal(buildEnhancedPrompt('   ', 'ghibli'), '');
  const prompt = buildEnhancedPrompt('chú mèo đáng yêu', 'ghibli', 'cute little cat', 'princess');
  assert.ok(prompt.startsWith('cute little cat,'));
  assert.ok(prompt.includes('tiara crown'));
  assert.ok(prompt.includes('Ghibli'));
});

test('DEFAULT_SHADOWROCKET_AI_PATTERN matches filter/AI endpoints without intercepting postMomentV2', () => {
  const regex = new RegExp(DEFAULT_SHADOWROCKET_AI_PATTERN.replace(/\\\//g, '/'));
  assert.equal(
    regex.test('https://us-central1-locket-4252a.cloudfunctions.net/applyFilter'),
    true
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/v1/ai/generate'),
    true
  );
  assert.equal(
    regex.test('https://api.locketcamera.com/postMomentV2'),
    false
  );
});

test('URL validation and normalization', () => {
  assert.equal(normalizeServerUrl('https://example.com/// '), 'https://example.com');
  assert.equal(isValidServerUrl('https://my-server.onrender.com'), true);
  assert.equal(isValidServerUrl('http://localhost:3000'), true);
  assert.equal(isValidServerUrl('ftp://bad-protocol.com'), false);
  assert.equal(isValidServerUrl('not a url'), false);
});

test('generateMitmRedirectScript forwards filter_id and image_base64 for Shadowrocket', () => {
  const srScript = generateMitmRedirectScript('https://free-ai.onrender.com/', 'shadowrocket');
  assert.ok(srScript.includes('https://free-ai.onrender.com/api/locket/ai-generate'));
  assert.ok(srScript.includes('filter_id'));
  assert.ok(srScript.includes('image_base64'));
  assert.ok(srScript.includes('rawBody.data'));
});

test('generateMergedLocketConf includes Gold scripts, patched forceGold4.3 option, and AI filter rule', () => {
  const conf = generateMergedLocketConf('https://free-ai.onrender.com', 'shadowrocket', {
    includeYoutubeAdblock: true,
    includeGoldUnlock: true,
    usePatchedForceGold: true,
    aiScriptUrl: '',
    aiPattern: DEFAULT_SHADOWROCKET_AI_PATTERN,
  });
  assert.ok(conf.includes('locketfix8.js'));
  assert.ok(conf.includes('header7.js'));
  assert.ok(conf.includes('https://free-ai.onrender.com/scripts/forceGold4.3.js'));
  assert.ok(conf.includes('locket_ai_free = type=http-request'));
  assert.ok(conf.includes('api.locketcamera.com'));
  assert.ok(conf.includes('us-central1-locket-4252a.cloudfunctions.net'));
});

test('generateStandaloneServerCode includes filter prompts and img2img support', () => {
  const vercelCode = generateStandaloneServerCode('vercel');
  assert.ok(vercelCode.includes('FILTER_PROMPTS'));
  assert.ok(vercelCode.includes('export default async function handler'));

  const renderCode = generateStandaloneServerCode('render');
  assert.ok(renderCode.includes('source_image'));
  assert.ok(renderCode.includes('FILTER_PROMPTS'));
});

test('LOCKET_CAPTIONS and LOCKET_FILTERS include forceGold4.3 presets', () => {
  assert.ok(LOCKET_CAPTIONS.some((c) => c.id === 'caption:em_nho_anhh'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'okay_wig'));
  assert.ok(LOCKET_FILTERS.some((f) => f.id === 'flower_crown'));
});
