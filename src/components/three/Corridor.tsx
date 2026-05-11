"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

export function Corridor() {
  const HALL_WIDTH = 6;
  const HALL_HEIGHT = 4.0;
  const LENGTH = 32;

  return (
    <group>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.55} color="#FFF5E0" />

      {/* Ceiling track lights — 5 fixtures down the corridor */}
      {[-4, -10, -16, -22, -28].map((z) => (
        <group key={`light-${z}`} position={[0, HALL_HEIGHT - 0.15, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshStandardMaterial emissive="#FFF5E0" emissiveIntensity={3} color="#FFF5E0" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.22, 0.12, 0.22]} />
            <meshStandardMaterial color="#D8D0C8" roughness={0.9} />
          </mesh>
          <pointLight intensity={3} color="#FFF5E0" distance={12} castShadow={false} />
        </group>
      ))}

      {/* Side accent lights — cover all 8 painting slots (z: -3 to -24) */}
      {[-3, -6, -9, -12, -15, -18, -21, -24].map((z) => (
        <group key={`accent-${z}`}>
          <pointLight position={[-HALL_WIDTH / 2 + 0.6, 2.6, z]} intensity={2.0} color="#FFE8D0" distance={4} />
          <pointLight position={[ HALL_WIDTH / 2 - 0.6, 2.6, z]} intensity={2.0} color="#FFE8D0" distance={4} />
        </group>
      ))}

      {/* Floor — warm reflective wood.
          Resolution lowered 512→256 for faster FBO render. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -LENGTH / 2 + 1]}>
        <planeGeometry args={[HALL_WIDTH, LENGTH]} />
        <MeshReflectorMaterial
          mirror={0.1}
          blur={[256, 64]}
          resolution={256}
          mixBlur={8}
          mixStrength={0.2}
          roughness={0.7}
          depthScale={1.0}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#C4A882"
          metalness={0.03}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, HALL_HEIGHT, -LENGTH / 2 + 1]}>
        <planeGeometry args={[HALL_WIDTH, LENGTH]} />
        <meshStandardMaterial color="#E8E0D6" roughness={0.92} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, -LENGTH / 2 + 1]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[LENGTH, HALL_HEIGHT]} />
        <meshStandardMaterial color="#EDE6DC" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, -LENGTH / 2 + 1]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[LENGTH, HALL_HEIGHT]} />
        <meshStandardMaterial color="#EDE6DC" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall (entrance) */}
      <mesh position={[0, HALL_HEIGHT / 2, 1]}>
        <planeGeometry args={[HALL_WIDTH, HALL_HEIGHT]} />
        <meshStandardMaterial color="#EDE6DC" roughness={0.95} />
      </mesh>

      {/* End wall */}
      <mesh position={[0, HALL_HEIGHT / 2, -LENGTH + 2]} rotation-y={Math.PI}>
        <planeGeometry args={[HALL_WIDTH, HALL_HEIGHT]} />
        <meshStandardMaterial color="#EDE6DC" roughness={0.95} />
      </mesh>

      {/* Wainscot rail — left */}
      <mesh position={[-HALL_WIDTH / 2 + 0.02, 0.95, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.07, LENGTH]} />
        <meshStandardMaterial color="#2D2D2D" transparent opacity={0.55} roughness={0.7} />
      </mesh>

      {/* Wainscot rail — right */}
      <mesh position={[HALL_WIDTH / 2 - 0.02, 0.95, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.07, LENGTH]} />
        <meshStandardMaterial color="#2D2D2D" transparent opacity={0.55} roughness={0.7} />
      </mesh>

      {/* Wainscot panel — left */}
      <mesh position={[-HALL_WIDTH / 2 + 0.01, 0.47, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.02, 0.94, LENGTH]} />
        <meshStandardMaterial color="#E0D8CE" roughness={0.98} />
      </mesh>

      {/* Wainscot panel — right */}
      <mesh position={[HALL_WIDTH / 2 - 0.01, 0.47, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.02, 0.94, LENGTH]} />
        <meshStandardMaterial color="#E0D8CE" roughness={0.98} />
      </mesh>

      {/* Skirting board — left */}
      <mesh position={[-HALL_WIDTH / 2 + 0.02, 0.06, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.12, LENGTH]} />
        <meshStandardMaterial color="#2D2D2D" transparent opacity={0.4} />
      </mesh>

      {/* Skirting board — right */}
      <mesh position={[HALL_WIDTH / 2 - 0.02, 0.06, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.12, LENGTH]} />
        <meshStandardMaterial color="#2D2D2D" transparent opacity={0.4} />
      </mesh>

      {/* Crown moulding — left */}
      <mesh position={[-HALL_WIDTH / 2 + 0.02, HALL_HEIGHT - 0.06, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.12, LENGTH]} />
        <meshStandardMaterial color="#D8D0C8" roughness={0.9} />
      </mesh>

      {/* Crown moulding — right */}
      <mesh position={[HALL_WIDTH / 2 - 0.02, HALL_HEIGHT - 0.06, -LENGTH / 2 + 1]}>
        <boxGeometry args={[0.04, 0.12, LENGTH]} />
        <meshStandardMaterial color="#D8D0C8" roughness={0.9} />
      </mesh>
    </group>
  );
}
