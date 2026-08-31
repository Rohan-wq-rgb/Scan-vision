import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeConfig, GeneratedQrHistoryItem } from './types';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { Customizer } from './components/Customizer';
import { QrPreview } from './components/QrPreview';
import { RecentHistory } from './components/RecentHistory';

const INITIAL_CONFIG: QRCodeConfig = {
  url: 'https://google.com',
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  isTransparentBg: false,
  errorCorrectionLevel: 'M',
  margin: 2,
  resolution: 2048, // Default to 2K Ultra HD for high resolution
  logoDataUrl: null,
  logoSizePercent: 22,
  frameStyle: 'none',
  frameText: 'SCAN ME',
  dotStyle: 'square',
};

const STORAGE_KEY_HISTORY = 'qr_generator_history_v1';

export default function App() {
  const [config, setConfig] = useState<QRCodeConfig>(INITIAL_CONFIG);
  const [history, setHistory] = useState<GeneratedQrHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history', e);
    }
  }, []);

  const saveToHistory = useCallback((currentConfig: QRCodeConfig) => {
    if (!currentConfig.url.trim()) return;

    setHistory((prev) => {
      // Filter out duplicate url if in top
      const filtered = prev.filter((item) => item.url !== currentConfig.url);
      const newItem: GeneratedQrHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: currentConfig.url,
        timestamp: Date.now(),
        config: { ...currentConfig },
      };
      const updated = [newItem, ...filtered].slice(0, 12);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist history', e);
      }
      return updated;
    });
  }, []);

  const handleUrlChange = (newUrl: string) => {
    setConfig((prev) => ({ ...prev, url: newUrl }));
  };

  const handleConfigChange = (partial: Partial<QRCodeConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectHistoryItem = (item: GeneratedQrHistoryItem) => {
    setConfig(item.config);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-sans selection:bg-[#00d1ff]/20 selection:text-[#00d1ff]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Main 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: URL Input & Customization Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <UrlInput url={config.url} onChange={handleUrlChange} />

            <Customizer config={config} onChange={handleConfigChange} />
          </div>

          {/* Right Column: Live High-Res QR Preview & Download Panel (5 cols) */}
          <div className="lg:col-span-5">
            <QrPreview
              config={config}
              onDownloadSuccess={() => saveToHistory(config)}
            />
          </div>
        </div>

        {/* Recent History Section */}
        <RecentHistory
          history={history}
          onSelect={handleSelectHistoryItem}
          onClear={handleClearHistory}
        />
      </main>

      {/* Minimal Elegant Dark Footer */}
      <footer className="w-full border-t border-white/5 bg-[#0a0a0a] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">QR STUDIO</span>
            <span>•</span>
            <span>High-Resolution QR Generator</span>
            <span>•</span>
            <span className="text-[#00d1ff]/80">4K Ultra-HD & Vector Lossless</span>
          </div>
          <div className="text-gray-500">
            Instant client-side rendering • 100% private & secure
          </div>
        </div>
      </footer>
    </div>
  );
}
