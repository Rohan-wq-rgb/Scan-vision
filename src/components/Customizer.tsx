import React, { useRef } from 'react';
import { 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Sliders, 
  Type, 
  Upload, 
  Trash2, 
  Maximize2,
  ShieldCheck,
  Grid,
  RotateCcw
} from 'lucide-react';
import { QRCodeConfig, ResolutionSize, ErrorCorrectionLevel, FrameStyle } from '../types';
import { COLOR_PRESETS, ICON_PRESETS, createEmojiLogoDataUrl } from '../utils/qrUtils';

interface CustomizerProps {
  config: QRCodeConfig;
  onChange: (newConfig: Partial<QRCodeConfig>) => void;
}

export const Customizer: React.FC<CustomizerProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            logoDataUrl: event.target.result as string,
            errorCorrectionLevel: 'H', // Ensure maximum error correction for custom logo
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectIconPreset = (iconEmoji: string) => {
    const dataUrl = createEmojiLogoDataUrl(iconEmoji);
    onChange({
      logoDataUrl: dataUrl,
      errorCorrectionLevel: 'H',
    });
  };

  const handleRemoveLogo = () => {
    onChange({ logoDataUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    onChange({
      fgColor: '#ffffff',
      bgColor: '#000000',
      isTransparentBg: false,
      errorCorrectionLevel: 'M',
      margin: 2,
      resolution: 2048,
      logoDataUrl: null,
      frameStyle: 'none',
      frameText: 'SCAN ME',
      dotStyle: 'square',
    });
  };

  return (
    <div className="w-full bg-[#111111] rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/30 space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-[#00d1ff]" />
          Customization & Styling
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] text-[#00d1ff] hover:text-[#00d1ff]/80 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* 1. Color Palette */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#00d1ff]" />
            Color Palette
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.isTransparentBg}
              onChange={(e) => onChange({ isTransparentBg: e.target.checked })}
              className="rounded border-white/20 bg-[#070707] text-[#00d1ff] focus:ring-[#00d1ff] w-3.5 h-3.5"
            />
            <span>Transparent BG</span>
          </label>
        </div>

        {/* Preset swatches */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = config.fgColor === preset.fg && config.bgColor === preset.bg && !config.isTransparentBg;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange({
                    fgColor: preset.fg,
                    bgColor: preset.bg,
                    isTransparentBg: false,
                  })
                }
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#00d1ff] bg-[#00d1ff]/10 ring-1 ring-[#00d1ff]/40 text-white'
                    : 'border-white/5 hover:border-white/20 bg-[#161616] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0 shadow-xs"
                  style={{
                    background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)`,
                  }}
                />
                <span className="text-[11px] font-medium truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom hex colors */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center space-x-2 bg-[#070707] p-2.5 rounded-xl border border-white/10">
            <input
              type="color"
              value={config.fgColor}
              onChange={(e) => onChange({ fgColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <div className="text-left flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Foreground</div>
              <div className="text-xs font-mono font-bold text-white truncate">{config.fgColor}</div>
            </div>
          </div>

          <div
            className={`flex items-center space-x-2 bg-[#070707] p-2.5 rounded-xl border border-white/10 ${
              config.isTransparentBg ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <input
              type="color"
              value={config.bgColor}
              disabled={config.isTransparentBg}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <div className="text-left flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Background</div>
              <div className="text-xs font-mono font-bold text-white truncate">
                {config.isTransparentBg ? 'Transparent' : config.bgColor}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Module / Dot Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5 text-[#00d1ff]" />
          Pattern Module Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'square', label: 'Classic Square', desc: 'High contrast standard' },
            { id: 'rounded', label: 'Smooth Rounded', desc: 'Modern refined feel' },
            { id: 'dots', label: 'Circular Dots', desc: 'Contemporary aesthetic' },
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ dotStyle: style.id as 'square' | 'rounded' | 'dots' })}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                config.dotStyle === style.id
                  ? 'border-[#00d1ff] bg-[#00d1ff]/10 ring-1 ring-[#00d1ff]/40 text-white'
                  : 'border-white/5 hover:border-white/20 bg-[#161616] text-gray-400'
              }`}
            >
              <div className={`text-xs font-bold ${config.dotStyle === style.id ? 'text-[#00d1ff]' : 'text-gray-200'}`}>
                {style.label}
              </div>
              <div className="text-[10px] text-gray-500">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Center Logo / Icon Embed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#00d1ff]" />
            Center Brand Icon or Logo
          </label>
          {config.logoDataUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
        </div>

        {/* Preset Icons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ICON_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectIconPreset(item.icon)}
              className="w-9 h-9 rounded-xl bg-[#161616] hover:bg-[#202020] hover:border-[#00d1ff]/40 border border-white/5 flex items-center justify-center text-base transition-all active:scale-95"
              title={`Use ${item.name}`}
            >
              {item.icon}
            </button>
          ))}

          {/* Upload Custom Logo Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-[#00d1ff]/10 hover:bg-[#00d1ff]/20 text-[#00d1ff] font-semibold text-xs border border-[#00d1ff]/30 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 4. Frame & Banner Style */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[#00d1ff]" />
          Call-to-Action Frame Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'none', label: 'No Frame' },
            { id: 'scan-me', label: 'Scan Me Pill' },
            { id: 'visit-us', label: 'Visit Us Pill' },
            { id: 'minimal-card', label: 'Card Badge' },
          ].map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => onChange({ frameStyle: frame.id as FrameStyle })}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                config.frameStyle === frame.id
                  ? 'border-[#00d1ff] bg-[#00d1ff]/10 text-[#00d1ff] ring-1 ring-[#00d1ff]/40'
                  : 'border-white/5 hover:border-white/20 text-gray-400 bg-[#161616]'
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>

        {config.frameStyle !== 'none' && (
          <div className="pt-1">
            <input
              type="text"
              value={config.frameText}
              onChange={(e) => onChange({ frameText: e.target.value })}
              placeholder="e.g. SCAN ME or VISIT OUR STORE"
              className="w-full px-3 py-2 text-xs bg-[#070707] border border-white/10 rounded-lg text-white placeholder:text-gray-600 font-medium focus:outline-none focus:border-[#00d1ff]/50"
              maxLength={24}
            />
          </div>
        )}
      </div>

      {/* 5. Resolution & Technical Fine-Tuning */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
        {/* Export Resolution */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-[#00d1ff]" />
            Download Quality
          </label>
          <select
            value={config.resolution}
            onChange={(e) => onChange({ resolution: Number(e.target.value) as ResolutionSize })}
            className="w-full px-2.5 py-2 text-xs font-semibold bg-[#070707] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-[#00d1ff]/50"
          >
            <option value={512}>512 × 512 px (Fast Web)</option>
            <option value={1024}>1024 × 1024 px (HD Screen)</option>
            <option value={2048}>2048 × 2048 px (2K Ultra HD)</option>
            <option value={4096}>4096 × 4096 px (4K Print 300 DPI)</option>
          </select>
        </div>

        {/* Error Correction */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#00d1ff]" />
            Error Correction
          </label>
          <select
            value={config.errorCorrectionLevel}
            disabled={!!config.logoDataUrl}
            onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
            className="w-full px-2.5 py-2 text-xs font-semibold bg-[#070707] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-[#00d1ff]/50 disabled:opacity-50"
          >
            <option value="L">L (7% Recovery - Fast)</option>
            <option value="M">M (15% Recovery - Standard)</option>
            <option value="Q">Q (25% Recovery - High)</option>
            <option value="H">H (30% Recovery - Ultra Resilient)</option>
          </select>
        </div>

        {/* Quiet Zone Margin */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Margin ({config.margin} blocks)
            </label>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            value={config.margin}
            onChange={(e) => onChange({ margin: Number(e.target.value) })}
            className="w-full accent-[#00d1ff] cursor-pointer mt-1"
          />
        </div>
      </div>
    </div>
  );
};

