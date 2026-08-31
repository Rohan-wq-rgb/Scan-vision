import React, { useState } from 'react';
import { Link2, Clipboard, X, Check, Globe2 } from 'lucide-react';
import { SAMPLE_URLS, sanitizeUrl } from '../utils/qrUtils';

interface UrlInputProps {
  url: string;
  onChange: (url: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, onChange }) => {
  const [pasted, setPasted] = useState(false);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text.trim());
          setPasted(true);
          setTimeout(() => setPasted(false), 1800);
        }
      }
    } catch {
      // Fallback if clipboard API permission denied
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const formattedUrl = sanitizeUrl(url);
  const isValid = url.trim().length > 0;

  return (
    <div className="w-full bg-[#111111] rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/30 space-y-3.5">
      <div className="flex items-center justify-between">
        <label htmlFor="url-input" className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#00d1ff]" />
          Target Destination URL
        </label>
        {isValid && (
          <span className="text-xs font-mono text-gray-400 bg-[#1a1a1a] border border-white/5 px-2 py-0.5 rounded-md">
            {url.length} chars
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center">
          <Globe2 className="w-5 h-5 text-[#00d1ff]/70" />
        </div>

        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. https://portfolio.design/vision-2026"
          className="w-full pl-11 pr-24 py-3.5 bg-[#070707] border border-white/10 rounded-xl text-white placeholder:text-gray-600 font-mono text-sm focus:outline-none focus:border-[#00d1ff]/60 focus:ring-1 focus:ring-[#00d1ff]/30 transition-all"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          {url && (
            <button
              id="clear-url-btn"
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            id="paste-url-btn"
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#00d1ff] bg-[#00d1ff]/10 hover:bg-[#00d1ff]/20 rounded-lg transition-colors border border-[#00d1ff]/30"
            title="Paste from clipboard"
          >
            {pasted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Pasted!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target URL Preview & Quick Sample Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-gray-500">Quick Samples:</span>
          {SAMPLE_URLS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => onChange(sample.url)}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-[#202020] hover:border-[#00d1ff]/40 hover:text-[#00d1ff] text-gray-400 font-medium transition-colors border border-white/5"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {isValid && (
          <div className="flex items-center text-xs text-gray-400 font-mono truncate max-w-full">
            <span className="text-gray-600 mr-1.5">Encodes:</span>
            <span className="text-[#00d1ff] font-semibold truncate">{formattedUrl}</span>
          </div>
        )}
      </div>
    </div>
  );
};
