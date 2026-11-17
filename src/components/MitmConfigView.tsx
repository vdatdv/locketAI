import { useMemo, useState } from 'react';
import { Check, Copy, Download, ShieldAlert } from 'lucide-react';
import {
  DEFAULT_SHADOWROCKET_AI_PATTERN,
  generateMergedLocketConf,
  generateMitmRedirectScript,
  isValidServerUrl,
  normalizeServerUrl,
  type ProxyClient,
} from '../utils/locketConfig';

interface MitmConfigViewProps {
  serverUrl: string;
  onServerUrlChange: (url: string) => void;
  client: ProxyClient;
  onClientChange: (client: ProxyClient) => void;
}

const CLIENTS: Array<{ id: ProxyClient; label: string }> = [
  { id: 'shadowrocket', label: 'Shadowrocket' },
  { id: 'loon', label: 'Loon' },
  { id: 'surge', label: 'Surge' },
  { id: 'quantumultx', label: 'Quantumult X' },
];

export function MitmConfigView({
  serverUrl,
  onServerUrlChange,
  client,
  onClientChange,
}: MitmConfigViewProps) {
  const [includeGoldUnlock, setIncludeGoldUnlock] = useState(true);
  const [usePatchedForceGold, setUsePatchedForceGold] = useState(true);
  const [enableTrafficProbe, setEnableTrafficProbe] = useState(false);
  const [includeYoutubeAdblock, setIncludeYoutubeAdblock] = useState(true);
  const [aiPattern, setAiPattern] = useState(DEFAULT_SHADOWROCKET_AI_PATTERN);
  const [codeTab, setCodeTab] = useState<'conf' | 'script'>('conf');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const urlValid = isValidServerUrl(serverUrl);
  const cleanUrl = normalizeServerUrl(serverUrl);

  const generatedConf = useMemo(
    () =>
      generateMergedLocketConf(cleanUrl, client, {
        includeGoldUnlock,
        usePatchedForceGold,
        enableTrafficProbe,
        includeYoutubeAdblock,
        aiScriptUrl: '',
        aiPattern,
      }),
    [
      cleanUrl,
      client,
      includeGoldUnlock,
      usePatchedForceGold,
      enableTrafficProbe,
      includeYoutubeAdblock,
      aiPattern,
    ]
  );

  const generatedScript = useMemo(
    () => generateMitmRedirectScript(cleanUrl, client),
    [cleanUrl, client]
  );

  const directImportUrl = `${cleanUrl || 'https://your-server.onrender.com'}/Locket.conf?client=${client}${
    usePatchedForceGold ? '' : '&patchedForceGold=0'
  }${enableTrafficProbe ? '&probe=1' : ''}`;

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
            Dùng thẳng Filter AI trong app Locket qua Shadowrocket MITM
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Script <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">forceGold4.3.js</code> của bạn đã mở bảng chọn{' '}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">camera_filter_config</code> (30+ filter như{' '}
            <em>flower_crown</em>, <em>cutesy</em>, <em>princess</em>, <em>okay_wig</em>...). Khi bạn bấm dùng filter ngay trong app Locket,
            Shadowrocket MITM sẽ bắt request cùng ảnh selfie và chuyển hướng về server miễn phí này để xử lý Img2Img rồi trả kết quả về app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">01. Bật Filter &amp; MITM HTTPS</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Server cung cấp <code className="font-mono">/scripts/forceGold4.3.js</code> đã bật sẵn{' '}
              <code className="font-mono">ai_filters_enabled</code> và giải mã{' '}
              <code className="font-mono">api.locketcamera.com</code>,{' '}
              <code className="font-mono">us-central1-locket-4252a.cloudfunctions.net</code>.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">02. Bắt Filter ID &amp; Ảnh Selfie</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code className="font-mono">locket_ai_redirect.js</code> tách{' '}
              <code className="font-mono">filter_id</code>, <code className="font-mono">image_base64</code> và{' '}
              <code className="font-mono">original_url</code> (kể cả Firebase <code className="font-mono">httpsCallable</code>) mà không ảnh hưởng <code className="font-mono">postMomentV2</code>.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-900">03. Xử lý Img2Img &amp; Trả URL JPEG</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Server ghép filter lên ảnh selfie miễn phí và trả về đủ định dạng ({' '}
              <code className="font-mono">url</code>, <code className="font-mono">imageUrl</code>,{' '}
              <code className="font-mono">imageBase64</code>, <code className="font-mono">result</code>) cho app Locket.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Configurator + Code Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
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

          <div className="space-y-1.5">
            <label htmlFor="server-url-input" className="block text-sm font-semibold text-slate-900">
              URL Server AI miễn phí của bạn
            </label>
            <input
              id="server-url-input"
              type="url"
              value={serverUrl}
              onChange={(e) => onServerUrlChange(e.target.value)}
              placeholder="https://my-locket-ai.onrender.com"
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
                Dùng URL công khai (Render / Railway / ngrok / Cloudflare Tunnel) để iPhone kết nối được từ bên ngoài.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ai-pattern-input" className="block text-sm font-semibold text-slate-900">
              Pattern Regex bắt request AI &amp; Filter
            </label>
            <input
              id="ai-pattern-input"
              type="text"
              value={aiPattern}
              onChange={(e) => setAiPattern(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
            <p className="text-xs text-slate-500">
              Mặc định tránh khớp <code className="font-mono">postMomentV2</code> để bạn vẫn đăng ảnh Locket bình thường.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="block text-sm font-semibold text-slate-900">
              Tuỳ chọn gộp từ Locket.conf gốc
            </span>
            <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGoldUnlock}
                onChange={(e) => setIncludeGoldUnlock(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
              />
              <span>Giữ script mở khoá Gold (locketfix8.js, header7.js, forceGold4.3.js)</span>
            </label>
            {includeGoldUnlock && (
              <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer pl-5">
                <input
                  type="checkbox"
                  checked={usePatchedForceGold}
                  onChange={(e) => setUsePatchedForceGold(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                />
                <span>Dùng forceGold4.3.js đã bật AI Filter từ server này</span>
              </label>
            )}
            <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeYoutubeAdblock}
                onChange={(e) => setIncludeYoutubeAdblock(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
              />
              <span>Giữ rule chặn quảng cáo YouTube trong Locket.conf</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTrafficProbe}
                onChange={(e) => setEnableTrafficProbe(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
              />
              <span>
                Bật dò URL Locket (Debug Probe) để ghi mọi request Filter/AI vào tab API &amp; Nhật ký
              </span>
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900">Link nhập nhanh vào Shadowrocket</span>
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
        </div>

        {/* Code Output Panel */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setCodeTab('conf')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  codeTab === 'conf' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                }`}
              >
                Locket_AI_Free.conf
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('script')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  codeTab === 'script' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                }`}
              >
                locket_ai_redirect.js
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  copyText(codeTab === 'conf' ? generatedConf : generatedScript, 'code-body')
                }
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
                onClick={() =>
                  downloadFile(
                    codeTab === 'conf' ? generatedConf : generatedScript,
                    codeTab === 'conf' ? 'Locket_AI_Free.conf' : 'locket_ai_redirect.js'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          <pre className="p-4 sm:p-5 text-xs font-mono text-slate-800 overflow-x-auto max-h-[420px] leading-relaxed bg-white">
            <code>{codeTab === 'conf' ? generatedConf : generatedScript}</code>
          </pre>
        </div>
      </div>

      {/* Step-by-step Shadowrocket Guide */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700" aria-hidden="true" />
          <h2 className="font-display text-sm font-semibold text-slate-900">
            Hướng dẫn dùng thẳng Filter trong app Locket trên iPhone (Shadowrocket)
          </h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600 leading-relaxed pt-1">
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 1 · Nhập cấu hình</span>
            Mở Shadowrocket → tab <strong>Cấu hình (Config)</strong> → bấm dấu <strong>+</strong> → dán link{' '}
            <code className="font-mono text-slate-800">Locket.conf</code> ở trên rồi chọn{' '}
            <strong>Use Config</strong>.
          </li>
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 2 · Bật HTTPS MITM</span>
            Chạm vào file cấu hình → <strong>Sửa cấu hình → HTTPS Decryption</strong> → bật lên và chọn{' '}
            <strong>Generate New CA Certificate</strong>.
          </li>
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 3 · Tin cậy chứng chỉ</span>
            Vào <strong>Cài đặt iOS → Đã tải về hồ sơ</strong> để cài đặt CA, sau đó vào{' '}
            <strong>Giới thiệu → Cài đặt tin cậy chứng nhận</strong> và gạt bật chứng chỉ Shadowrocket.
          </li>
          <li className="space-y-1">
            <span className="font-semibold text-slate-900 block">Bước 4 · Chọn Filter trong Locket</span>
            Bật VPN trên Shadowrocket rồi mở bảng <strong>Filter</strong> trong camera Locket. Mở tab{' '}
            <strong>API &amp; Nhật ký</strong> để kiểm tra <code className="font-mono">original_url</code> và điều chỉnh Regex nếu Locket đổi tên Cloud Function.
          </li>
        </ol>
      </section>
    </div>
  );
}
