import { useMemo, useState } from 'react';
import { Archive, Check, Copy, Download } from 'lucide-react';
import { generateStandaloneServerCode, type DeployPlatform } from '../utils/locketConfig';

const PLATFORMS: Array<{
  id: DeployPlatform;
  label: string;
  filename: string;
  steps: string[];
}> = [
  {
    id: 'worker',
    label: 'Cloudflare Worker (0đ · Không Sleep)',
    filename: 'worker.js',
    steps: [
      'Đăng nhập dash.cloudflare.com (miễn phí, không cần thẻ) -> Workers & Pages -> Create Worker.',
      'Dán toàn bộ code worker.js bên dưới vào trình soạn thảo -> bấm Deploy.',
      'Lấy link https://ten-worker.workers.dev dán vào ô URL API ở tab Shadowrocket & Git Raw.',
      'Worker chạy tức thì 24/7 không bị ngủ như Render Free, không có giao diện web thừa.',
    ],
  },
  {
    id: 'render',
    label: 'Render.com (0đ)',
    filename: 'server-free.mjs',
    steps: [
      'Tải bộ ZIP bên trên và đẩy lên repo GitHub của bạn (có sẵn thư mục github-raw/ + .npmrc).',
      'Vào render.com -> New Web Service -> chọn Free Tier ($0/month, Region Singapore).',
      'Build Command: npm install --include=dev && npm run build · Start Command: npx tsx server.ts.',
      'Dán link onrender.com vào cấu hình GitHub Raw (không cần mở trình duyệt web nữa).',
    ],
  },
  {
    id: 'railway',
    label: 'Koyeb / Railway',
    filename: 'server-free.mjs',
    steps: [
      'Đăng nhập Koyeb hoặc Railway bằng tài khoản GitHub.',
      'Chọn Deploy from GitHub và trỏ tới repository vừa tải code lên.',
      'Koyeb cấp sẵn chứng chỉ HTTPS miễn phí ổn định, không cần thẻ tín dụng.',
      'Dán domain *.koyeb.app vào cấu hình Shadowrocket để chạy 24/7.',
    ],
  },
  {
    id: 'vercel',
    label: 'Vercel Serverless',
    filename: 'api/locket-ai.js',
    steps: [
      'Tạo thư mục dự án mới có đường dẫn api/locket-ai.js bằng đoạn mã bên dưới.',
      'Chạy lệnh npx vercel --prod hoặc push lên GitHub rồi import vào vercel.com (Free Hobby Plan).',
      'Endpoint Shadowrocket của bạn sẽ là https://ten-project.vercel.app/api/locket-ai.',
      'Trong script locket_ai_redirect.js trên GitHub Raw, trỏ TARGET_ENDPOINT tới URL này.',
    ],
  },
  {
    id: 'termux',
    label: 'Termux / PC nội bộ',
    filename: 'server-free.mjs',
    steps: [
      'Cài Node.js >= 18 (trên Android dùng pkg install nodejs; trên PC tải từ nodejs.org).',
      'Lưu file server-free.mjs vào máy và chạy lệnh: node server-free.mjs.',
      'Nếu muốn iPhone bên ngoài truy cập được, chạy thêm cloudflared tunnel --url http://localhost:3000.',
      'Lấy link trycloudflare.com dán vào Shadowrocket MITM để test ngay lập tức.',
    ],
  },
];

export function DeployGuideView() {
  const [platform, setPlatform] = useState<DeployPlatform>('worker');
  const [copied, setCopied] = useState(false);

  const activePlatform = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];
  const code = useMemo(() => generateStandaloneServerCode(platform), [platform]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore
    }
  }

  function handleDownload() {
    const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activePlatform.filename.split('/').pop() || 'worker.js';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Full Deployable Project ZIP Export */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
            <h2 className="font-display text-base font-semibold text-slate-900">
              Tải trọn bộ GitHub Raw + Worker + Server (.zip)
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Gồm sẵn thư mục <code className="font-mono bg-slate-100 px-1 rounded">github-raw/</code> (chứa{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">Locket_Direct_GitRaw.conf</code> bản 0 server,{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">Locket_Backend_GitRaw.conf</code>,{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">forceGold4.3.js</code> đã vá chèn 10 nút Caption AI,{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">locket_ai_moment.js</code>,{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">locket_filter_unlock.js</code>,{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">locket_ai_direct.js</code>), file{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">cloudflare-worker/worker.js</code> và mã nguồn Render kèm{' '}
            <code className="font-mono bg-slate-100 px-1 rounded">.npmrc</code>.
          </p>
        </div>

        <a
          href="/api/download-project"
          download="locket-ai-server.zip"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Tải trọn bộ code (.zip)</span>
        </a>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              API xử lý Img2Img chạy ngầm (1 file độc lập · 0đ · Không cần mở Web)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Khuyên dùng Cloudflare Worker (không sleep) để kết hợp với Conf Raw trên GitHub của bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
                  platform === p.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {activePlatform.steps.map((step, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-600 leading-relaxed"
            >
              <span className="font-semibold text-slate-900 block mb-1">
                Bước 0{i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
          <span className="font-mono text-xs font-medium text-slate-800">
            {activePlatform.filename}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tải file</span>
            </button>
          </div>
        </div>

        <pre className="p-4 sm:p-5 text-xs font-mono text-slate-800 overflow-x-auto max-h-[460px] leading-relaxed bg-white">
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}
