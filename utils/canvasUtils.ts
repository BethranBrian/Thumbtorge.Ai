import { ThumbnailConfig, TextLayer } from "../types";

// Constants
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

/**
 * Wraps text into lines based on maximum width.
 */
const getLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

/**
 * Draws the background image with "cover" fit.
 */
const drawBackground = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) => {
  const scale = Math.max(
    CANVAS_WIDTH / image.width,
    CANVAS_HEIGHT / image.height
  );
  const x = CANVAS_WIDTH / 2 - (image.width / 2) * scale;
  const y = CANVAS_HEIGHT / 2 - (image.height / 2) * scale;
  ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
};

/**
 * Draws a specific text layer.
 */
const drawTextLayer = (
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  yPos: number,
  maxWidth: number
): number => {
  if (!layer.text) return 0;

  // Font setup
  const fontWeight = layer.isBold ? "bold" : "normal";
  const fontStyle = layer.isItalic ? "italic" : "normal";
  ctx.font = `${fontStyle} ${fontWeight} ${layer.fontSize}px "${layer.fontFamily}"`;
  ctx.textAlign = layer.alignment;
  ctx.textBaseline = "top";

  const lines = getLines(ctx, layer.text.toUpperCase(), maxWidth);
  const lineHeight = layer.fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, index) => {
    const xPos =
      layer.alignment === "center"
        ? CANVAS_WIDTH / 2
        : layer.alignment === "left"
        ? 60
        : CANVAS_WIDTH - 60;
    
    const currentY = yPos + index * lineHeight;

    // Shadow
    if (layer.showShadow) {
      ctx.shadowColor = layer.shadowColor;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Stroke/Outline
    if (layer.showOutline) {
      ctx.lineWidth = layer.outlineWidth;
      ctx.strokeStyle = layer.outlineColor;
      ctx.strokeText(line, xPos, currentY);
    }

    // Fill
    ctx.fillStyle = layer.color;
    ctx.fillText(line, xPos, currentY);
  });

  return totalHeight;
};

/**
 * Main render function.
 */
export const renderThumbnail = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement | null,
  config: ThumbnailConfig
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Clear Canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 2. Draw Background Image or Placeholder
  if (image) {
    drawBackground(ctx, image);
  } else {
    // Gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Placeholder text
    ctx.fillStyle = "#475569";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Upload an image to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  // 3. Draw Dark Overlay
  if (config.overlayOpacity > 0) {
    ctx.fillStyle = config.overlayColor;
    ctx.globalAlpha = config.overlayOpacity;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalAlpha = 1.0; // Reset alpha
  }

  // 4. Calculate Text Positioning
  const padding = config.padding;
  const maxWidth = CANVAS_WIDTH - padding * 2;
  
  // Calculate heights to determine vertical centering
  // We need to temporarily set fonts to measure height accurately
  
  // Measure Title
  ctx.font = `${config.title.isItalic ? "italic" : "normal"} ${config.title.isBold ? "bold" : "normal"} ${config.title.fontSize}px "${config.title.fontFamily}"`;
  const titleLines = getLines(ctx, config.title.text.toUpperCase(), maxWidth);
  const titleHeight = titleLines.length * (config.title.fontSize * 1.2);

  // Measure Subtitle
  let subtitleHeight = 0;
  if (config.subtitle.text) {
    ctx.font = `${config.subtitle.isItalic ? "italic" : "normal"} ${config.subtitle.isBold ? "bold" : "normal"} ${config.subtitle.fontSize}px "${config.subtitle.fontFamily}"`;
    const subtitleLines = getLines(ctx, config.subtitle.text.toUpperCase(), maxWidth);
    subtitleHeight = subtitleLines.length * (config.subtitle.fontSize * 1.2);
  }

  const gap = 20;
  const totalContentHeight = titleHeight + (subtitleHeight > 0 ? gap + subtitleHeight : 0);

  let startY = padding; // Top alignment default

  if (config.verticalPosition === 'center') {
    startY = (CANVAS_HEIGHT - totalContentHeight) / 2;
  } else if (config.verticalPosition === 'bottom') {
    startY = CANVAS_HEIGHT - totalContentHeight - padding;
  }

  // 5. Draw Title
  drawTextLayer(ctx, config.title, startY, maxWidth);

  // 6. Draw Subtitle
  if (config.subtitle.text) {
    drawTextLayer(ctx, config.subtitle, startY + titleHeight + gap, maxWidth);
  }
};