import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Download,
  ImagePlus,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  SwitchCamera,
  X,
} from 'lucide-react';
import {
  AI_STYLE_PRESETS,
  decodeJwtUserId,
  LOCKET_FILTERS,
  type FreeAiModel,
  type LocketFilterPreset,
} from '../utils/locketConfig';

const CATEGORY_TABS = [
  'Tất cả',
  'Events',
  'Goofy',
  'Looks',
  'Celebrate',
  'Cute',
  'Costumes',
  'Holidays',
  'Photobooth',
  'Effects',
] as const;

function resizeImageFileToDataUrl(file: File, maxDim = 768): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (!src) {
        reject(new Error('Dữ liệu ảnh trống.'));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không hợp lệ.'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function FilterStudioView() {
  const [sourceDataUrl, setSourceDataUrl] = useState<string>('');
  const [resultDataUrl, setResultDataUrl] = useState<string>('');
  const [resultProvider, setResultProvider] = useState<string>('');
  const [resultNotice, setResultNotice] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'after' | 'before'>('after');

  const [selectedFilterId, setSelectedFilterId] = useState<string>('flower_crown');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [styleId, setStyleId] = useState<string>('natural');
  const [model, setModel] = useState<FreeAiModel>('flux');

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Direct post to Locket state
  const [showPostPanel, setShowPostPanel] = useState(false);
  const [idToken, setIdToken] = useState<string>('');
  const [showToken, setShowToken] = useState(false);
  const [momentCaption, setMomentCaption] = useState<string>('');
  const [audience, setAudience] = useState<'all' | 'private'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [postFeedback, setPostFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const decodedUid = useMemo(() => decodeJwtUserId(idToken), [idToken]);

  const selectableFilters = useMemo<LocketFilterPreset[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return LOCKET_FILTERS.filter((item) => {
      if (activeCategory !== 'Tất cả' && item.category !== activeCategory) {
        return false;
      }
      if (q) {
        return (
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const activeFilter = useMemo(
    () => LOCKET_FILTERS.find((f) => f.id === selectedFilterId) || LOCKET_FILTERS[0],
    [selectedFilterId]
  );

  function stopCamera() {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera(nextFacing: 'user' | 'environment' = facingMode) {
    setErrorMsg('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Trình duyệt không hỗ trợ Camera trực tiếp. Vui lòng bấm "Tải ảnh lên".');
      return;
    }
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1024 }, height: { ideal: 1024 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setFacingMode(nextFacing);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setErrorMsg('Không mở được Camera (chưa cấp quyền hoặc không tìm thấy thiết bị). Bạn có thể tải ảnh lên.');
    }
  }

  function handleCaptureFromCamera() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setErrorMsg('Camera chưa sẵn sàng, vui lòng chờ thêm 1 giây.');
      return;
    }
    const size = Math.min(video.videoWidth, video.videoHeight, 768);
    const sx = Math.max(0, (video.videoWidth - Math.min(video.videoWidth, video.videoHeight)) / 2);
    const sy = Math.max(0, (video.videoHeight - Math.min(video.videoWidth, video.videoHeight)) / 2);
    const side = Math.min(video.videoWidth, video.videoHeight);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, side, side, 0, 0, size, size);
    const captured = canvas.toDataURL('image/jpeg', 0.9);
    setSourceDataUrl(captured);
    setResultDataUrl('');
    setResultNotice('');
    setPostFeedback(null);
    stopCamera();
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    try {
      const resized = await resizeImageFileToDataUrl(file, 768);
      stopCamera();
      setSourceDataUrl(resized);
      setResultDataUrl('');
      setResultNotice('');
      setPostFeedback(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể đọc tệp ảnh.');
    } finally {
      e.target.value = '';
    }
  }

  async function handleGenerateAiPhoto() {
    setErrorMsg('');
    setPostFeedback(null);

    if (!sourceDataUrl) {
      setErrorMsg('Vui lòng chụp ảnh từ Camera hoặc tải ảnh lên trước khi tạo AI Filter.');
      return;
    }
    if (selectedFilterId === 'none' && !customPrompt.trim()) {
      setErrorMsg('Vui lòng chọn ít nhất một Filter Locket hoặc nhập mô tả ở mục "Tạo diện mạo".');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/generateFilteredImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter_id: selectedFilterId,
          prompt: customPrompt.trim(),
          style: styleId,
          model,
          aspect_ratio: '1:1',
          image_base64: sourceDataUrl,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        success?: boolean;
        imageDataUrl?: string;
        provider?: string;
        notice?: string;
        error?: string;
      };
      if (!res.ok || (!json.ok && !json.success) || !json.imageDataUrl) {
        throw new Error(json.error || `Server trả về lỗi HTTP ${res.status}`);
      }
      setResultDataUrl(json.imageDataUrl);
      setResultProvider(json.provider || 'ai-filter');
      setResultNotice(json.notice || '');
      setPreviewMode('after');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tạo ảnh AI lúc này.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handlePostToLocket() {
    setPostFeedback(null);
    const imageToPost = resultDataUrl || sourceDataUrl;
    if (!imageToPost) {
      setPostFeedback({ ok: false, text: 'Chưa có ảnh để đăng lên Locket.' });
      return;
    }
    if (!idToken.trim()) {
      setPostFeedback({ ok: false, text: 'Vui lòng dán Firebase ID Token của tài khoản Locket.' });
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch('/api/locket/post-moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUrl: imageToPost,
          idToken: idToken.trim(),
          caption: momentCaption.trim(),
          audience,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; success?: boolean; error?: string; userId?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Lỗi đăng bài HTTP ${res.status}`);
      }
      setPostFeedback({
        ok: true,
        text: `Đã đăng lên Locket thành công (UID: ${json.userId || decodedUid}).`,
      });
    } catch (err) {
      setPostFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Đăng lên Locket thất bại.',
      });
    } finally {
      setIsPosting(false);
    }
  }

  const displayedImage =
    resultDataUrl && previewMode === 'after' ? resultDataUrl : sourceDataUrl;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Filter AI & Photobooth trực tiếp (Mô hình Locket Dio · 0đ)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            36 filter gốc của Locket kèm Photobooth 4-Cut & &ldquo;Tạo diện mạo&rdquo; tùy chỉnh. Không paywall VIP, chạy Img2Img giữ nguyên góc mặt và bối cảnh.
          </p>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap shrink-0 tabular-nums">
          <span>{LOCKET_FILTERS.length - 1} filter có sẵn</span>
          <span aria-hidden="true" className="mx-1.5">·</span>
          <span className="text-emerald-700 font-medium">Mở khóa 100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Locket Square Frame + Controls + Post to Locket */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">
                Khung ảnh Locket (1:1)
              </span>
              {resultDataUrl && sourceDataUrl ? (
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('before')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      previewMode === 'before'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ảnh gốc
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('after')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      previewMode === 'after'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ảnh AI
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 truncate max-w-[180px]">
                  {activeFilter.id === 'none' ? 'Chỉ mô tả tự do' : activeFilter.label}
                </span>
              )}
            </div>

            {/* Square 1:1 Viewport */}
            <div
              data-testid="locket-preview-frame"
              className="relative aspect-square w-full max-w-[420px] mx-auto rounded-[28px] overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center"
            >
              {cameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />
              ) : displayedImage ? (
                <img
                  src={displayedImage}
                  alt={resultDataUrl && previewMode === 'after' ? 'Ảnh đã áp dụng Filter AI' : 'Ảnh gốc'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="px-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                    <Camera className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-slate-100">Chưa có ảnh đầu vào</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bật Camera để chụp selfie hoặc tải ảnh từ máy lên để áp dụng Filter AI.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white px-4 text-center">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-400" aria-hidden="true" />
                  <p className="text-sm font-semibold">Đang biến hình Img2Img...</p>
                  <p className="text-xs text-slate-300">
                    AI Horde miễn phí xử lý giữ nguyên khuôn mặt &amp; nền (5–18 giây)
                  </p>
                </div>
              )}

              {sourceDataUrl && !cameraActive && !isGenerating && (
                <button
                  type="button"
                  aria-label="Xóa ảnh hiện tại"
                  onClick={() => {
                    setSourceDataUrl('');
                    setResultDataUrl('');
                    setResultNotice('');
                    setPostFeedback(null);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-950/75 text-white hover:bg-slate-900 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Camera / Upload buttons */}
            <input
              ref={fileInputRef}
              id="locket-photo-upload"
              type="file"
              accept="image/*"
              tabIndex={-1}
              aria-hidden="true"
              onChange={handleFileSelect}
              className="hidden"
            />

            {cameraActive ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCaptureFromCamera}
                  className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  <span>Chụp ảnh ngay</span>
                </button>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Đổi camera trước/sau"
                    onClick={() => startCamera(facingMode === 'user' ? 'environment' : 'user')}
                    className="flex-1 inline-flex items-center justify-center px-2 py-2.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <SwitchCamera className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Tắt camera"
                    onClick={stopCamera}
                    className="flex-1 inline-flex items-center justify-center px-2 py-2.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => startCamera('user')}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <Camera className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  <span>Bật Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <ImagePlus className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  <span>Tải ảnh lên</span>
                </button>
              </div>
            )}

            {/* Primary Generate CTA */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAiPhoto}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Đang tạo ảnh AI Filter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Tạo ảnh AI Filter (0đ)</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 leading-relaxed"
              >
                {errorMsg}
              </div>
            )}

            {resultNotice && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 leading-relaxed">
                {resultNotice}
              </div>
            )}

            {resultDataUrl && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono truncate max-w-[180px]">
                  {resultProvider}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiPhoto}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tạo lại</span>
                  </button>
                  <a
                    href={resultDataUrl}
                    download={`locket-ai-${selectedFilterId || 'custom'}.jpg`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tải ảnh về</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Direct Post to Locket Section (locket-dio postMomentV2 flow) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              aria-expanded={showPostPanel}
              onClick={() => setShowPostPanel((prev) => !prev)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  Đăng thẳng lên Locket (postMomentV2)
                </span>
                <span className="text-xs text-slate-500">
                  Dùng Firebase ID Token để đẩy ảnh lên Locket như locket-dio
                </span>
              </div>
              {showPostPanel ? (
                <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
              )}
            </button>

            {showPostPanel && (
              <div className="p-4 pt-2 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="locket-id-token" className="text-xs font-medium text-slate-700">
                      Firebase ID Token
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      {decodedUid && (
                        <span className="font-mono text-emerald-700">UID: {decodedUid.slice(0, 12)}...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowToken((v) => !v)}
                        className="text-slate-500 hover:text-slate-800 underline"
                      >
                        {showToken ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </div>
                  <input
                    id="locket-id-token"
                    type={showToken ? 'text' : 'password'}
                    value={idToken}
                    onChange={(e) => setIdToken(e.target.value)}
                    placeholder="Dán eyJhbGciOi... từ tài khoản Locket của bạn"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="locket-moment-caption" className="text-xs font-medium text-slate-700">
                    Caption kèm ảnh (tùy chọn)
                  </label>
                  <input
                    id="locket-moment-caption"
                    type="text"
                    value={momentCaption}
                    onChange={(e) => setMomentCaption(e.target.value)}
                    placeholder="Ví dụ: Đi chơi cuối tuần"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-700">Người nhận</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAudience('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        audience === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Tất cả bạn bè
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudience('private')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        audience === 'private' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Chỉ mình tôi
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPosting}
                  onClick={handlePostToLocket}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Đang tải lên Locket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Đăng lên Locket ngay</span>
                    </>
                  )}
                </button>

                {postFeedback && (
                  <div
                    role="status"
                    className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                      postFeedback.ok
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {postFeedback.text}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Custom Look Prompt + Official Locket Filter Sticker Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Custom "Tạo diện mạo" Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="custom-look-prompt" className="text-sm font-semibold text-slate-900">
                ✨ Tạo diện mạo (Prompt tự do + kết hợp Filter)
              </label>
              <span className="text-xs text-slate-500">Hỗ trợ tiếng Việt tự động dịch</span>
            </div>

            <textarea
              id="custom-look-prompt"
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Mô tả phong cách riêng: ví dụ đeo kính râm neon, tóc hồng pastel, ánh nắng hoàng hôn..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="ai-style-select" className="text-xs font-medium text-slate-600">
                  Phong cách màu ảnh
                </label>
                <select
                  id="ai-style-select"
                  value={styleId}
                  onChange={(e) => {
                    setStyleId(e.target.value);
                    const matched = AI_STYLE_PRESETS.find((s) => s.id === e.target.value);
                    if (matched) setModel(matched.recommendedModel);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {AI_STYLE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="ai-model-select" className="text-xs font-medium text-slate-600">
                  Mô hình Fallback (khi Img2Img bận)
                </label>
                <select
                  id="ai-model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value as FreeAiModel)}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="flux">Flux (Chi tiết chân thực)</option>
                  <option value="turbo">Turbo (Nhanh)</option>
                  <option value="anime">Anime (Nét vẽ 2D)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Sticker Catalog */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Bộ sưu tập Filter &amp; Photobooth ({selectableFilters.filter((f) => f.id !== 'none').length})
                </h3>
                <p className="text-xs text-slate-500">
                  Sticker và prompt chi tiết chuẩn từ Locket Dio
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search
                  className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Tìm kiếm filter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm filter..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Danh mục Filter"
              className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg"
            >
              {CATEGORY_TABS.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sticker Tile Grid */}
            {selectableFilters.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 space-y-2">
                <p>Không tìm thấy filter nào khớp &ldquo;{searchQuery}&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Tất cả');
                  }}
                  className="text-amber-700 font-medium underline"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div
                data-testid="filter-sticker-grid"
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[540px] overflow-y-auto pr-1"
              >
                {selectableFilters.map((preset) => {
                  const isSelected = selectedFilterId === preset.id;
                  const showStickerImg = Boolean(preset.iconUrl && !brokenIcons[preset.id]);
                  const initials = preset.label
                    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase() || '')
                    .join('');

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedFilterId(preset.id)}
                      className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/25'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {showStickerImg ? (
                          <img
                            src={preset.iconUrl}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={() =>
                              setBrokenIcons((prev) => ({ ...prev, [preset.id]: true }))
                            }
                            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="font-display text-sm font-bold text-slate-600">
                            {initials || 'AI'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-800 leading-tight line-clamp-2 w-full">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
