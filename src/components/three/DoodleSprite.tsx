"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

interface DoodleSpriteProps {
  position: [number, number, number];
  scale?: number;
  variant?: number;
}

const BODY_COLORS = ["#C17B5C", "#7B9E87", "#D4A5A5", "#C4A882", "#B8C9B0"];

export function DoodleSprite({ position, scale = 0.5, variant = 0 }: DoodleSpriteProps) {
  const spriteGroupRef = useRef<THREE.Group>(null!);
  const bodyColor = BODY_COLORS[variant % BODY_COLORS.length];

  useFrame((state) => {
    if (!spriteGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    spriteGroupRef.current.position.y = 0.55 + Math.sin(t * 1.8 + variant) * 0.08;
    spriteGroupRef.current.rotation.z = Math.sin(t * 1.2 + variant * 0.7) * 0.06;
  });

  return (
    <group position={position}>
      {/* Plinth — reduced segment counts for lower vertex count */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.28, 0.3, 0.28]} />
        <meshStandardMaterial color="#2D2D2D" transparent opacity={0.35} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.305, 0]}>
        <boxGeometry args={[0.28, 0.01, 0.28]} />
        <meshStandardMaterial color="#EDE6DC" transparent opacity={0.5} />
      </mesh>

      <Billboard follow>
        <group ref={spriteGroupRef} scale={[scale, scale, scale]}>
          {/* Body — 12 segments instead of 20 */}
          <mesh>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.05} />
          </mesh>

          {/* Left eye */}
          <mesh position={[-0.1, 0.06, 0.24]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#1C1410" />
          </mesh>
          <mesh position={[-0.085, 0.08, 0.275]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Right eye */}
          <mesh position={[0.1, 0.06, 0.24]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#1C1410" />
          </mesh>
          <mesh position={[0.115, 0.08, 0.275]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Smile */}
          <mesh position={[-0.06, -0.07, 0.26]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#1C1410" />
          </mesh>
          <mesh position={[0, -0.09, 0.27]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#1C1410" />
          </mesh>
          <mesh position={[0.06, -0.07, 0.26]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#1C1410" />
          </mesh>

          {/* Blush cheeks */}
          <mesh position={[-0.18, -0.02, 0.2]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#E8A090" transparent opacity={0.45} roughness={1} />
          </mesh>
          <mesh position={[0.18, -0.02, 0.2]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#E8A090" transparent opacity={0.45} roughness={1} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.22, 0.22, 0.1]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.22, 0.22, 0.1]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}
