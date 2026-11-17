import { Download } from 'lucide-react';
import type { AppTab } from '../types';

interface TopBarProps {
  activeTab: AppTab;
  onDownloadConf: () => void;
}

const TAB_TITLES: Record<AppTab, string> = {
  studio: 'Xưởng tạo ảnh AI & Xem trước Locket',
  mitm: 'Cấu hình Shadowrocket & MITM Script',
  logs: 'Kiểm tra Endpoint & Nhật ký Server',
  deploy: 'Deploy Server Miễn Phí',
};

export function TopBar({ activeTab, onDownloadConf }: TopBarProps) {
  return (
    <header className="h-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between gap-3 sm:gap-8 shrink-0">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-slate-500 whitespace-nowrap hidden sm:inline">Locket Gold</span>
        <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
        <h1 className="font-display font-semibold text-slate-900 truncate">
          {TAB_TITLES[activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onDownloadConf}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tải Locket.conf</span>
        </button>
      </div>
    </header>
  );
}
