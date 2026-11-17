import { useState } from 'react';
import { AiStudioView } from './components/AiStudioView';
import { ApiLogsView } from './components/ApiLogsView';
import { DeployGuideView } from './components/DeployGuideView';
import { MitmConfigView } from './components/MitmConfigView';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import type { AppTab, GeneratedPhotoItem } from './types';
import {
  generateMergedLocketConf,
  normalizeServerUrl,
  type ProxyClient,
} from './utils/locketConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [history, setHistory] = useState<GeneratedPhotoItem[]>([]);
  const [serverUrl, setServerUrl] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  );
  const [proxyClient, setProxyClient] = useState<ProxyClient>('shadowrocket');

  function handleImageGenerated(item: GeneratedPhotoItem) {
    setHistory((prev) => [item, ...prev].slice(0, 20));
  }

  function handleDownloadConf() {
    const conf = generateMergedLocketConf(normalizeServerUrl(serverUrl), proxyClient, {
      includeYoutubeAdblock: true,
      includeGoldUnlock: true,
      usePatchedForceGold: true,
      aiScriptUrl: '',
    });
    const blob = new Blob([conf], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Locket_AI_Free.conf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        generatedCount={history.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activeTab={activeTab} onDownloadConf={handleDownloadConf} />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          {activeTab === 'studio' && (
            <AiStudioView history={history} onImageGenerated={handleImageGenerated} />
          )}
          {activeTab === 'mitm' && (
            <MitmConfigView
              serverUrl={serverUrl}
              onServerUrlChange={setServerUrl}
              client={proxyClient}
              onClientChange={setProxyClient}
            />
          )}
          {activeTab === 'logs' && <ApiLogsView />}
          {activeTab === 'deploy' && <DeployGuideView />}
        </main>
      </div>
    </div>
  );
}
