"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export function CommissionDoor() {
  const { camera } = useThree();
  const router = useRouter();
  const doorRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  
  const isOpen = useRef(false);
  const showPromptRef = useRef(false);
  const hasNavigated = useRef(false);
  
  const [canShowPrompt, setCanShowPrompt] = useState(false);

  useFrame(() => {
    // Detect camera position for opening the door
    if (camera.position.z <= -20 && !isOpen.current) {
      isOpen.current = true;
    }

    // Door Rotation Logic ( hinge at x = 0.6 )
    const targetRotation = isOpen.current ? -Math.PI / 2 : 0;
    doorRef.current.rotation.y = THREE.MathUtils.lerp(
      doorRef.current.rotation.y,
      targetRotation,
      0.05
    );

    // Light Intensity Logic (Portal Spill)
    const targetIntensity = isOpen.current ? 3 : 0;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity,
      0.05
    );

    // Prompt visibility check — only set state once
    if (doorRef.current.rotation.y <= -Math.PI * 0.4 && !showPromptRef.current) {
      showPromptRef.current = true;
      setCanShowPrompt(true);
    }

    // Navigation trigger — only fire once
    if (camera.position.z <= -24 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/commission");
    }
  });

  return (
    <group position={[0, 0, -28]}>
      {/* Constant Ambient Door Light */}
      <pointLight 
        position={[0, 3, 1]} 
        intensity={1} 
        color="#F5D5A0" 
        distance={10}
      />

      {/* Golden Light behind door (Portal spill) */}
      <pointLight
        ref={lightRef}
        position={[0, 1.2, -1]}
        color="#FFD580"
        intensity={0}
        distance={10}
      />

      {/* Door Frame - Grounded at y=0 */}
      <mesh position={[-0.675, 1.25, 0]}>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#1A1209" />
      </mesh>
      <mesh position={[0.675, 1.25, 0]}>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#1A1209" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#1A1209" />
      </mesh>

      {/* Door Panel (Hinge at right side edge, grounded at y=0) */}
      <group ref={doorRef} position={[0.6, 1.2, 0]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[1.2, 2.4, 0.05]} />
          <meshStandardMaterial color="#8B6343" roughness={0.7} />
        </mesh>
      </group>

      {/* Glowing Sign */}
      <Text
        position={[0, 3.1, 0]}
        fontSize={0.3}
        color="#C17B5C"
        fontStyle="italic"
        maxWidth={2}
        textAlign="center"
      >
        <meshStandardMaterial color="#C17B5C" emissive="#C17B5C" emissiveIntensity={2} />
        Commission a Piece ✦
      </Text>

      {/* Peek-a-boo Doodle Fallback */}
      <group position={[0.2, 0.5, -0.5]}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#C17B5C" />
        </mesh>
        <mesh position={[0.08, 0.05, 0.15]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0.05, 0.15]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Step Inside Prompt */}
      {canShowPrompt && (
        <Text
          position={[0, 1.2, -1]}
          fontSize={0.2}
          color="#F0EBE3"
          anchorX="center"
          anchorY="middle"
        >
          Step inside →
        </Text>
      )}
    </group>
  );
}
