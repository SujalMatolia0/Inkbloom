"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface CommissionDoorProps {
  onNearDoor?: () => void;
  onLeaveDoor?: () => void;
}

export function CommissionDoor({ onNearDoor, onLeaveDoor }: CommissionDoorProps) {
  const { camera } = useThree();
  const isNearRef = useRef(false);
  const doorLightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    // Detect when user camera approaches the door (door is at z = -28, camera reaches z = -20.5 to -23)
    const isNear = camera.position.z <= -20.5;

    // Distance-based lighting: only illuminate door spotlight when approaching (z <= -15)
    if (doorLightRef.current) {
      const targetIntensity = camera.position.z <= -15 ? 2.4 : 0;
      doorLightRef.current.intensity = THREE.MathUtils.lerp(
        doorLightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }

    if (isNear && !isNearRef.current) {
      isNearRef.current = true;
      onNearDoor?.();
    } else if (!isNear && isNearRef.current) {
      isNearRef.current = false;
      onLeaveDoor?.();
    }
  });

  return (
    <group position={[0, 0, -28]}>
      {/* Overhead warm gallery accent on the door (proximity-activated) */}
      <pointLight 
        ref={doorLightRef}
        position={[0, 3.2, 1.0]} 
        intensity={0} 
        color="#FFE6C8" 
        distance={8}
        decay={2}
      />

      {/* Heavy Timber Door Frame - Dark Espresso Oak */}
      {/* Left jamb */}
      <mesh position={[-0.75, 1.35, 0]}>
        <boxGeometry args={[0.18, 2.7, 0.18]} />
        <meshStandardMaterial color="#1C1410" roughness={0.85} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[0.75, 1.35, 0]}>
        <boxGeometry args={[0.18, 2.7, 0.18]} />
        <meshStandardMaterial color="#1C1410" roughness={0.85} />
      </mesh>
      {/* Top lintel */}
      <mesh position={[0, 2.65, 0]}>
        <boxGeometry args={[1.68, 0.18, 0.18]} />
        <meshStandardMaterial color="#1C1410" roughness={0.85} />
      </mesh>
      {/* Brass threshold strip at bottom */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.5, 0.04, 0.22]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Main Door Slab — Solid Handcrafted Walnut (Remains Closed) */}
      <group position={[0, 1.28, 0]}>
        {/* Core door slab */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.32, 2.54, 0.07]} />
          <meshStandardMaterial color="#4A2E1B" roughness={0.65} />
        </mesh>

        {/* Upper recessed panel */}
        <mesh position={[0, 0.52, 0.038]}>
          <boxGeometry args={[1.06, 0.96, 0.015]} />
          <meshStandardMaterial color="#3E2413" roughness={0.7} />
        </mesh>
        {/* Upper panel inner molding frame */}
        <mesh position={[0, 0.52, 0.045]}>
          <boxGeometry args={[0.96, 0.86, 0.01]} />
          <meshStandardMaterial color="#53331E" roughness={0.6} />
        </mesh>

        {/* Lower recessed panel */}
        <mesh position={[0, -0.56, 0.038]}>
          <boxGeometry args={[1.06, 0.84, 0.015]} />
          <meshStandardMaterial color="#3E2413" roughness={0.7} />
        </mesh>
        {/* Lower panel inner molding frame */}
        <mesh position={[0, -0.56, 0.045]}>
          <boxGeometry args={[0.96, 0.74, 0.01]} />
          <meshStandardMaterial color="#53331E" roughness={0.6} />
        </mesh>

        {/* Brushed Brass Kickplate at bottom */}
        <mesh position={[0, -1.14, 0.042]}>
          <boxGeometry args={[1.2, 0.22, 0.012]} />
          <meshStandardMaterial color="#C5A059" metalness={0.82} roughness={0.25} />
        </mesh>

        {/* Polished Brass Door Handle & Escutcheon on right side */}
        <group position={[0.5, -0.05, 0.05]}>
          {/* Backplate */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.26, 0.012]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Keyhole */}
          <mesh position={[0, -0.06, 0.008]}>
            <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
          {/* Handle lever peg */}
          <mesh position={[-0.02, 0.04, 0.03]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Handle lever handle */}
          <mesh position={[-0.07, 0.04, 0.05]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.015]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>

        {/* Elegant Brass Studio Plaque on Door */}
        <mesh position={[0, 0.52, 0.054]}>
          <boxGeometry args={[0.74, 0.24, 0.008]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
        <Text
          position={[0, 0.56, 0.062]}
          fontSize={0.052}
          color="#1A1209"
          fontStyle="italic"
          maxWidth={0.7}
          textAlign="center"
          letterSpacing={0.06}
        >
          VINYAS STUDIO
        </Text>
        <Text
          position={[0, 0.48, 0.062]}
          fontSize={0.034}
          color="#3A2211"
          maxWidth={0.7}
          textAlign="center"
          letterSpacing={0.12}
        >
          COMMISSIONS &amp; ATELIER
        </Text>
      </group>
    </group>
  );
}
