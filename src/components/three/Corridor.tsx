"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getWoodFloorTextures } from "./woodTexture";
import { getGalleryWallTextures } from "./wallTexture";

export function Corridor() {
  const { camera } = useThree();
  const HALL_WIDTH = 6;
  const HALL_HEIGHT = 4.0;
  const LENGTH = 30.5;
  const CENTER_Z = -12.75; // Gallery spans from Z = +2.5 (entrance) to Z = -28.0 (studio door)

  const woodTextures = useMemo(() => getWoodFloorTextures(), []);
  const wallTextures = useMemo(() => getGalleryWallTextures(), []);

  // Panel positions for classical boiserie wainscoting along side walls
  const panelZPositions = useMemo(() => {
    const pos = [];
    for (let z = 1.2; z >= -26.5; z -= 2.6) {
      pos.push(z);
    }
    return pos;
  }, []);

  // Dynamic Camera-Tracking Incandescent Lights
  const overheadLightRef = useRef<THREE.PointLight>(null!);
  const forwardLightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const camZ = camera.position.z;
    if (overheadLightRef.current) {
      overheadLightRef.current.position.set(0, 3.2, THREE.MathUtils.clamp(camZ - 1.0, -26, 2));
    }
    if (forwardLightRef.current) {
      forwardLightRef.current.position.set(0, 3.2, THREE.MathUtils.clamp(camZ - 7.0, -26, 2));
    }
  });

  return (
    <group>
      {/* 1. Atmospheric Dim Warm Ambient Fill (Moodier, High-Contrast Fine Art Setting) */}
      <ambientLight intensity={0.16} color="#FFE8D0" />

      {/* Dimmed Key Light 1: Soft overhead bay illumination following the viewer */}
      <pointLight 
        ref={overheadLightRef}
        position={[0, 3.2, 0.5]} 
        intensity={1.0} 
        color="#FFE0B2" 
        distance={12} 
        decay={2} 
      />

      {/* Dimmed Key Light 2: Soft forward corridor wash */}
      <pointLight 
        ref={forwardLightRef}
        position={[0, 3.2, -6]} 
        intensity={0.75} 
        color="#FFDEAB" 
        distance={14} 
        decay={2} 
      />

      {/* 2. Vintage 90s Brass & Fluted Milk-Glass Pendants down the Corridor (Soft Dimmed Filament) */}
      {[-1, -7, -13, -19, -25].map((z) => (
        <group key={`pendant-${z}`} position={[0, HALL_HEIGHT, z]}>
          {/* Coffered ceiling cross-beam */}
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[HALL_WIDTH + 0.1, 0.18, 0.35]} />
            <meshStandardMaterial color="#2E1C12" roughness={0.7} />
          </mesh>

          {/* Brass ceiling canopy rose */}
          <mesh position={[0, -0.19, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Brass suspension rod */}
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Vintage Fluted Milk-Glass Lantern Shade */}
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.16, 0.32, 0.22, 16]} />
            <meshStandardMaterial 
              color="#FFF5E8" 
              roughness={0.3} 
              transparent 
              opacity={0.85} 
            />
          </mesh>

          {/* Brass Shade Cap & Finial */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.08, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Soft Vintage Tungsten Filament Bulb */}
          <mesh position={[0, -0.74, 0]}>
            <sphereGeometry args={[0.065, 14, 14]} />
            <meshStandardMaterial 
              color="#FFA228" 
              emissive="#FFA228" 
              emissiveIntensity={2.2} 
            />
          </mesh>
        </group>
      ))}

      {/* 4. Floor — Realistic Polished Hardwood Parquet with Warm Specular Highlights (60fps PBR) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, CENTER_Z]}>
        <planeGeometry args={[HALL_WIDTH, LENGTH]} />
        <meshStandardMaterial
          map={woodTextures.colorMap}
          roughnessMap={woodTextures.roughnessMap}
          bumpMap={woodTextures.bumpMap}
          bumpScale={0.035}
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>

      {/* 5. Ceiling — Heritage Parchment with Coffered Beams */}
      <mesh rotation-x={Math.PI / 2} position={[0, HALL_HEIGHT, CENTER_Z]}>
        <planeGeometry args={[HALL_WIDTH, LENGTH]} />
        <meshStandardMaterial color="#E8E0D2" roughness={0.92} />
      </mesh>

      {/* Longitudinal ceiling cornice beams along left & right edges */}
      <mesh position={[-HALL_WIDTH / 2 + 0.12, HALL_HEIGHT - 0.08, CENTER_Z]}>
        <boxGeometry args={[0.24, 0.16, LENGTH]} />
        <meshStandardMaterial color="#2E1C12" roughness={0.75} />
      </mesh>
      <mesh position={[HALL_WIDTH / 2 - 0.12, HALL_HEIGHT - 0.08, CENTER_Z]}>
        <boxGeometry args={[0.24, 0.16, LENGTH]} />
        <meshStandardMaterial color="#2E1C12" roughness={0.75} />
      </mesh>

      {/* 6. Side Walls — Authentic Venetian Plaster / Lime Wash */}
      {/* Left wall */}
      <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, CENTER_Z]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[LENGTH, HALL_HEIGHT]} />
        <meshStandardMaterial 
          map={wallTextures.colorMap}
          bumpMap={wallTextures.bumpMap}
          bumpScale={0.032}
          roughnessMap={wallTextures.roughnessMap}
          roughness={0.9}
          color="#FFFDF9" 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Right wall */}
      <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, CENTER_Z]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[LENGTH, HALL_HEIGHT]} />
        <meshStandardMaterial 
          map={wallTextures.colorMap}
          bumpMap={wallTextures.bumpMap}
          bumpScale={0.032}
          roughnessMap={wallTextures.roughnessMap}
          roughness={0.9}
          color="#FFFDF9" 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* 7. CLASSICAL 90s VINTAGE WAINSCOTING ALONG SIDE WALLS (Bottom 1.1m) */}
      {/* Left Wainscot Body */}
      <mesh position={[-HALL_WIDTH / 2 + 0.02, 0.54, CENTER_Z]}>
        <boxGeometry args={[0.04, 1.08, LENGTH]} />
        <meshStandardMaterial color="#382216" roughness={0.65} />
      </mesh>
      {/* Right Wainscot Body */}
      <mesh position={[HALL_WIDTH / 2 - 0.02, 0.54, CENTER_Z]}>
        <boxGeometry args={[0.04, 1.08, LENGTH]} />
        <meshStandardMaterial color="#382216" roughness={0.65} />
      </mesh>

      {/* Classical Boiserie Wainscoting Panels down the Side Walls */}
      {panelZPositions.map((z) => (
        <group key={`boiserie-${z}`}>
          {/* Left wall recessed boiserie panel */}
          <group position={[-HALL_WIDTH / 2 + 0.045, 0.55, z]}>
            <mesh>
              <boxGeometry args={[0.015, 0.72, 1.85]} />
              <meshStandardMaterial color="#2B1810" roughness={0.7} />
            </mesh>
            <mesh position={[0.006, 0, 0]}>
              <boxGeometry args={[0.01, 0.62, 1.72]} />
              <meshStandardMaterial color="#442A1B" roughness={0.6} />
            </mesh>
          </group>

          {/* Right wall recessed boiserie panel */}
          <group position={[HALL_WIDTH / 2 - 0.045, 0.55, z]}>
            <mesh>
              <boxGeometry args={[0.015, 0.72, 1.85]} />
              <meshStandardMaterial color="#2B1810" roughness={0.7} />
            </mesh>
            <mesh position={[-0.006, 0, 0]}>
              <boxGeometry args={[0.01, 0.62, 1.72]} />
              <meshStandardMaterial color="#442A1B" roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Polished Brass Chair Rail (Dado Cap) at y = 1.08m along side walls */}
      <mesh position={[-HALL_WIDTH / 2 + 0.042, 1.08, CENTER_Z]}>
        <boxGeometry args={[0.028, 0.045, LENGTH]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[-HALL_WIDTH / 2 + 0.03, 1.06, CENTER_Z]}>
        <boxGeometry args={[0.05, 0.06, LENGTH]} />
        <meshStandardMaterial color="#2B1810" roughness={0.7} />
      </mesh>
      <mesh position={[HALL_WIDTH / 2 - 0.042, 1.08, CENTER_Z]}>
        <boxGeometry args={[0.028, 0.045, LENGTH]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
      </mesh>
      <mesh position={[HALL_WIDTH / 2 - 0.03, 1.06, CENTER_Z]}>
        <boxGeometry args={[0.05, 0.06, LENGTH]} />
        <meshStandardMaterial color="#2B1810" roughness={0.7} />
      </mesh>

      {/* Classical Skirting Baseboards along side walls */}
      <mesh position={[-HALL_WIDTH / 2 + 0.035, 0.07, CENTER_Z]}>
        <boxGeometry args={[0.06, 0.14, LENGTH]} />
        <meshStandardMaterial color="#24140C" roughness={0.8} />
      </mesh>
      <mesh position={[HALL_WIDTH / 2 - 0.035, 0.07, CENTER_Z]}>
        <boxGeometry args={[0.06, 0.14, LENGTH]} />
        <meshStandardMaterial color="#24140C" roughness={0.8} />
      </mesh>

      {/* 8. ENTRANCE WALL ARCHITECTURE (Behind user at start of gallery, Z = +2.5) */}
      <group position={[0, 0, 2.5]}>
        {/* Full Venetian plaster wall surface */}
        <mesh position={[0, HALL_HEIGHT / 2, 0]} rotation-y={Math.PI}>
          <planeGeometry args={[HALL_WIDTH, HALL_HEIGHT]} />
          <meshStandardMaterial 
            map={wallTextures.colorMap}
            bumpMap={wallTextures.bumpMap}
            bumpScale={0.032}
            roughnessMap={wallTextures.roughnessMap}
            roughness={0.9}
            color="#FFFDF9" 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Grand Mahogany Double Entrance Doors with Heavy Architrave */}
        <group position={[0, 1.4, -0.04]}>
          {/* Heavy timber casing */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.3, 2.85, 0.1]} />
            <meshStandardMaterial color="#2B1810" roughness={0.75} />
          </mesh>
          {/* Left door leaf */}
          <mesh position={[-0.54, 0, 0.04]}>
            <boxGeometry args={[1.02, 2.68, 0.045]} />
            <meshStandardMaterial color="#3E2413" roughness={0.65} />
          </mesh>
          {/* Right door leaf */}
          <mesh position={[0.54, 0, 0.04]}>
            <boxGeometry args={[1.02, 2.68, 0.045]} />
            <meshStandardMaterial color="#3E2413" roughness={0.65} />
          </mesh>
          {/* Left door boiserie panels */}
          <mesh position={[-0.54, 0.52, 0.065]}>
            <boxGeometry args={[0.8, 0.96, 0.015]} />
            <meshStandardMaterial color="#4E2E18" roughness={0.6} />
          </mesh>
          <mesh position={[-0.54, -0.54, 0.065]}>
            <boxGeometry args={[0.8, 0.86, 0.015]} />
            <meshStandardMaterial color="#4E2E18" roughness={0.6} />
          </mesh>
          {/* Right door boiserie panels */}
          <mesh position={[0.54, 0.52, 0.065]}>
            <boxGeometry args={[0.8, 0.96, 0.015]} />
            <meshStandardMaterial color="#4E2E18" roughness={0.6} />
          </mesh>
          <mesh position={[0.54, -0.54, 0.065]}>
            <boxGeometry args={[0.8, 0.86, 0.015]} />
            <meshStandardMaterial color="#4E2E18" roughness={0.6} />
          </mesh>
          {/* Polished brass kickplates */}
          <mesh position={[-0.54, -1.22, 0.07]}>
            <boxGeometry args={[0.92, 0.22, 0.01]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.25} />
          </mesh>
          <mesh position={[0.54, -1.22, 0.07]}>
            <boxGeometry args={[0.92, 0.22, 0.01]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.25} />
          </mesh>
          {/* Polished brass entrance handles */}
          <mesh position={[-0.08, 0.02, 0.09]}>
            <cylinderGeometry args={[0.012, 0.012, 0.26, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.08, 0.02, 0.09]}>
            <cylinderGeometry args={[0.012, 0.012, 0.26, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Engraved brass museum entrance plaque above double doors */}
          <mesh position={[0, 1.58, 0.06]}>
            <boxGeometry args={[1.5, 0.22, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.24} />
          </mesh>
        </group>

        {/* Text on entrance plaque */}
        <Text
          position={[0, 3.03, -0.09]}
          rotation-y={Math.PI}
          fontSize={0.068}
          color="#1A1209"
          fontStyle="italic"
          letterSpacing={0.08}
        >
          VINYAS GALLERY · MAIN FOYER
        </Text>
        <Text
          position={[0, 2.92, -0.09]}
          rotation-y={Math.PI}
          fontSize={0.034}
          color="#3D2617"
          letterSpacing={0.16}
        >
          CURATED COLLECTION · SALON ENTRANCE
        </Text>

        {/* Boiserie Wainscoting flanking entrance doors on Left & Right */}
        {/* Left wainscot section */}
        <mesh position={[-2.05, 0.54, -0.02]}>
          <boxGeometry args={[1.8, 1.08, 0.04]} />
          <meshStandardMaterial color="#382216" roughness={0.65} />
        </mesh>
        <mesh position={[-2.05, 0.55, -0.045]}>
          <boxGeometry args={[1.4, 0.72, 0.015]} />
          <meshStandardMaterial color="#2B1810" roughness={0.7} />
        </mesh>
        <mesh position={[-2.05, 1.08, -0.042]}>
          <boxGeometry args={[1.8, 0.045, 0.028]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[-2.05, 0.07, -0.035]}>
          <boxGeometry args={[1.8, 0.14, 0.06]} />
          <meshStandardMaterial color="#24140C" roughness={0.8} />
        </mesh>

        {/* Right wainscot section */}
        <mesh position={[2.05, 0.54, -0.02]}>
          <boxGeometry args={[1.8, 1.08, 0.04]} />
          <meshStandardMaterial color="#382216" roughness={0.65} />
        </mesh>
        <mesh position={[2.05, 0.55, -0.045]}>
          <boxGeometry args={[1.4, 0.72, 0.015]} />
          <meshStandardMaterial color="#2B1810" roughness={0.7} />
        </mesh>
        <mesh position={[2.05, 1.08, -0.042]}>
          <boxGeometry args={[1.8, 0.045, 0.028]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[2.05, 0.07, -0.035]}>
          <boxGeometry args={[1.8, 0.14, 0.06]} />
          <meshStandardMaterial color="#24140C" roughness={0.8} />
        </mesh>
      </group>

      {/* 9. DOOR WALL ARCHITECTURE (Flanking & Backing the Studio Door at Z = -28.0) */}
      <group position={[0, 0, -28.0]}>
        {/* Full Venetian plaster wall surface flush behind door frame */}
        <mesh position={[0, HALL_HEIGHT / 2, 0]} rotation-y={0}>
          <planeGeometry args={[HALL_WIDTH, HALL_HEIGHT]} />
          <meshStandardMaterial 
            map={wallTextures.colorMap}
            bumpMap={wallTextures.bumpMap}
            bumpScale={0.032}
            roughnessMap={wallTextures.roughnessMap}
            roughness={0.9}
            color="#FFFDF9" 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Boiserie Wainscoting flanking the Studio Door on Left & Right */}
        {/* Left section (from x = -3 to -0.85) */}
        <mesh position={[-1.95, 0.54, 0.02]}>
          <boxGeometry args={[2.1, 1.08, 0.04]} />
          <meshStandardMaterial color="#382216" roughness={0.65} />
        </mesh>
        <mesh position={[-1.95, 0.55, 0.045]}>
          <boxGeometry args={[1.65, 0.72, 0.015]} />
          <meshStandardMaterial color="#2B1810" roughness={0.7} />
        </mesh>
        <mesh position={[-1.95, 1.08, 0.042]}>
          <boxGeometry args={[2.1, 0.045, 0.028]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[-1.95, 0.07, 0.035]}>
          <boxGeometry args={[2.1, 0.14, 0.06]} />
          <meshStandardMaterial color="#24140C" roughness={0.8} />
        </mesh>

        {/* Right section (from x = +0.85 to +3) */}
        <mesh position={[1.95, 0.54, 0.02]}>
          <boxGeometry args={[2.1, 1.08, 0.04]} />
          <meshStandardMaterial color="#382216" roughness={0.65} />
        </mesh>
        <mesh position={[1.95, 0.55, 0.045]}>
          <boxGeometry args={[1.65, 0.72, 0.015]} />
          <meshStandardMaterial color="#2B1810" roughness={0.7} />
        </mesh>
        <mesh position={[1.95, 1.08, 0.042]}>
          <boxGeometry args={[2.1, 0.045, 0.028]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[1.95, 0.07, 0.035]}>
          <boxGeometry args={[2.1, 0.14, 0.06]} />
          <meshStandardMaterial color="#24140C" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}


