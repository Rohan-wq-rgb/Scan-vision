export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ResolutionSize = 512 | 1024 | 2048 | 4096;

export type ImageFormat = 'png' | 'svg' | 'jpeg' | 'webp';

export type FrameStyle = 'none' | 'scan-me' | 'visit-us' | 'minimal-card' | 'vintage-badge';

export interface ColorPreset {
  id: string;
  name: string;
  fg: string;
  bg: string;
  dark?: boolean;
}

export interface QRCodeConfig {
  url: string;
  fgColor: string;
  bgColor: string;
  isTransparentBg: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  resolution: ResolutionSize;
  logoDataUrl: string | null;
  logoSizePercent: number; // 10 to 30%
  frameStyle: FrameStyle;
  frameText: string;
  dotStyle: 'square' | 'rounded' | 'dots';
}

export interface GeneratedQrHistoryItem {
  id: string;
  url: string;
  timestamp: number;
  config: QRCodeConfig;
  previewDataUrl?: string;
}
