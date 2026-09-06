"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");
THREE.Cache.enabled = true;

interface PaintingProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  isSold?: boolean;
  showPlaque?: boolean;
  onSelect?: () => void;
}

/**
 * Procedural Fine Art Fallback Generator
 * Generates an authentic, high-resolution palette-knife abstract oil painting
 * with rich impasto textures, so no canvas ever displays as a blank surface.
 */
function generateArtworkCanvas(seedStr: string): THREE.Texture {
  if (typeof document === "undefined") {
    return new THREE.Texture();
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1365; // Matches 3:4 painting proportion
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  // Pseudo-random deterministic hash from title/seed
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const pseudoRandom = (seedOffset: number) => {
    const x = Math.sin(Math.abs(hash) + seedOffset) * 10000;
    return x - Math.floor(x);
  };

  // Curated boutique color palettes
  const palettes = [
    ["#1A120B", "#3C2A21", "#D5CEA3", "#E5E5CB", "#C17B5C"],
    ["#1F2421", "#216869", "#49A078", "#9CC5A1", "#DCE1DE"],
    ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"],
    ["#231F20", "#BB4430", "#7EBDC2", "#F3DFA2", "#EFE6DD"],
  ];
  const palette = palettes[Math.abs(hash) % palettes.length];

  // Base canvas tone (aged raw linen / gesso ground)
  ctx.fillStyle = "#E8E2D5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Textured palette-knife paint layers
  const numStrokes = 65;
  for (let i = 0; i < numStrokes; i++) {
    const color = palette[Math.floor(pseudoRandom(i * 3) * palette.length)];
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.45 + pseudoRandom(i * 7) * 0.5;

    const x = pseudoRandom(i * 11) * canvas.width;
    const y = pseudoRandom(i * 13) * canvas.height;
    const w = 120 + pseudoRandom(i * 17) * 480;
    const h = 40 + pseudoRandom(i * 19) * 160;
    const angle = (pseudoRandom(i * 23) - 0.5) * 0.9;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }

  // Micro-fine canvas grain / weave
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let p = 0; p < data.length; p += 4) {
    const noise = (Math.random() - 0.5) * 14;
    data[p] = Math.min(255, Math.max(0, data[p] + noise));
    data[p + 1] = Math.min(255, Math.max(0, data[p + 1] + noise));
    data[p + 2] = Math.min(255, Math.max(0, data[p + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export function Painting({ url, position, rotation, title, isSold = false, showPlaque = true, onSelect }: PaintingProps) {
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [map, setMap] = useState<THREE.Texture | null>(() => {
    return generateArtworkCanvas(url || title);
  });

  const [detailLevel, setDetailLevel] = useState<"far" | "medium" | "close">("close");
  const detailLevelRef = useRef<"far" | "medium" | "close">("close");

  const meshRef = useRef<THREE.Group>(null!);
  const artworkRef = useRef<THREE.Mesh>(null!);
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));
  const spotLightRef = useRef<THREE.PointLight>(null!);
  const plaqueLightRef = useRef<THREE.PointLight>(null!);

  // Load painting texture immediately on mount with robust procedural fallback
  useEffect(() => {
    let active = true;

    textureLoader.load(
      url,
      (tex) => {
        if (!active) return;
        tex.flipY = true;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        setMap(tex);
      },
      undefined,
      () => {
        if (!active) return;
        // Network fallback — generate rich oil painting
        const fallback = generateArtworkCanvas(url || title);
        setMap(fallback);
      }
    );

    return () => {
      active = false;
    };
  }, [url, title]);

  useFrame(() => {
    if (!meshRef.current) return;

    const dist = Math.abs(camera.position.z - position[2]);

    // LOD calculation with hysteresis
    const current = detailLevelRef.current;
    let next: "far" | "medium" | "close" = current;

    if (current === "far") {
      if (dist <= 7) next = "close";
      else if (dist <= 16) next = "medium";
    } else if (current === "medium") {
      if (dist <= 6.5) next = "close";
      else if (dist > 18) next = "far";
    } else if (current === "close") {
      if (dist > 8.5) next = "medium";
    }

    if (next !== current) {
      detailLevelRef.current = next;
      setDetailLevel(next);
    }

    // Smooth hover scale & roughness lerp
    scaleVec.current.setScalar(hovered ? 1.025 : 1);
    meshRef.current.scale.lerp(scaleVec.current, 0.08);

    if (artworkRef.current) {
      const mat = artworkRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.roughness = THREE.MathUtils.lerp(mat.roughness, hovered ? 0.5 : 0.65, 0.08);
      }
    }

    // Golden Picture Light illumination on the painting (bright & focused)
    if (spotLightRef.current) {
      const targetIntensity = dist <= 16 ? 4.8 : 0;
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        targetIntensity,
        0.15
      );
    }

    // Dedicated plaque illumination (warm radiant glint)
    if (plaqueLightRef.current) {
      const targetPlaqueIntensity = dist <= 14 ? 1.6 : 0;
      plaqueLightRef.current.intensity = THREE.MathUtils.lerp(
        plaqueLightRef.current.intensity,
        targetPlaqueIntensity,
        0.15
      );
    }
  });

  const isFar = detailLevel === "far";

  return (
    <group position={position} rotation={rotation}>
      <group ref={meshRef}>
        {/* 1. Golden Brass Picture Light (Always Mounted Above Frame) */}
        <group position={[0, 1.15, 0]}>
          {/* Mounting bracket */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[0.22, 0.06, 0.03]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Left curved brass arm */}
          <mesh position={[-0.22, 0.05, 0.08]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Right curved brass arm */}
          <mesh position={[0.22, 0.05, 0.08]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Horizontal tubular golden lamp hood */}
          <mesh position={[0, 0.12, 0.16]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 0.96, 14]} />
            <meshStandardMaterial color="#E5C158" metalness={0.94} roughness={0.15} />
          </mesh>

          {/* Left/Right brass finial caps */}
          <mesh position={[-0.49, 0.12, 0.16]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0.49, 0.12, 0.16]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Radiant Golden underside aperture glow */}
          <mesh position={[0, 0.10, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.84, 0.025]} />
            <meshStandardMaterial color="#FFA000" emissive="#FF9E00" emissiveIntensity={5.5} />
          </mesh>

          {/* Dedicated Golden Picture Light Focusing on Artwork Canvas */}
          <pointLight 
            ref={spotLightRef}
            position={[0, 0.06, 0.22]} 
            color="#FFE29E" 
            intensity={4.8} 
            distance={3.6} 
            decay={2} 
          />
        </group>

        {/* 2. Classical Deep Mahogany Outer Frame */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[1.7, 2.2, 0.09]} />
          <meshStandardMaterial color="#2B1810" roughness={0.7} metalness={0.06} />
        </mesh>

        {/* 3. Gold / Brass Inner Fillet Trim */}
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[1.6, 2.1, 0.02]} />
          <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* 4. Textured Museum Cream Mat Border */}
        <mesh position={[0, 0, -0.015]}>
          <boxGeometry args={[1.56, 2.06, 0.015]} />
          <meshStandardMaterial color="#EDE5D8" roughness={0.96} />
        </mesh>

        {/* 5. Canvas Artwork Surface — Re-instantiated with key when map loads */}
        <mesh
          ref={artworkRef}
          position={[0, 0, 0.005]}
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.classList.add('hov');
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.classList.remove('hov');
          }}
        >
          <planeGeometry args={[1.46, 1.96]} />
          <meshStandardMaterial
            key={map ? map.uuid : "unloaded"}
            map={map}
            color="#ffffff"
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>

        {/* 6. Vintage Museum Engraved Brass Plaque Below Painting */}
        {showPlaque && (
          <group position={[0, -1.16, 0.02]}>
            {/* Dedicated warm spotlight softly washing the brass plate */}
            <pointLight
              ref={plaqueLightRef}
              position={[0, 0.08, 0.22]}
              color="#FFE8A8"
              intensity={1.6}
              distance={1.6}
              decay={2}
            />

            {/* Dark Mahogany Beveled Wall Mount Backing */}
            <mesh position={[0, 0, -0.006]}>
              <boxGeometry args={[0.92, 0.22, 0.016]} />
              <meshStandardMaterial color="#1E120A" roughness={0.7} metalness={0.08} />
            </mesh>

            {/* Polished Gold Fillet Rim */}
            <mesh position={[0, 0, -0.001]}>
              <boxGeometry args={[0.88, 0.18, 0.018]} />
              <meshStandardMaterial
                color="#FFDE7A"
                emissive="#946522"
                emissiveIntensity={0.38}
                metalness={0.25}
                roughness={0.28}
              />
            </mesh>

            {/* Main Luminous Brushed Brass Plate Face */}
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[0.84, 0.14, 0.016]} />
              <meshStandardMaterial
                color="#FFE599"
                emissive="#A67C2E"
                emissiveIntensity={0.42}
                roughness={0.28}
                metalness={0.18}
              />
            </mesh>

            {/* 4 Corner Polished Golden Rivet Studs */}
            {[
              [-0.38, 0.046, 0.016],
              [0.38, 0.046, 0.016],
              [-0.38, -0.046, 0.016],
              [0.38, -0.046, 0.016],
            ].map(([x, y, z], i) => (
              <mesh key={`stud-${i}`} position={[x, y, z]}>
                <cylinderGeometry args={[0.009, 0.009, 0.014, 12]} />
                <meshStandardMaterial
                  color="#FFDF73"
                  emissive="#B8860B"
                  emissiveIntensity={0.5}
                  metalness={0.3}
                  roughness={0.2}
                />
              </mesh>
            ))}

            {/* 3D Engraved Glyphs */}
            {!isFar && (
              <>
                {/* Engraved Artwork Title */}
                <Text
                  position={[0, 0.024, 0.018]}
                  fontSize={0.044}
                  color="#1A0D03"
                  anchorX="center"
                  anchorY="middle"
                  fontStyle="italic"
                  letterSpacing={0.06}
                  fontWeight={700}
                >
                  {title.toUpperCase()}
                </Text>

                {/* Subtitle / Atelier text */}
                <Text
                  position={[0, -0.028, 0.018]}
                  fontSize={0.022}
                  color="#4A260C"
                  anchorX="center"
                  anchorY="middle"
                  letterSpacing={0.14}
                  fontWeight={600}
                >
                  ANKI MATOLIA · VINYAS ATELIER
                </Text>
              </>
            )}
          </group>
        )}

        {/* 7. SOLD Stamp (if sold) */}
        {isSold && (
          <group rotation={[0, 0, THREE.MathUtils.degToRad(-12)]} position={[0.3, 0.5, 0.05]}>
            <mesh>
              <boxGeometry args={[0.85, 0.32, 0.01]} />
              <meshStandardMaterial color="#8B0000" transparent opacity={0.85} roughness={0.7} />
            </mesh>
            <Text
              position={[0, 0, 0.008]}
              fontSize={0.22} 
              color="#FFEEEE"
              anchorX="center" 
              anchorY="middle" 
              letterSpacing={0.15}
            >
              SOLD
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}

/** Preload all painting textures to warm the texture cache */
export function preloadPaintingTextures(urls: string[]) {
  THREE.Cache.enabled = true;
  urls.forEach((url) => {
    textureLoader.load(url, (tex) => {
      tex.flipY = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
    });
  });
}


