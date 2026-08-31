import React from 'react';
import { QrCode, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00d1ff] to-[#0066ff] flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,209,255,0.25)]">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans">
                QR<span className="text-[#00d1ff]">STUDIO</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30">
                Ultra-HD 4K
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              High-resolution vector & raster QR code generator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="hidden md:flex items-center space-x-4 text-gray-400 font-medium">
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d1ff]" /> Vector SVG
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d1ff]" /> 300 DPI Print
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d1ff]" /> Instant Download
            </span>
          </div>
          <div className="px-3 py-1 rounded-full text-[11px] font-semibold border border-white/10 bg-white/5 text-gray-300 hidden sm:block">
            READY
          </div>
        </div>
      </div>
    </header>
  );
};

