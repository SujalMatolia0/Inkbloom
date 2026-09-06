"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface CameraRigProps {
  isReady?: boolean;
  scrollerRef?: React.RefObject<HTMLElement | null>;
}

export function CameraRig({ isReady = false, scrollerRef }: CameraRigProps) {
  const { camera } = useThree();

  const scrollData = useRef({ normalized: 0, velocity: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });

  // Drag interaction tracking
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const lastPointerY = useRef(0);
  const dragDistance = useRef(0);

  // 270 degree total arc: 135° left (+135°) to 135° right (-135°)
  const MAX_YAW = (135 * Math.PI) / 180; // ~2.356 radians (270° total span)
  const MAX_PITCH = (22 * Math.PI) / 180; // ~0.384 radians up/down

  // Smoothed camera position tracked in a ref
  const camPos = useRef(new THREE.Vector3(0, 1.7, 1.5));

  useEffect(() => {
    // YXZ order: yaw first, then pitch — prevents gimbal lock for FPS-style look
    camera.rotation.order = "YXZ";
    // Snap to start immediately so first frame is looking down the gallery
    camera.position.set(0, 1.7, 1.5);
    camera.rotation.set(0, 0, 0);
    camPos.current.set(0, 1.7, 1.5);

    const trigger = ScrollTrigger.create({
      trigger: scrollerRef?.current || document.body,
      scroller: scrollerRef?.current || window,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollData.current.normalized = self.progress;
        scrollData.current.velocity = Math.abs(self.getVelocity());
      },
    });

    // 1. Mouse Move across window: steers camera smoothly across the full 270° span
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) return;
      const nx = THREE.MathUtils.clamp((e.clientX / window.innerWidth - 0.5) * 2.2, -1, 1);
      const ny = THREE.MathUtils.clamp((e.clientY / window.innerHeight - 0.5) * 2.0, -1, 1);
      // nx < 0 (left of screen) -> positive yaw (turns camera left toward left wall)
      // nx > 0 (right of screen) -> negative yaw (turns camera right toward right wall)
      mouseTarget.current.y = -nx * MAX_YAW;
      mouseTarget.current.x = -ny * MAX_PITCH;
    };

    // 2. Drag to look (mouse & touch drag anywhere in viewport)
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.("button, a, input, textarea")) return;
      isDragging.current = true;
      dragDistance.current = 0;
      lastPointerX.current = e.clientX;
      lastPointerY.current = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      const dy = e.clientY - lastPointerY.current;
      dragDistance.current += Math.abs(dx) + Math.abs(dy);
      lastPointerX.current = e.clientX;
      lastPointerY.current = e.clientY;

      // Drag left (dx < 0) turns view to the left (+yaw)
      mouseTarget.current.y = THREE.MathUtils.clamp(
        mouseTarget.current.y - (dx / window.innerWidth) * (Math.PI * 1.6),
        -MAX_YAW,
        MAX_YAW
      );
      mouseTarget.current.x = THREE.MathUtils.clamp(
        mouseTarget.current.x - (dy / window.innerHeight) * (Math.PI * 0.9),
        -MAX_PITCH,
        MAX_PITCH
      );
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    // 3. Keyboard navigation (Arrow keys & A/D keys for smooth inspection)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        mouseTarget.current.y = THREE.MathUtils.clamp(mouseTarget.current.y + 0.18, -MAX_YAW, MAX_YAW);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        mouseTarget.current.y = THREE.MathUtils.clamp(mouseTarget.current.y - 0.18, -MAX_YAW, MAX_YAW);
      } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        mouseTarget.current.x = THREE.MathUtils.clamp(mouseTarget.current.x + 0.08, -MAX_PITCH, MAX_PITCH);
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        mouseTarget.current.x = THREE.MathUtils.clamp(mouseTarget.current.x - 0.08, -MAX_PITCH, MAX_PITCH);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      trigger.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [camera, MAX_YAW, MAX_PITCH]);

  useFrame((state) => {
    if (!isReady) return;

    // 1. POSITION — scroll drives Z from 1.5 (entrance) to -22.5 (door proximity)
    const EYE_LEVEL = 1.7;
    const targetZ = THREE.MathUtils.clamp(
      1.5 - scrollData.current.normalized * 24,
      -22.5,
      1.5
    );

    // Head bob when scrolling fast
    const targetY =
      scrollData.current.velocity > 0.1
        ? EYE_LEVEL + Math.sin(state.clock.elapsedTime * 10) * 0.02
        : EYE_LEVEL;

    camPos.current.z = THREE.MathUtils.lerp(camPos.current.z, targetZ, 0.1);
    camPos.current.y = THREE.MathUtils.lerp(camPos.current.y, targetY, 0.05);

    camera.position.copy(camPos.current);

    // 2. LOOK-AROUND — 270° yaw + pitch with smooth damping
    mouseCurrent.current.x = THREE.MathUtils.lerp(
      mouseCurrent.current.x,
      mouseTarget.current.x,
      0.08
    );
    mouseCurrent.current.y = THREE.MathUtils.lerp(
      mouseCurrent.current.y,
      mouseTarget.current.y,
      0.08
    );

    camera.rotation.x = mouseCurrent.current.x;
    camera.rotation.y = mouseCurrent.current.y;
  });

  return null;
}

