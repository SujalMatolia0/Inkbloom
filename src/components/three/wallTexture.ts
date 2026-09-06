import * as THREE from "three";

let cachedWallTextures: {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} | null = null;

/**
 * Procedural 90s Vintage Gallery Plaster / Venetian Lime-Wash Wall Textures
 * Creates an authentic, tactile Venetian stucco / museum parchment plaster surface
 * with visible trowel relief, micro-stippling, and soft warm incandescent-friendly tones.
 */
export function getGalleryWallTextures(): {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  if (cachedWallTextures) return cachedWallTextures;

  if (typeof document === "undefined") {
    const dummy = new THREE.Texture();
    return { colorMap: dummy as any, bumpMap: dummy as any, roughnessMap: dummy as any };
  }

  const width = 1024;
  const height = 1024;

  // 1. Color Map Canvas — Warm Heritage Ivory Plaster with Lime Wash Mottling
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext("2d")!;

  // 2. Bump Map Canvas — Micro-stipple and authentic trowel stroke relief
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext("2d")!;

  // 3. Roughness Map Canvas — Burnished trowel sheen vs matte lime chalk
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughCtx = roughCanvas.getContext("2d")!;

  // Base warm gallery tone (vintage vellum / linen plaster)
  ctx.fillStyle = "#EAE1D2";
  ctx.fillRect(0, 0, width, height);

  bumpCtx.fillStyle = "#808080"; // neutral mid-grey
  bumpCtx.fillRect(0, 0, width, height);

  roughCtx.fillStyle = "#DCD2C4"; // ~0.84 matte plaster
  roughCtx.fillRect(0, 0, width, height);

  // Layer 1: Broad, gentle Venetian lime-wash clouds
  const numPatches = 55;
  for (let i = 0; i < numPatches; i++) {
    const px = Math.random() * width;
    const py = Math.random() * height;
    const rad = 100 + Math.random() * 220;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, rad);
    const isWarm = Math.random() > 0.45;
    const col = isWarm 
      ? `rgba(250, 243, 232, ${0.14 + Math.random() * 0.16})` 
      : `rgba(216, 204, 186, ${0.10 + Math.random() * 0.14})`;
    grad.addColorStop(0, col);
    grad.addColorStop(1, "rgba(234, 225, 210, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();

    // Bump trowel layer
    const bGrad = bumpCtx.createRadialGradient(px, py, 0, px, py, rad);
    const bVal = isWarm ? 148 : 110;
    bGrad.addColorStop(0, `rgba(${bVal}, ${bVal}, ${bVal}, 0.12)`);
    bGrad.addColorStop(1, "rgba(128, 128, 128, 0)");
    bumpCtx.fillStyle = bGrad;
    bumpCtx.beginPath();
    bumpCtx.arc(px, py, rad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  // Layer 2: Authentic Venetian Plaster Trowel Sweeps (Arced multi-directional knife strokes)
  const numSweeps = 60;
  for (let i = 0; i < numSweeps; i++) {
    const x0 = Math.random() * width;
    const y0 = Math.random() * height;
    const angle = (Math.random() - 0.5) * 0.8; // subtle angle
    const len = 120 + Math.random() * 260;
    const x1 = x0 + Math.cos(angle) * len;
    const y1 = y0 + Math.sin(angle) * len;
    const cpX = (x0 + x1) / 2 + (Math.random() - 0.5) * 40;
    const cpY = (y0 + y1) / 2 + (Math.random() - 0.5) * 40;

    const strokeWidth = 14 + Math.random() * 26;
    const alpha = 0.04 + Math.random() * 0.06;
    const isHighlight = Math.random() > 0.5;

    ctx.save();
    ctx.strokeStyle = isHighlight 
      ? `rgba(255, 250, 240, ${alpha})` 
      : `rgba(202, 190, 172, ${alpha * 1.2})`;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cpX, cpY, x1, y1);
    ctx.stroke();
    ctx.restore();

    // Bump ridge on trowel edge
    bumpCtx.save();
    bumpCtx.strokeStyle = isHighlight 
      ? `rgba(165, 165, 165, ${alpha * 2.5})` 
      : `rgba(95, 95, 95, ${alpha * 2.5})`;
    bumpCtx.lineWidth = strokeWidth * 0.7;
    bumpCtx.lineCap = "round";
    bumpCtx.beginPath();
    bumpCtx.moveTo(x0, y0);
    bumpCtx.quadraticCurveTo(cpX, cpY, x1, y1);
    bumpCtx.stroke();
    bumpCtx.restore();

    // Roughness variation: burnished flat strokes are smoother (~0.68)
    roughCtx.save();
    roughCtx.strokeStyle = `rgba(170, 170, 170, ${alpha * 1.5})`;
    roughCtx.lineWidth = strokeWidth * 0.9;
    roughCtx.beginPath();
    roughCtx.moveTo(x0, y0);
    roughCtx.quadraticCurveTo(cpX, cpY, x1, y1);
    roughCtx.stroke();
    roughCtx.restore();
  }

  // Layer 3: High-frequency plaster aggregate stippling (micro-texture)
  const imgData = ctx.getImageData(0, 0, width, height);
  const bumpData = bumpCtx.getImageData(0, 0, width, height);
  const roughData = roughCtx.getImageData(0, 0, width, height);

  const pixels = imgData.data;
  const bPixels = bumpData.data;
  const rPixels = roughData.data;

  for (let p = 0; p < pixels.length; p += 4) {
    // Fine stucco grit grain
    const noise = (Math.random() - 0.5) * 16;
    pixels[p] = Math.min(255, Math.max(0, pixels[p] + noise));
    pixels[p + 1] = Math.min(255, Math.max(0, pixels[p + 1] + noise));
    pixels[p + 2] = Math.min(255, Math.max(0, pixels[p + 2] + noise));

    const bNoise = (Math.random() - 0.5) * 28;
    bPixels[p] = Math.min(255, Math.max(0, bPixels[p] + bNoise));
    bPixels[p + 1] = bPixels[p];
    bPixels[p + 2] = bPixels[p];

    const rNoise = (Math.random() - 0.5) * 22;
    rPixels[p] = Math.min(255, Math.max(0, rPixels[p] + rNoise));
    rPixels[p + 1] = rPixels[p];
    rPixels[p + 2] = rPixels[p];
  }

  ctx.putImageData(imgData, 0, 0);
  bumpCtx.putImageData(bumpData, 0, 0);
  roughCtx.putImageData(roughData, 0, 0);

  // Three.js Textures
  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(10, 2);
  colorMap.anisotropy = 16;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(10, 2);
  bumpMap.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(10, 2);
  roughnessMap.anisotropy = 8;

  cachedWallTextures = { colorMap, bumpMap, roughnessMap };
  return cachedWallTextures;
}
