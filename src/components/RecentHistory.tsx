import React from 'react';
import { History, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import { GeneratedQrHistoryItem, QRCodeConfig } from '../types';
import { extractDomainForFilename } from '../utils/qrUtils';

interface RecentHistoryProps {
  history: GeneratedQrHistoryItem[];
  onSelect: (item: GeneratedQrHistoryItem) => void;
  onClear: () => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full bg-[#111111] rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/30 space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-[#00d1ff]" />
          Recent Generated QR Codes ({history.length})
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {history.slice(0, 6).map((item) => {
          const domain = extractDomainForFilename(item.url);
          const timeAgo = formatTimeAgo(item.timestamp);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 hover:border-[#00d1ff]/40 text-left transition-all group"
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-xs font-bold text-gray-200 truncate group-hover:text-[#00d1ff] transition-colors">
                  {domain}
                </div>
                <div className="text-[11px] text-gray-500 font-mono truncate">{item.url}</div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {timeAgo} • {item.config.resolution}px
                </div>
              </div>
              <div className="w-6 h-6 rounded-lg bg-[#070707] group-hover:bg-[#00d1ff] text-gray-500 group-hover:text-black flex items-center justify-center transition-all border border-white/10 group-hover:border-[#00d1ff]">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
