import { Activity, CloudUpload, ImagePlus, ShieldCheck } from 'lucide-react';
import type { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  generatedCount: number;
}

const NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  icon: typeof ImagePlus;
}> = [
  { id: 'studio', label: 'Tạo ảnh AI', icon: ImagePlus },
  { id: 'mitm', label: 'Shadowrocket MITM', icon: ShieldCheck },
  { id: 'logs', label: 'API & Nhật ký', icon: Activity },
  { id: 'deploy', label: 'Deploy Miễn Phí', icon: CloudUpload },
];

export function Sidebar({ activeTab, onSelectTab, generatedCount }: SidebarProps) {
  return (
    <aside className="w-full lg:w-60 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col justify-between">
      <div>
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between lg:block">
          <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Locket AI Server
          </span>
          <span className="lg:hidden text-xs text-slate-500 tabular-nums">
            {generatedCount} ảnh
          </span>
        </div>

        <nav aria-label="Điều hướng chính" className="p-3 grid grid-cols-2 sm:flex lg:flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-700' : 'text-slate-500'}`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:block p-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
        <div className="flex items-center justify-between">
          <span>Chế độ chi phí</span>
          <span className="font-medium text-emerald-700">0đ · Miễn phí</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Ảnh đã tạo phiên này</span>
          <span className="font-mono font-medium text-slate-900 tabular-nums">
            {generatedCount}
          </span>
        </div>
      </div>
    </aside>
  );
}
