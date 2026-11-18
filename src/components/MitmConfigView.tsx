import { useMemo, useState } from 'react';
import { Check, Copy, Download, ShieldAlert } from 'lucide-react';
import {
  DEFAULT_SHADOWROCKET_AI_PATTERN,
  generateDirectFilterScript,
  generateFilterUnlockScript,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  isValidServerUrl,
  normalizeGitRawScriptsUrl,
  normalizeServerUrl,
  type ProxyClient,
} from '../utils/locketConfig';

export type HostMode = 'git-direct' | 'git-backend' | 'self-hosted';

interface MitmConfigViewProps {
  serverUrl: string;
  onServerUrlChange: (url: string) => void;
  client: ProxyClient;
  onClientChange: (client: ProxyClient) => void;
  hostMode: HostMode;
  onHostModeChange: (mode: HostMode) => void;
  gitRawBaseUrl: string;
  onGitRawBaseUrlChange: (url: string) => void;
}

const CLIENTS: Array<{ id: ProxyClient; label: string }> = [
  { id: 'shadowrocket', label: 'Shadowrocket' },
  { id: 'loon', label: 'Loon' },
  { id: 'surge', label: 'Surge' },
  { id: 'quantumultx', label: 'Quantumult X' },
];

const HOST_MODES: Array<{ id: HostMode; label: string; hint: string }> = [
  {
    id: 'git-direct',
    label: '100% GitHub Raw (0 Server)',
    hint: 'Toàn bộ .conf & script để trên Git Raw — không cần Render hay web ngoài. Script locket_ai_direct.js gọi thẳng AI Horde Img2Img / Txt2Img R2 ngay trong Shadowrocket.',
  },
  {
    id: 'git-backend',
    label: 'GitHub Raw + API ngầm',
    hint: '.conf & script để trên Git Raw; riêng endpoint /generateFilteredImage trỏ ngầm về Render hoặc Cloudflare Worker để tải ảnh URL & giữ mặt ổn định nhất.',
  },
  {
    id: 'self-hosted',
    label: 'Link trực tiếp từ Server',
    hint: 'Dán thẳng 1 link /Locket.conf từ server Render này vào Shadowrocket (không cần tự up file lên GitHub).',
  },
];

export function MitmConfigView({
  serverUrl,
  onServerUrlChange,
  client,
  onClientChange,
  hostMode,
  onHostModeChange,
  gitRawBaseUrl,
  onGitRawBaseUrlChange,
}: MitmConfigViewProps) {
  const [includeGoldUnlock, setIncludeGoldUnlock] = useState(true);
  const [usePatchedForceGold, setUsePatchedForceGold] = useState(true);
  const [enableTrafficProbe, setEnableTrafficProbe] = useState(false);
  const [aiPattern, setAiPattern] = useState(DEFAULT_SHADOWROCKET_AI_PATTERN);
  const [codeTab, setCodeTab] = useState<'conf' | 'script' | 'unlock'>('conf');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const urlValid = isValidServerUrl(serverUrl);
  const cleanUrl = normalizeServerUrl(serverUrl);
  const normalizedRawBase = normalizeGitRawScriptsUrl(gitRawBaseUrl);
  const directNoServer = hostMode === 'git-direct';

  const generatedConf = useMemo(
    () =>
      generateMergedLocketConf(cleanUrl, client, {
        includeGoldUnlock,
        usePatchedForceGold,
        enableTrafficProbe: hostMode === 'self-hosted' && enableTrafficProbe,
        directNoServer,
        scriptBaseUrl: hostMode === 'self-hosted' ? '' : normalizedRawBase,
        aiScriptUrl: '',
        aiPattern,
      }),
    [
      cleanUrl,
      client,
      hostMode,
      directNoServer,
      normalizedRawBase,
      includeGoldUnlock,
      usePatchedForceGold,
      enableTrafficProbe,
      aiPattern,
    ]
  );

  const generatedRedirectScript = useMemo(
    () => generateMitmRedirectScript(cleanUrl, client),
    [cleanUrl, client]
  );

  const generatedDirectScript = useMemo(() => generateDirectFilterScript(), []);
  const generatedUnlockScript = useMemo(() => generateFilterUnlockScript(), []);

  const activeScriptTabLabel = directNoServer ? 'locket_ai_direct.js' : 'locket_ai_redirect.js';

  const activeCodeBody =
    codeTab === 'conf'
      ? generatedConf
      : codeTab === 'script'
        ? directNoServer
          ? generatedDirectScript
          : generatedRedirectScript
        : generatedUnlockScript;

  const activeCodeFilename =
    codeTab === 'conf'
      ? directNoServer
        ? 'Locket_Direct_GitRaw.conf'
        : 'Locket_AI_Free.conf'
      : codeTab === 'script'
        ? activeScriptTabLabel
        : 'locket_filter_unlock.js';

  const directImportUrl = `${cleanUrl || 'https://your-server.onrender.com'}/Locket.conf?client=${client}${
    directNoServer ? '&direct=1' : ''
  }${hostMode !== 'self-hosted' && normalizedRawBase ? `&rawBase=${encodeURIComponent(normalizedRawBase)}` : ''}${
    usePatchedForceGold ? '' : '&patchedForceGold=0'
  }${hostMode === 'self-hosted' && enableTrafficProbe ? '&probe=1' : ''}`;

  const activeModeInfo = HOST_MODES.find((m) => m.id === hostMode) ?? HOST_MODES[0];

  async function copyText(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Ignore clipboard failures
    }
  }

  function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Dùng Filter AI &amp; Photobooth trực tiếp trong app Locket — Hỗ trợ Conf Raw trên Git
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Không cần mở trang web để tạo ảnh: bạn chỉ cần dùng <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">.conf</code> raw trên GitHub (hoặc link trực tiếp từ server) trong Shadowrocket, rồi mở app Locket chụp &amp; chọn Filter như bình thường.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">01. Locket Gold + 55+ Filter/Photobooth</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code className="font-mono">forceGold4.3.js</code> (đã vá), <code className="font-mono">locketfix8.js</code> và <code className="font-mono">header7.js</code> mở khóa Gold, Camera Roll 60s, Caption và toàn bộ bảng Filter trong Locket.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">02. Mở quyền Filter Account (Sạch 100%)</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code className="font-mono">locket_filter_unlock.js</code> bật <code className="font-mono">can_use_filters</code>, <code className="font-mono">can_generate_filtered_image</code>, xóa khóa <code className="font-mono">is_locked</code> / 403 trên <code className="font-mono">api.locketcamera.com</code>.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">03. Xử lý /generateFilteredImage 0đ</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {directNoServer ? (
                <>
                  <code className="font-mono">locket_ai_direct.js</code> gọi thẳng AI Horde Img2Img / Txt2Img R2 ngay trong Shadowrocket — <strong>không cần server hay web</strong>.
                </>
              ) : (
                <>
                  <code className="font-mono">locket_ai_redirect.js</code> chuyển ngầm <code className="font-mono">generateFilteredImage</code> về <code className="font-mono">{cleanUrl || 'API'}/generateFilteredImage</code> xử lý Img2Img giữ mặt thật.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Configurator + Code Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-5 min-w-0 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-900">Kiểu chạy &amp; Host Conf</span>
            <div className="grid grid-cols-1 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {HOST_MODES.map((m) => {
                const active = hostMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onHostModeChange(m.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{activeModeInfo.hint}</p>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-900">Ứng dụng Proxy</span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {CLIENTS.map((item) => {
                const active = client === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onClientChange(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {hostMode !== 'self-hosted' && (
            <div className="space-y-1.5">
              <label htmlFor="git-raw-input" className="block text-sm font-semibold text-slate-900">
                Link thư mục Script trên GitHub Raw
              </label>
              <input
                id="git-raw-input"
                type="url"
                value={gitRawBaseUrl}
                onChange={(e) => onGitRawBaseUrlChange(e.target.value)}
                placeholder="https://raw.githubusercontent.com/vdatdv/locketAI/main/github-raw/scripts"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              />
              <p className="text-xs text-slate-500">
                Có thể dán link repo GitHub (vd <code className="font-mono">https://github.com/user/repo</code>), hệ thống tự đổi sang <code className="font-mono">raw.githubusercontent.com</code>.
              </p>
            </div>
          )}

          {hostMode !== 'git-direct' && (
            <div className="space-y-1.5">
              <label htmlFor="server-url-input" className="block text-sm font-semibold text-slate-900">
                URL API chạy ngầm (Render / Cloudflare Worker)
              </label>
              <input
                id="server-url-input"
                type="url"
                value={serverUrl}
                onChange={(e) => onServerUrlChange(e.target.value)}
                placeholder="https://locketai.onrender.com"
                className={`w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 ${
                  urlValid
                    ? 'border-slate-300 focus:border-amber-600 focus:ring-amber-600/20'
                    : 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                }`}
              />
              {!urlValid ? (
                <p className="text-xs text-red-600">
                  Vui lòng nhập URL hợp lệ bắt đầu bằng https:// hoặc http://
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Chỉ dùng làm API xử lý ảnh ngầm khi app Locket gọi <code className="font-mono">/generateFilteredImage</code>.
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="ai-pattern-input" className="block text-sm font-semibold text-slate-900">
              Pattern Regex bắt request Filter Locket
            </label>
            <input
              id="ai-pattern-input"
              type="text"
              value={aiPattern}
              onChange={(e) => setAiPattern(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="block text-sm font-semibold text-slate-900">
              Tuỳ chọn cấu hình Locket
            </span>
            <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGoldUnlock}
                onChange={(e) => setIncludeGoldUnlock(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
              />
              <span>Mở khoá Locket Gold &amp; Filter Account (locketfix8, header7, forceGold4.3, locket_filter_unlock)</span>
            </label>
            {includeGoldUnlock && (
              <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer pl-5">
                <input
                  type="checkbox"
                  checked={usePatchedForceGold}
                  onChange={(e) => setUsePatchedForceGold(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                />
                <span>Dùng forceGold4.3.js đã bật sẵn Camera Roll &amp; AI flags</span>
              </label>
            )}
            {hostMode === 'self-hosted' && (
              <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTrafficProbe}
                  onChange={(e) => setEnableTrafficProbe(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                />
                <span>
                  Bật Debug Probe (ghi request vào tab API &amp; Nhật ký)
                </span>
              </label>
            )}
          </div>

          {hostMode === 'self-hosted' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900">Link nhập vào Shadowrocket</span>
                <button
                  type="button"
                  onClick={() => copyText(directImportUrl, 'import-url')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 whitespace-nowrap"
                >
                  {copiedId === 'import-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Chép URL</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-600 break-all">{directImportUrl}</p>
            </div>
          )}
        </div>

        {/* Code Output Panel */}
        <div className="xl:col-span-7 min-w-0 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setCodeTab('conf')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  codeTab === 'conf' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                }`}
              >
                {directNoServer ? 'Locket_Direct_GitRaw.conf' : 'Locket_AI_Free.conf'}
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('script')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  codeTab === 'script' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                }`}
              >
                {activeScriptTabLabel}
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('unlock')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  codeTab === 'unlock' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                }`}
              >
                locket_filter_unlock.js
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyText(activeCodeBody, 'code-body')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                {copiedId === 'code-body' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => downloadFile(activeCodeBody, activeCodeFilename)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          <pre className="p-4 sm:p-5 text-xs font-mono text-slate-800 overflow-x-auto max-h-[440px] leading-relaxed bg-white">
            <code>{activeCodeBody}</code>
          </pre>
        </div>
      </div>

      {/* Step-by-step Shadowrocket In-App Locket Guide */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700" aria-hidden="true" />
          <h2 className="font-display text-sm font-semibold text-slate-900">
            Hướng dẫn dùng trực tiếp Filter AI trên Locket bằng Conf Raw GitHub
          </h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600 leading-relaxed pt-1">
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 1 · Đẩy lên GitHub</span>
            Tải ZIP ở tab <strong>Git Raw / Worker / Render</strong> rồi đẩy thư mục{' '}
            <code className="font-mono text-slate-800">github-raw/</code> lên repo GitHub của bạn (chứa sẵn cả <code className="font-mono">Locket_Direct_GitRaw.conf</code> &amp; scripts).
          </li>
          <li className="space-y-1 min-w-0">
            <span className="font-semibold text-slate-900 block">Bước 2 · Nhập Link Raw Git</span>
            Mở Shadowrocket → <strong>Config</strong> → bấm <strong>+</strong> → dán link{' '}
            <code className="font-mono text-slate-800 break-all">raw.githubusercontent.com/.../Locket_Direct_GitRaw.conf</code> → chọn <strong>Use Config</strong>.
          </li>
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 3 · Bật HTTPS Decryption</span>
            Vào config vừa thêm → <strong>HTTPS Decryption</strong> → bật ON → Generate New CA Certificate → Cài đặt iPhone <em>Trust Certificate</em>.
          </li>
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 4 · Mở Locket &amp; Chụp Filter</span>
            Bật VPN Shadowrocket → tắt hoàn toàn app Locket mở lại → chọn Filter bất kỳ (Flower Crown, Cutesy, Photobooth...) và chụp trực tiếp trên app.
          </li>
        </ol>
      </section>
    </div>
  );
}
