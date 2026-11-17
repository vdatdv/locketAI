import { useEffect, useState } from 'react';
import { Loader2, Play, RefreshCw, Search, Trash2 } from 'lucide-react';
import type { ServerLogEntry } from '../types';

export function ApiLogsView() {
  const [logs, setLogs] = useState<ServerLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | '200' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    endpoint: string;
    status: number;
    latencyMs: number;
    body: string;
  } | null>(null);

  async function fetchLogs() {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (res.ok && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch {
      // Keep current state on network failure
    } finally {
      setLoadingLogs(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  async function runHealthCheck() {
    setTestingEndpoint('health');
    const started = performance.now();
    try {
      const res = await fetch('/api/locket/health');
      const json = await res.json();
      setTestResult({
        endpoint: 'GET /api/locket/health',
        status: res.status,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify(json, null, 2),
      });
      await fetchLogs();
    } catch (err) {
      setTestResult({
        endpoint: 'GET /api/locket/health',
        status: 500,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Error' }, null, 2),
      });
    } finally {
      setTestingEndpoint(null);
    }
  }

  async function runShadowrocketCallableTest() {
    setTestingEndpoint('callable');
    const started = performance.now();
    try {
      const res = await fetch('/api/locket/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Locket-Proxy': 'shadowrocket',
        },
        body: JSON.stringify({
          data: {
            prompt: 'cute golden retriever puppy in sunlight',
            style: 'natural',
            aspect_ratio: '1:1',
          },
        }),
      });
      const json = await res.json();
      const preview = {
        ...json,
        imageDataUrl: json.imageDataUrl ? `${String(json.imageDataUrl).slice(0, 64)}...` : undefined,
        image_data_url: json.image_data_url ? `${String(json.image_data_url).slice(0, 64)}...` : undefined,
        imageBase64: json.imageBase64 ? `${String(json.imageBase64).slice(0, 48)}...` : undefined,
        result: json.result
          ? {
              ...json.result,
              imageDataUrl: `${String(json.result.imageDataUrl || '').slice(0, 48)}...`,
              image_data_url: `${String(json.result.image_data_url || '').slice(0, 48)}...`,
              imageBase64: `${String(json.result.imageBase64 || '').slice(0, 32)}...`,
            }
          : undefined,
      };
      setTestResult({
        endpoint: 'POST /api/locket/ai-generate (Firebase Callable)',
        status: res.status,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify(preview, null, 2),
      });
      await fetchLogs();
    } catch (err) {
      setTestResult({
        endpoint: 'POST /api/locket/ai-generate',
        status: 500,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Error' }, null, 2),
      });
    } finally {
      setTestingEndpoint(null);
    }
  }

  function createSamplePortraitBase64(): string {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(32, 32, 18, 0, Math.PI * 2);
        ctx.fill();
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch {
      // Fallback 1x1 PNG base64 if canvas unavailable
    }
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }

  async function runLocketFilterImg2ImgTest() {
    setTestingEndpoint('filter');
    const started = performance.now();
    try {
      const sampleImage = createSamplePortraitBase64();
      const res = await fetch('/api/locket/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Locket-Proxy': 'shadowrocket',
        },
        body: JSON.stringify({
          data: {
            filter_id: 'flower_crown',
            prompt: 'portrait',
            aspect_ratio: '1:1',
            image_base64: sampleImage,
          },
          original_url: 'https://us-central1-locket-4252a.cloudfunctions.net/applyFilter',
          callable: true,
        }),
      });
      const json = await res.json();
      const preview = {
        ...json,
        imageDataUrl: json.imageDataUrl ? `${String(json.imageDataUrl).slice(0, 56)}...` : undefined,
        image_data_url: json.image_data_url ? `${String(json.image_data_url).slice(0, 56)}...` : undefined,
        imageBase64: json.imageBase64 ? `${String(json.imageBase64).slice(0, 40)}...` : undefined,
        image: json.image ? `${String(json.image).slice(0, 40)}...` : undefined,
        result: json.result
          ? {
              ...json.result,
              imageDataUrl: `${String(json.result.imageDataUrl || '').slice(0, 48)}...`,
              image_data_url: `${String(json.result.image_data_url || '').slice(0, 48)}...`,
              imageBase64: `${String(json.result.imageBase64 || '').slice(0, 32)}...`,
              image: `${String(json.result.image || '').slice(0, 32)}...`,
            }
          : undefined,
      };
      setTestResult({
        endpoint: 'POST /api/locket/ai-generate (Locket Filter Img2Img)',
        status: res.status,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify(preview, null, 2),
      });
      await fetchLogs();
    } catch (err) {
      setTestResult({
        endpoint: 'POST /api/locket/ai-generate (Locket Filter Img2Img)',
        status: 500,
        latencyMs: Math.round(performance.now() - started),
        body: JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Error' }, null, 2),
      });
    } finally {
      setTestingEndpoint(null);
    }
  }

  async function clearLogs() {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      setLogs([]);
    } catch {
      // Ignore
    }
  }

  const filteredLogs = logs.filter((entry) => {
    if (statusFilter === '200' && entry.status >= 400) return false;
    if (statusFilter === 'error' && entry.status < 400) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.path.toLowerCase().includes(q) ||
        entry.provider.toLowerCase().includes(q) ||
        entry.detail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Endpoint Tester */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              Kiểm tra Endpoint trực tiếp
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mô phỏng request thật từ Shadowrocket gửi vào máy chủ Node.js để kiểm tra phản hồi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={testingEndpoint !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 whitespace-nowrap"
            >
              {testingEndpoint === 'health' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              )}
              <span>Kiểm tra /api/locket/health</span>
            </button>
            <button
              type="button"
              onClick={runShadowrocketCallableTest}
              disabled={testingEndpoint !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 whitespace-nowrap"
            >
              {testingEndpoint === 'callable' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              )}
              <span>Test Shadowrocket Callable</span>
            </button>
            <button
              type="button"
              onClick={runLocketFilterImg2ImgTest}
              disabled={testingEndpoint !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60 whitespace-nowrap"
            >
              {testingEndpoint === 'filter' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>Test Filter Locket (Img2Img)</span>
            </button>
          </div>
        </div>

        {testResult && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="px-3.5 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono font-medium text-slate-800">{testResult.endpoint}</span>
              <div className="flex items-center gap-3 font-mono tabular-nums">
                <span className={testResult.status < 400 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                  HTTP {testResult.status}
                </span>
                <span className="text-slate-500">{testResult.latencyMs}ms</span>
              </div>
            </div>
            <pre className="p-3.5 text-xs font-mono text-slate-700 overflow-x-auto max-h-60 leading-relaxed">
              <code>{testResult.body}</code>
            </pre>
          </div>
        )}
      </section>

      {/* Real Server Request Logs */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              Nhật ký Request máy chủ ({filteredLogs.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị các request thực tế đã gọi vào server (bao gồm cả request từ Shadowrocket).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                aria-label="Tìm kiếm nhật ký"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc theo path, provider..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              {(['all', '200', 'error'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    statusFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-600'
                  }`}
                >
                  {f === 'all' ? 'Tất cả' : f === '200' ? '200 OK' : 'Lỗi'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchLogs}
              aria-label="Làm mới nhật ký"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40 whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Xoá log</span>
            </button>
          </div>
        </div>

        {loadingLogs ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải nhật ký...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              Chưa có request nào được ghi nhận
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hãy tạo thử một bức ảnh AI hoặc bấm nút kiểm tra endpoint ở trên để xem log hoạt động theo thời gian thực.
            </p>
            <button
              type="button"
              onClick={runHealthCheck}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kiểm tra Server ngay</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-medium">
                  <th className="py-2.5 px-4">Thời gian</th>
                  <th className="py-2.5 px-4">Endpoint</th>
                  <th className="py-2.5 px-4">Trạng thái</th>
                  <th className="py-2.5 px-4">Provider</th>
                  <th className="py-2.5 px-4 text-right">Độ trễ</th>
                  <th className="py-2.5 px-4">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-900 whitespace-nowrap">
                      {entry.method} {entry.path}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap">
                      <span
                        className={
                          entry.status < 400
                            ? 'text-emerald-700 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {entry.status} {entry.status < 400 ? 'OK' : 'ERR'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">{entry.provider}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {entry.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-lg break-words">{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
