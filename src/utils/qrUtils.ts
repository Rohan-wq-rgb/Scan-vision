import QRCode from 'qrcode';
import { QRCodeConfig, ImageFormat } from '../types';

export const COLOR_PRESETS = [
  { id: 'classic', name: 'Classic Charcoal', fg: '#0f172a', bg: '#ffffff' },
  { id: 'midnight', name: 'Midnight Indigo', fg: '#312e81', bg: '#eef2ff' },
  { id: 'emerald', name: 'Forest Emerald', fg: '#064e3b', bg: '#ecfdf5' },
  { id: 'crimson', name: 'Velvet Crimson', fg: '#881337', bg: '#fff1f2' },
  { id: 'royal', name: 'Royal Sapphire', fg: '#1e3a8a', bg: '#f0f9ff' },
  { id: 'amber', name: 'Warm Amber', fg: '#78350f', bg: '#fffbeb' },
  { id: 'amethyst', name: 'Deep Amethyst', fg: '#581c87', bg: '#faf5ff' },
  { id: 'dark-neon', name: 'Cyber Dark', fg: '#38bdf8', bg: '#0f172a', dark: true },
  { id: 'monochrome-dark', name: 'Onyx Dark', fg: '#f8fafc', bg: '#090d16', dark: true },
];

export const ICON_PRESETS = [
  { id: 'globe', name: 'Globe / Web', icon: '🌐' },
  { id: 'link', name: 'Link', icon: '🔗' },
  { id: 'store', name: 'App / Store', icon: '🛍️' },
  { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'sparkles', name: 'Sparkles', icon: '✨' },
  { id: 'pin', name: 'Location', icon: '📍' },
  { id: 'mail', name: 'Mail / Contact', icon: '✉️' },
  { id: 'camera', name: 'Camera', icon: '📷' },
];

export const SAMPLE_URLS = [
  { label: 'Google', url: 'https://google.com' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Wikipedia', url: 'https://wikipedia.org' },
  { label: 'YouTube', url: 'https://youtube.com' },
  { label: 'Portfolio', url: 'https://myportfolio.design' },
];

export function sanitizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  // Check if starts with a scheme or standard protocol
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // If starts with mailto:, tel:, sms:, wifi: etc.
  if (/^(mailto:|tel:|sms:|wifi:|facetime:)/i.test(trimmed)) {
    return trimmed;
  }
  // Otherwise default to https://
  return `https://${trimmed}`;
}

export function extractDomainForFilename(rawUrl: string): string {
  try {
    const url = sanitizeUrl(rawUrl);
    const parsed = new URL(url);
    let host = parsed.hostname.replace(/^www\./, '');
    let pathname = parsed.pathname.replace(/\/$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
    let combined = `${host}${pathname ? '-' + pathname : ''}`.slice(0, 32);
    return combined.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase() || 'qrcode';
  } catch {
    return 'qrcode';
  }
}

/**
 * Draws the high resolution QR code on a Canvas element
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  config: QRCodeConfig,
  customResolution?: number
): Promise<void> {
  const targetResolution = customResolution || config.resolution;
  const urlToEncode = sanitizeUrl(config.url) || 'https://google.com';

  // Determine frame padding if framed
  const hasFrame = config.frameStyle !== 'none';
  let defaultFrameText = 'SCAN ME';
  if (config.frameStyle === 'visit-us') defaultFrameText = 'VISIT US';
  else if (config.frameStyle === 'minimal-card') defaultFrameText = 'SCAN TO OPEN';
  else if (config.frameStyle === 'vintage-badge') defaultFrameText = 'SCAN CODE';

  const frameText = config.frameText?.trim() || defaultFrameText;
  
  // Calculate sizing
  let canvasWidth = targetResolution;
  let canvasHeight = targetResolution;
  let qrOffsetY = 0;
  let qrSize = targetResolution;
  let bottomBannerHeight = 0;

  if (hasFrame) {
    if (config.frameStyle === 'scan-me' || config.frameStyle === 'visit-us') {
      bottomBannerHeight = Math.round(targetResolution * 0.16);
      canvasHeight = targetResolution + bottomBannerHeight;
      qrOffsetY = Math.round(targetResolution * 0.04);
      qrSize = targetResolution - Math.round(targetResolution * 0.08);
    } else if (config.frameStyle === 'minimal-card') {
      bottomBannerHeight = Math.round(targetResolution * 0.12);
      canvasHeight = targetResolution + bottomBannerHeight;
      qrOffsetY = Math.round(targetResolution * 0.05);
      qrSize = targetResolution - Math.round(targetResolution * 0.1);
    }
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Background
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (!config.isTransparentBg) {
    ctx.fillStyle = config.bgColor;
    if (config.frameStyle === 'minimal-card') {
      // Rounded card background
      const radius = Math.round(targetResolution * 0.04);
      drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, radius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  // Generate QR Matrix using qrcode library
  const qrData = QRCode.create(urlToEncode, {
    errorCorrectionLevel: config.logoDataUrl ? 'H' : config.errorCorrectionLevel,
  });

  const moduleCount = qrData.modules.size;
  const marginBlocks = config.margin;
  const totalBlocks = moduleCount + marginBlocks * 2;
  const blockSize = qrSize / totalBlocks;
  const qrStartX = (canvasWidth - qrSize) / 2 + marginBlocks * blockSize;
  const qrStartY = qrOffsetY + marginBlocks * blockSize;

  // Set Foreground color
  ctx.fillStyle = config.fgColor;

  // Render Modules based on style
  if (config.dotStyle === 'square') {
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrData.modules.get(r, c)) {
          const x = qrStartX + c * blockSize;
          const y = qrStartY + r * blockSize;
          ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(blockSize), Math.ceil(blockSize));
        }
      }
    }
  } else if (config.dotStyle === 'rounded') {
    const radius = blockSize * 0.38;
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrData.modules.get(r, c)) {
          const x = qrStartX + c * blockSize;
          const y = qrStartY + r * blockSize;
          drawRoundedRect(ctx, x + blockSize * 0.05, y + blockSize * 0.05, blockSize * 0.9, blockSize * 0.9, radius);
          ctx.fill();
        }
      }
    }
  } else if (config.dotStyle === 'dots') {
    const dotRadius = (blockSize * 0.42);
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrData.modules.get(r, c)) {
          const cx = qrStartX + c * blockSize + blockSize / 2;
          const cy = qrStartY + r * blockSize + blockSize / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Draw Logo if configured
  if (config.logoDataUrl) {
    try {
      const logoImg = await loadImage(config.logoDataUrl);
      const logoScale = (config.logoSizePercent || 22) / 100;
      const logoSize = qrSize * logoScale;
      const centerX = canvasWidth / 2;
      const centerY = qrOffsetY + qrSize / 2;
      const badgePadding = logoSize * 0.15;
      const badgeRadius = (logoSize + badgePadding * 2) * 0.22;

      // Draw clear badge background behind logo for high contrast & scannability
      ctx.save();
      ctx.fillStyle = config.isTransparentBg ? '#ffffff' : config.bgColor;
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = targetResolution * 0.015;
      ctx.shadowOffsetY = targetResolution * 0.005;

      drawRoundedRect(
        ctx,
        centerX - logoSize / 2 - badgePadding,
        centerY - logoSize / 2 - badgePadding,
        logoSize + badgePadding * 2,
        logoSize + badgePadding * 2,
        badgeRadius
      );
      ctx.fill();
      ctx.restore();

      // Border around logo badge
      ctx.strokeStyle = config.fgColor;
      ctx.lineWidth = Math.max(2, targetResolution * 0.003);
      drawRoundedRect(
        ctx,
        centerX - logoSize / 2 - badgePadding,
        centerY - logoSize / 2 - badgePadding,
        logoSize + badgePadding * 2,
        logoSize + badgePadding * 2,
        badgeRadius
      );
      ctx.stroke();

      // Draw clipped logo image
      ctx.save();
      ctx.beginPath();
      drawRoundedRect(
        ctx,
        centerX - logoSize / 2,
        centerY - logoSize / 2,
        logoSize,
        logoSize,
        badgeRadius * 0.8
      );
      ctx.clip();
      ctx.drawImage(
        logoImg,
        centerX - logoSize / 2,
        centerY - logoSize / 2,
        logoSize,
        logoSize
      );
      ctx.restore();
    } catch (err) {
      console.warn('Failed to draw logo on QR canvas', err);
    }
  }

function getContrastingTextColor(hexColor: string, defaultFallback: string = '#000000'): string {
  try {
    const cleanHex = hexColor.replace('#', '');
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.55 ? '#000000' : '#ffffff';
    }
  } catch {
    // fallback
  }
  return defaultFallback;
}

  // Draw Frame / Banner text
  if (hasFrame && bottomBannerHeight > 0) {
    ctx.save();
    const fontSize = Math.round(targetResolution * 0.045);
    ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (config.frameStyle === 'scan-me' || config.frameStyle === 'visit-us') {
      const pillWidth = Math.min(canvasWidth * 0.86, ctx.measureText(frameText.toUpperCase()).width + fontSize * 2.6);
      const pillHeight = Math.round(fontSize * 1.7);
      const pillX = (canvasWidth - pillWidth) / 2;
      const pillY = targetResolution + (bottomBannerHeight - pillHeight) / 2;
      const pillRadius = pillHeight / 2;

      // Draw pill background
      ctx.fillStyle = config.fgColor;
      drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, pillRadius);
      ctx.fill();

      // Draw text with calculated contrast against pill background
      ctx.fillStyle = getContrastingTextColor(config.fgColor, '#000000');
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, pillY + pillHeight / 2);
    } else if (config.frameStyle === 'minimal-card') {
      ctx.fillStyle = config.fgColor;
      const textY = targetResolution + bottomBannerHeight / 2 - Math.round(fontSize * 0.2);
      ctx.fillText(frameText, canvasWidth / 2, textY);
    }
    ctx.restore();
  }
}

/**
 * Generate scalable vector SVG string
 */
export async function generateSvgString(config: QRCodeConfig): Promise<string> {
  const urlToEncode = sanitizeUrl(config.url) || 'https://google.com';
  const svg = await QRCode.toString(urlToEncode, {
    type: 'svg',
    margin: config.margin,
    color: {
      dark: config.fgColor,
      light: config.isTransparentBg ? '#00000000' : config.bgColor,
    },
    errorCorrectionLevel: config.logoDataUrl ? 'H' : config.errorCorrectionLevel,
  });
  return svg;
}

/**
 * Download helper for files
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Export and download in chosen format and resolution
 */
export async function exportQRCode(
  config: QRCodeConfig,
  format: ImageFormat,
  resolution: number = config.resolution
): Promise<{ success: boolean; filename: string }> {
  const baseName = extractDomainForFilename(config.url);
  const filename = `${baseName}-qr-${resolution}px.${format}`;

  if (format === 'svg') {
    const svgStr = await generateSvgString(config);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    triggerFileDownload(blob, filename);
    return { success: true, filename };
  }

  // Raster exports: PNG, JPEG, WEBP
  const tempCanvas = document.createElement('canvas');
  await renderQrToCanvas(tempCanvas, config, resolution);

  let mimeType = 'image/png';
  let quality = 0.95;
  if (format === 'jpeg') {
    mimeType = 'image/jpeg';
  } else if (format === 'webp') {
    mimeType = 'image/webp';
  }

  return new Promise((resolve) => {
    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          triggerFileDownload(blob, filename);
          resolve({ success: true, filename });
        } else {
          resolve({ success: false, filename });
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Copy high-res PNG image directly to clipboard
 */
export async function copyQrToClipboard(config: QRCodeConfig): Promise<boolean> {
  try {
    const tempCanvas = document.createElement('canvas');
    await renderQrToCanvas(tempCanvas, config, 1024);
    
    return new Promise((resolve) => {
      tempCanvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.warn('ClipboardItem write failed', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.warn('Copy QR failed', err);
    return false;
  }
}

// Utility: helper to draw rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Utility: helper to load image safely
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Utility: helper to convert SVG emoji / text to Data URL
export function createEmojiLogoDataUrl(emoji: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.clearRect(0, 0, 128, 128);
  ctx.font = '84px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 64, 68);
  return canvas.toDataURL('image/png');
}
