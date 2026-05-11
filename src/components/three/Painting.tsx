"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Shared loader with Three.js cache — repeated URLs return instantly
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");
THREE.Cache.enabled = true;

interface PaintingProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  isSold?: boolean;
  onSelect?: () => void;
}

export function Painting({ url, position, rotation, title, isSold = false, onSelect }: PaintingProps) {
  const [hovered, setHovered] = useState(false);
  const [map, setMap] = useState<THREE.Texture | null>(null);

  const meshRef = useRef<THREE.Group>(null!);
  const artworkRef = useRef<THREE.Mesh>(null!);
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));

  useEffect(() => {
    textureLoader.load(
      url,
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        // Anisotropic filtering — sharper at oblique angles
        tex.anisotropy = 4;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        setMap(tex);
      },
      undefined,
      () => { /* silent fail — terracotta fallback */ }
    );
  }, [url]);

  useFrame(() => {
    if (!meshRef.current) return;
    // Subtle scale bump on hover
    scaleVec.current.setScalar(hovered ? 1.03 : 1);
    meshRef.current.scale.lerp(scaleVec.current, 0.08);

    // Update canvas material roughness on hover for a slight sheen
    if (artworkRef.current) {
      const mat = artworkRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, hovered ? 0.6 : 0.85, 0.08);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={meshRef}>
        {/* Dark wood frame — furthest back */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[1.64, 2.14, 0.08]} />
          <meshStandardMaterial color="#1C1410" roughness={0.8} metalness={0.05} />
        </mesh>

        {/* Cream mat border — middle layer */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.56, 2.06, 0.02]} />
          <meshStandardMaterial color="#F0EBE3" roughness={0.95} />
        </mesh>

        {/* Canvas artwork surface — front layer, clearly separated from mat */}
        <mesh
          ref={artworkRef}
          position={[0, 0, 0.01]}
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial
            map={map}
            color={map ? "#f5f0eb" : "#C17B5C"}
            roughness={0.85}
            metalness={0}
            envMapIntensity={0.3}
          />
        </mesh>

        {/* Title label — below painting */}
        <Text
          position={[0, -1.2, 0.02]}
          fontSize={0.08}
          color="#2D2D2D"
          anchorX="center"
          anchorY="top"
          maxWidth={1.4}
        >
          {title.toUpperCase()}
        </Text>

        {/* SOLD stamp — clearly in front of artwork */}
        {isSold && (
          <group rotation={[0, 0, THREE.MathUtils.degToRad(-12)]} position={[0.3, 0.5, 0.05]}>
            <mesh>
              <boxGeometry args={[0.85, 0.32, 0.01]} />
              <meshStandardMaterial color="#8B0000" transparent opacity={0.82} roughness={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.008]}
              fontSize={0.22} color="#FFDDDD"
              anchorX="center" anchorY="middle" letterSpacing={0.15}
            >
              SOLD
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}

/** Warm the texture cache during the loading screen */
export function preloadPaintingTextures(urls: string[]) {
  THREE.Cache.enabled = true;
  urls.forEach((url) => {
    textureLoader.load(url, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
    });
  });
}
