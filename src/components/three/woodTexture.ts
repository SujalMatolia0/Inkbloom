import * as THREE from "three";

let cachedTextures: {
  colorMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} | null = null;

export function getWoodFloorTextures(): {
  colorMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  if (cachedTextures) return cachedTextures;

  if (typeof document === "undefined") {
    const dummy = new THREE.Texture();
    return { colorMap: dummy as any, roughnessMap: dummy as any, bumpMap: dummy as any };
  }

  const width = 1024;
  const height = 2048;

  // 1. Color Canvas
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext("2d")!;

  // 2. Roughness Canvas
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughCtx = roughCanvas.getContext("2d")!;

  // 3. Bump Canvas
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext("2d")!;

  // Fill initial base
  ctx.fillStyle = "#6F4628";
  ctx.fillRect(0, 0, width, height);

  roughCtx.fillStyle = "#888888"; // ~0.53 roughness
  roughCtx.fillRect(0, 0, width, height);

  bumpCtx.fillStyle = "#808080";
  bumpCtx.fillRect(0, 0, width, height);

  const numCols = 8;
  const colWidth = width / numCols;

  // Color palette for individual planks (rich warm oak, teak & walnut tones)
  const plankBaseColors = [
    { h: 29, s: 48, l: 32 },
    { h: 32, s: 44, l: 36 },
    { h: 27, s: 52, l: 29 },
    { h: 34, s: 42, l: 38 },
    { h: 30, s: 46, l: 34 },
    { h: 26, s: 50, l: 30 },
    { h: 33, s: 45, l: 35 },
    { h: 28, s: 49, l: 31 },
  ];

  // Column joint offsets for staggered herringbone / running bond pattern
  const colOffsets = [0, 260, 520, 140, 400, 680, 200, 480];

  for (let c = 0; c < numCols; c++) {
    const x = c * colWidth;
    let y = -colOffsets[c];
    const jointInterval = 512; // plank length

    while (y < height + jointInterval) {
      const plankHeight = jointInterval;
      const palette = plankBaseColors[(c * 3 + Math.floor(y / jointInterval) + 10) % plankBaseColors.length];
      
      // Slight randomized color per plank
      const h = palette.h + (Math.random() * 4 - 2);
      const s = palette.s + (Math.random() * 6 - 3);
      const l = palette.l + (Math.random() * 6 - 3);

      // Gradient for subtle natural plank shading
      const grad = ctx.createLinearGradient(x, y, x + colWidth, y);
      grad.addColorStop(0, `hsl(${h}, ${s}%, ${l - 3}%)`);
      grad.addColorStop(0.5, `hsl(${h}, ${s}%, ${l + 2}%)`);
      grad.addColorStop(1, `hsl(${h}, ${s}%, ${l - 2}%)`);

      ctx.fillStyle = grad;
      ctx.fillRect(x, Math.max(0, y), colWidth, Math.min(height - y, plankHeight));

      // Roughness per plank
      const baseRoughness = 120 + Math.floor(Math.random() * 30);
      roughCtx.fillStyle = `rgb(${baseRoughness}, ${baseRoughness}, ${baseRoughness})`;
      roughCtx.fillRect(x, Math.max(0, y), colWidth, Math.min(height - y, plankHeight));

      // Fine wood grain fibers inside this plank
      const numFibers = 35;
      for (let f = 0; f < numFibers; f++) {
        const fx = x + (f / numFibers) * colWidth + (Math.random() * 3 - 1.5);
        const waveAmp = 2 + Math.random() * 4;
        const waveFreq = 0.005 + Math.random() * 0.005;

        // Color fiber
        ctx.strokeStyle = Math.random() > 0.4 ? `rgba(28, 14, 6, ${0.05 + Math.random() * 0.09})` : `rgba(225, 175, 125, ${0.04 + Math.random() * 0.06})`;
        ctx.lineWidth = 0.8 + Math.random() * 1.6;
        ctx.beginPath();
        for (let py = Math.max(0, y); py < Math.min(height, y + plankHeight); py += 25) {
          const px = fx + Math.sin(py * waveFreq) * waveAmp;
          if (py === Math.max(0, y)) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Bump fiber
        bumpCtx.strokeStyle = Math.random() > 0.5 ? "rgba(100, 100, 100, 0.15)" : "rgba(150, 150, 150, 0.15)";
        bumpCtx.lineWidth = 1;
        bumpCtx.beginPath();
        for (let py = Math.max(0, y); py < Math.min(height, y + plankHeight); py += 30) {
          const px = fx + Math.sin(py * waveFreq) * waveAmp;
          if (py === Math.max(0, y)) bumpCtx.moveTo(px, py);
          else bumpCtx.lineTo(px, py);
        }
        bumpCtx.stroke();
      }

      // Horizontal Joint (between planks)
      if (y > 0 && y < height) {
        // Deep groove
        ctx.strokeStyle = "rgba(18, 9, 4, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + colWidth, y);
        ctx.stroke();

        // Subtle bevel highlight
        ctx.strokeStyle = "rgba(220, 180, 140, 0.25)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x + colWidth, y + 2);
        ctx.stroke();

        // Bump map groove
        bumpCtx.strokeStyle = "rgb(25, 25, 25)";
        bumpCtx.lineWidth = 3;
        bumpCtx.beginPath();
        bumpCtx.moveTo(x, y);
        bumpCtx.lineTo(x + colWidth, y);
        bumpCtx.stroke();

        // Roughness joint (rougher in grooves)
        roughCtx.strokeStyle = "rgb(230, 230, 230)";
        roughCtx.lineWidth = 4;
        roughCtx.beginPath();
        roughCtx.moveTo(x, y);
        roughCtx.lineTo(x + colWidth, y);
        roughCtx.stroke();
      }

      y += plankHeight;
    }

    // Vertical seam along column edge
    if (c > 0) {
      // Color seam
      ctx.strokeStyle = "rgba(18, 9, 4, 0.95)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Highlight bevel edge
      ctx.strokeStyle = "rgba(235, 195, 155, 0.22)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x + 1.5, 0);
      ctx.lineTo(x + 1.5, height);
      ctx.stroke();

      // Bump map seam
      bumpCtx.strokeStyle = "rgb(20, 20, 20)";
      bumpCtx.lineWidth = 3;
      bumpCtx.beginPath();
      bumpCtx.moveTo(x, 0);
      bumpCtx.lineTo(x, height);
      bumpCtx.stroke();

      // Roughness seam
      roughCtx.strokeStyle = "rgb(235, 235, 235)";
      roughCtx.lineWidth = 3.5;
      roughCtx.beginPath();
      roughCtx.moveTo(x, 0);
      roughCtx.lineTo(x, height);
      roughCtx.stroke();
    }
  }

  // Create Three.js Textures
  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(2, 4);
  colorMap.anisotropy = 16;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 4);
  roughnessMap.anisotropy = 8;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 4);
  bumpMap.anisotropy = 8;

  cachedTextures = { colorMap, roughnessMap, bumpMap };
  return cachedTextures;
}
