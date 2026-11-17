import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Check, Copy, Download, ImagePlus, Loader2, Sparkles, X } from 'lucide-react';
import type { GeneratedPhotoItem } from '../types';
import {
  AI_STYLE_PRESETS,
  LOCKET_CAPTIONS,
  LOCKET_FILTERS,
  type AspectRatioOption,
  type FreeAiModel,
} from '../utils/locketConfig';

interface AiStudioViewProps {
  history: GeneratedPhotoItem[];
  onImageGenerated: (item: GeneratedPhotoItem) => void;
}

const SAMPLE_PROMPTS = [
  'Một chú mèo cam đội vương miện vàng ngồi trong quán cà phê nắng chiều',
  'Chân dung cô gái phong cách chụp film Y2K tại phố đi bộ ban đêm',
  'Cảnh hoàng hôn Đà Lạt nhìn từ đồi thông phong cách anime Ghibli',
];

const FILTER_CATEGORIES = Array.from(
  new Set(LOCKET_FILTERS.filter((f) => f.id !== 'none').map((f) => f.category))
);

async function resizeImageFileToJpegDataUrl(file: File, maxDim = 640): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh đã chọn'));
    reader.readAsDataURL(file);
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('File ảnh không hợp lệ'));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
  const targetW = Math.max(64, Math.round((img.width || 512) * scale));
  const targetH = Math.max(64, Math.round((img.height || 512) * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas.toDataURL('image/jpeg', 0.85);
}

async function exportLocketCompositePng(
  item: GeneratedPhotoItem,
  captionId: string
): Promise<string> {
  const caption = LOCKET_CAPTIONS.find((c) => c.id === captionId);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Không thể tải ảnh để xuất file'));
    img.src = item.imageDataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = item.width;
  canvas.height = item.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return item.imageDataUrl;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (caption && caption.id !== 'none') {
    const label = `${caption.emoji} ${caption.text}`;
    const fontSize = Math.round(canvas.width * 0.036);
    ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
    const metrics = ctx.measureText(label);
    const padX = Math.round(canvas.width * 0.045);
    const pillH = Math.round(fontSize * 2.1);
    const pillW = Math.min(canvas.width - 64, Math.round(metrics.width + padX * 2));
    const pillX = (canvas.width - pillW) / 2;
    const pillY = canvas.height - pillH - Math.round(canvas.height * 0.06);
    const radius = pillH / 2;

    const grad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
    grad.addColorStop(0, caption.colors[0]);
    grad.addColorStop(0.5, caption.colors[1]);
    grad.addColorStop(1, caption.colors[2]);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, radius);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = caption.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, canvas.width / 2, pillY + pillH / 2, pillW - padX);
  }

  return canvas.toDataURL('image/png');
}

export function AiStudioView({ history, onImageGenerated }: AiStudioViewProps) {
  const [prompt, setPrompt] = useState('');
  const [filterId, setFilterId] = useState<string>('none');
  const [styleId, setStyleId] = useState<string>('natural');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const [model, setModel] = useState<FreeAiModel>('flux');
  const [selectedCaptionId, setSelectedCaptionId] = useState<string>('caption:em_nho_anhh');
  const [sourceImageDataUrl, setSourceImageDataUrl] = useState<string | null>(null);
  const [sourceImageName, setSourceImageName] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<GeneratedPhotoItem | null>(
    history[0] ?? null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCaption =
    LOCKET_CAPTIONS.find((c) => c.id === selectedCaptionId) ?? LOCKET_CAPTIONS[0];

  async function handleSourceFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      const resized = await resizeImageFileToJpegDataUrl(file);
      setSourceImageDataUrl(resized);
      setSourceImageName(file.name);
      if (filterId === 'none') {
        setFilterId('flower_crown');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể xử lý ảnh đã tải lên.');
    }
  }

  function clearSourceImage() {
    setSourceImageDataUrl(null);
    setSourceImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = prompt.trim();
    const hasFilter = filterId !== 'none';
    if (!trimmed && !hasFilter) {
      setErrorMsg('Vui lòng nhập mô tả ảnh hoặc chọn một Filter Locket trước khi bấm Tạo ảnh AI.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          filter_id: hasFilter ? filterId : undefined,
          style: styleId,
          aspect_ratio: aspectRatio,
          model,
          image_base64: sourceImageDataUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      }

      const displayPrompt =
        trimmed ||
        LOCKET_FILTERS.find((f) => f.id === filterId)?.label ||
        filterId;

      const item: GeneratedPhotoItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        prompt: displayPrompt,
        enhancedPrompt: data.enhancedPrompt || displayPrompt,
        styleId,
        filterId: hasFilter ? filterId : undefined,
        img2img: Boolean(data.img2img),
        imageUrl: data.imageUrl || data.url,
        aspectRatio,
        model,
        provider: data.provider || 'pollinations-free',
        imageDataUrl: data.imageDataUrl,
        width: data.width || 1024,
        height: data.height || 1024,
        latencyMs: data.latencyMs || 0,
        createdAt: new Date().toISOString(),
        notice: data.notice,
      };
      setActivePhoto(item);
      onImageGenerated(item);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tạo ảnh AI.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadComposite() {
    if (!activePhoto) return;
    setDownloading(true);
    try {
      const pngUrl = await exportLocketCompositePng(activePhoto, selectedCaptionId);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `locket-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = activePhoto.imageDataUrl;
      fallbackLink.download = `locket-ai-${Date.now()}.png`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyEnhancedPrompt() {
    if (!activePhoto) return;
    try {
      await navigator.clipboard.writeText(activePhoto.enhancedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Control Column */}
        <form
          onSubmit={handleGenerate}
          className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5"
        >
          {/* Locket Filter Preset + Optional Img2Img Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="locket-filter-select" className="block text-sm font-semibold text-slate-900">
                Filter trong app Locket
              </label>
              <select
                id="locket-filter-select"
                value={filterId}
                onChange={(e) => {
                  setFilterId(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="none">Không dùng Filter Locket</option>
                {FILTER_CATEGORIES.map((category) => (
                  <optgroup key={category} label={`Nhóm ${category}`}>
                    {LOCKET_FILTERS.filter((f) => f.category === category).map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="block text-sm font-semibold text-slate-900">
                Ảnh gốc (Selfie gắn Filter · Img2Img)
              </span>
              <input
                ref={fileInputRef}
                id="source-image-input"
                type="file"
                accept="image/*"
                onChange={handleSourceFileChange}
                className="sr-only"
              />
              {sourceImageDataUrl ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50/70 px-2.5 py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={sourceImageDataUrl}
                      alt="Ảnh gốc"
                      className="w-7 h-7 rounded object-cover shrink-0 border border-amber-200"
                    />
                    <span className="text-xs font-medium text-amber-950 truncate">
                      {sourceImageName || 'Đã chọn ảnh gốc'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearSourceImage}
                    aria-label="Xoá ảnh gốc"
                    className="p-1 text-amber-800 hover:text-red-700 shrink-0"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="source-image-input"
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-700 cursor-pointer transition-colors"
                >
                  <ImagePlus className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  <span>Chọn ảnh selfie để áp Filter</span>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="ai-prompt-input" className="text-sm font-semibold text-slate-900">
                Mô tả thêm (tuỳ chọn nếu đã chọn Filter)
              </label>
              <span className="text-xs text-slate-500">Hỗ trợ tiếng Việt &amp; tiếng Anh</span>
            </div>
            <textarea
              id="ai-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Ví dụ: Một chú mèo dễ thương đội vương miện vàng dưới ánh nắng chiều..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Gợi ý nhanh:</span>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(sample);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="text-xs text-slate-700 hover:text-amber-800 underline underline-offset-2 decoration-slate-300 hover:decoration-amber-600 text-left"
                >
                  Mẫu {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-900">
              Phong cách ảnh (AI Style)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_STYLE_PRESETS.map((preset) => {
                const selected = styleId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setStyleId(preset.id);
                      setModel(preset.recommendedModel);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-colors whitespace-nowrap truncate ${
                      selected
                        ? 'bg-amber-50 border-amber-500 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="aspect-ratio-select" className="block text-sm font-semibold text-slate-900">
                Tỉ lệ khung Locket
              </label>
              <select
                id="aspect-ratio-select"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatioOption)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="1:1">1:1 Vuông (Locket Chuẩn · 1024×1024)</option>
                <option value="3:4">3:4 Chân dung (768×1024)</option>
                <option value="9:16">9:16 Toàn màn hình (720×1280)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ai-model-select" className="block text-sm font-semibold text-slate-900">
                Engine AI miễn phí
              </label>
              <select
                id="ai-model-select"
                value={model}
                onChange={(e) => setModel(e.target.value as FreeAiModel)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="flux">Flux Free (Chi tiết cao · 0đ)</option>
                <option value="turbo">Turbo Fast (Tạo nhanh · 0đ)</option>
                <option value="anime">Anime Style (Hoạt hình · 0đ)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="caption-select" className="block text-sm font-semibold text-slate-900">
              Caption Locket Gold (từ forceGold4.3.js)
            </label>
            <select
              id="caption-select"
              value={selectedCaptionId}
              onChange={(e) => setSelectedCaptionId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            >
              {LOCKET_CAPTIONS.map((cap) => (
                <option key={cap.id} value={cap.id}>
                  {cap.emoji} {cap.text} — ({cap.section})
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              {errorMsg}
            </div>
          )}

          <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {sourceImageDataUrl
                ? 'Đang bật chế độ Img2Img: áp dụng Filter Locket trực tiếp lên ảnh gốc.'
                : 'Hỗ trợ cả dùng thẳng Filter trong app Locket qua Shadowrocket MITM.'}
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Đang xử lý AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{sourceImageDataUrl ? 'Áp Filter lên ảnh' : 'Tạo ảnh AI'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Preview Column */}
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Xem trước khung Locket Gold
            </h2>
            {activePhoto && (
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {activePhoto.width}×{activePhoto.height} · {activePhoto.latencyMs}ms
              </span>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-[360px] aspect-square rounded-[32px] overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-slate-300 px-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" aria-hidden="true" />
                <p className="text-sm font-medium text-white">Đang xử lý ảnh trên server miễn phí...</p>
                <p className="text-xs text-slate-400">Thường mất 3–15 giây</p>
              </div>
            ) : activePhoto ? (
              <img
                src={activePhoto.imageDataUrl}
                alt={activePhoto.prompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-amber-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">Chưa có ảnh nào được tạo</p>
                  <p className="text-xs text-slate-400">
                    Chọn Filter Locket hoặc nhập mô tả ở cột bên trái để thử tạo ảnh / áp filter miễn phí.
                  </p>
                </div>
              </div>
            )}

            {selectedCaption.id !== 'none' && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[88%] px-4 py-1.5 rounded-full text-xs font-semibold shadow-md whitespace-nowrap truncate"
                style={{
                  background: `linear-gradient(90deg, ${selectedCaption.colors[0]}, ${selectedCaption.colors[1]}, ${selectedCaption.colors[2]})`,
                  color: selectedCaption.textColor,
                }}
              >
                {selectedCaption.emoji} {selectedCaption.text}
              </div>
            )}
          </div>

          {activePhoto?.notice && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {activePhoto.notice}
            </div>
          )}

          {activePhoto && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Provider: {activePhoto.provider}</span>
                {activePhoto.filterId && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Filter: {activePhoto.filterId}</span>
                  </>
                )}
                {activePhoto.img2img && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Img2Img</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activePhoto.aspectRatio}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadComposite}
                  disabled={downloading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{downloading ? 'Đang xuất PNG...' : 'Tải ảnh gắn Caption'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyEnhancedPrompt}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Chép Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated History Strip */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-slate-900">
            Lịch sử ảnh đã tạo ({history.length})
          </h2>
          <span className="text-xs text-slate-500">Bấm vào ảnh để xem lại và xuất file PNG</span>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">
            Chưa có ảnh nào trong phiên này. Ảnh tạo thành công sẽ hiển thị tại đây để bạn tải về bất cứ lúc nào.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {history.map((item) => {
              const isCurrent = activePhoto?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePhoto(item)}
                  className={`group text-left rounded-lg overflow-hidden border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                    isCurrent ? 'border-amber-600 ring-1 ring-amber-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageDataUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium text-slate-800 truncate">{item.prompt}</p>
                    <p className="text-[11px] text-slate-500 tabular-nums mt-0.5 truncate">
                      {item.filterId ? `${item.filterId} · ` : ''}{item.provider} · {item.latencyMs}ms
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
