import React, { useEffect, useRef, useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode2, 
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeConfig, ImageFormat } from '../types';
import { 
  renderQrToCanvas, 
  exportQRCode, 
  copyQrToClipboard, 
  sanitizeUrl, 
  extractDomainForFilename 
} from '../utils/qrUtils';

interface QrPreviewProps {
  config: QRCodeConfig;
  onDownloadSuccess?: () => void;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ config, onDownloadSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png');
  const [lastDownloadedFile, setLastDownloadedFile] = useState<string | null>(null);

  // Redraw preview whenever config changes
  useEffect(() => {
    if (canvasRef.current) {
      renderQrToCanvas(canvasRef.current, config, 800);
    }
  }, [config]);

  const handleDownload = async (format: ImageFormat = selectedFormat) => {
    setIsExporting(true);
    try {
      const result = await exportQRCode(config, format, config.resolution);
      if (result.success) {
        setLastDownloadedFile(result.filename);
        onDownloadSuccess?.();
        
        // Trigger celebratory confetti with cyan theme
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#00d1ff', '#0066ff', '#38bdf8', '#ffffff'],
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          setLastDownloadedFile(null);
        }, 4000);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    const success = await copyQrToClipboard(config);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = sanitizeUrl(config.url) || 'https://google.com';
  const displayDomain = extractDomainForFilename(config.url);

  // Scan distance calculation approximation based on 10:1 ratio for standard cameras
  const physicalSizeCm = config.resolution >= 2048 ? 10 : 6;
  const estimatedScanDistMeters = (physicalSizeCm * 0.1).toFixed(1);

  return (
    <div className="w-full bg-[#111111] rounded-2xl p-6 border border-white/10 shadow-xl shadow-black/40 flex flex-col items-center sticky top-20">
      {/* Top status bar */}
      <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00d1ff] shadow-[0_0_8px_#00d1ff]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Live Preview
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#00d1ff] bg-[#00d1ff]/10 border border-[#00d1ff]/30 px-2 py-0.5 rounded-md">
          {config.resolution} × {config.resolution} px
        </span>
      </div>

      {/* QR Canvas Display Stage with Ambient Glow & Dot Grid */}
      <div className="relative group w-full p-6 sm:p-8 rounded-2xl bg-[#070707] border border-white/5 flex items-center justify-center overflow-hidden">
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient cyan glow */}
        <div className="absolute -inset-10 bg-[#00d1ff]/10 blur-3xl rounded-full pointer-events-none" />

        {/* Transparency checker if transparent */}
        {config.isTransparentBg && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
              backgroundSize: '12px 12px',
            }}
          />
        )}

        <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
          <canvas
            ref={canvasRef}
            className="max-w-[260px] sm:max-w-[300px] max-h-[300px] w-auto h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Resolution & Clarity Indicator */}
      <div className="w-full mt-4 flex items-center justify-between text-xs text-gray-400 px-1">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          Target: <strong className="text-gray-200 truncate max-w-[140px] font-mono">{displayDomain}</strong>
        </span>
        <a
          href={encodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00d1ff] hover:text-[#00d1ff]/80 font-semibold flex items-center gap-1 transition-colors"
        >
          Test link <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Primary Instant Download Button */}
      <div className="w-full mt-5 space-y-2.5">
        <button
          id="primary-download-btn"
          type="button"
          disabled={isExporting}
          onClick={() => handleDownload(selectedFormat)}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00d1ff] to-[#0066ff] text-black font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,209,255,0.25)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>
            {isExporting
              ? 'Generating High-Res Image...'
              : `Download ${selectedFormat.toUpperCase()} (${config.resolution}px)`}
          </span>
        </button>

        {/* Format Selector */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#070707] rounded-xl border border-white/10">
          {(['png', 'svg', 'jpeg', 'webp'] as ImageFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => {
                setSelectedFormat(fmt);
                handleDownload(fmt);
              }}
              className={`py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                selectedFormat === fmt
                  ? 'bg-[#1a1a1a] text-[#00d1ff] border border-[#00d1ff]/40 shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Instant Vector SVG Button */}
          <button
            id="download-svg-btn"
            type="button"
            onClick={() => handleDownload('svg')}
            className="w-full py-2.5 px-3 rounded-xl bg-[#161616] hover:bg-[#202020] text-gray-200 text-xs font-semibold border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#00d1ff]" />
            <span>Vector SVG</span>
          </button>

          {/* Copy Image Button */}
          <button
            id="copy-image-btn"
            type="button"
            onClick={handleCopyImage}
            className="w-full py-2.5 px-3 rounded-xl bg-[#161616] hover:bg-[#202020] text-gray-200 text-xs font-semibold border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied PNG!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                <span>Copy Image</span>
              </>
            )}
          </button>
        </div>

        {/* Download Success Notice */}
        {lastDownloadedFile && (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Exported <strong>{lastDownloadedFile}</strong></span>
            </span>
          </div>
        )}
      </div>

      {/* Scan Distance & Print Specs Guide */}
      <div className="w-full mt-5 pt-4 border-t border-white/5 text-[11px] text-gray-400 space-y-1.5">
        <div className="flex justify-between font-medium">
          <span>Print Resolution:</span>
          <span className="text-gray-200 font-semibold">
            {config.resolution >= 2048 ? '300 DPI Ultra Sharp' : 'Standard Web (72 DPI)'}
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Estimated Scan Range:</span>
          <span className="text-gray-200 font-semibold">~{estimatedScanDistMeters} meters / 10x ratio</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Vector Precision:</span>
          <span className="text-[#00d1ff] font-semibold">Lossless (Infinite Scaling)</span>
        </div>
      </div>
    </div>
  );
};

