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
  const touchStart = useRef({ x: 0, y: 0 });

  // Smoothed camera position tracked in a ref (not state — no re-renders)
  const camPos = useRef(new THREE.Vector3(0, 1.7, 2));

  useEffect(() => {
    // YXZ order: yaw first, then pitch — prevents gimbal lock for FPS-style look
    camera.rotation.order = "YXZ";
    // Snap to start immediately so first frame is correct
    camera.position.set(0, 1.7, 2);
    camera.rotation.set(0, 0, 0);
    camPos.current.set(0, 1.7, 2);

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

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseTarget.current.y = -nx * (25 * Math.PI / 180);
      mouseTarget.current.x = -ny * (10 * Math.PI / 180);
    };

    const handleMouseLeave = () => {
      mouseTarget.current.x = 0;
      mouseTarget.current.y = 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current.x = e.touches[0].clientX;
      touchStart.current.y = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = Math.abs(t.clientX - touchStart.current.x);
      const dy = Math.abs(t.clientY - touchStart.current.y);
      if (dx > dy) {
        if (e.cancelable) e.preventDefault();
        const nx = (t.clientX / window.innerWidth - 0.5) * 2;
        const ny = (t.clientY / window.innerHeight - 0.5) * 2;
        mouseTarget.current.y = -nx * (25 * Math.PI / 180);
        mouseTarget.current.x = -ny * (10 * Math.PI / 180);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      trigger.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [camera]);

  useFrame((state) => {
    if (!isReady) return;

    // 1. POSITION — scroll drives Z from 2 (entrance) to -23 (end)
    const EYE_LEVEL = 1.7;
    const targetZ = THREE.MathUtils.clamp(
      2 - scrollData.current.normalized * 25,
      -23,
      2
    );

    // Head bob when scrolling fast
    const targetY =
      scrollData.current.velocity > 0.1
        ? EYE_LEVEL + Math.sin(state.clock.elapsedTime * 10) * 0.02
        : EYE_LEVEL;

    camPos.current.z = THREE.MathUtils.lerp(camPos.current.z, targetZ, 0.1);
    camPos.current.y = THREE.MathUtils.lerp(camPos.current.y, targetY, 0.05);

    camera.position.copy(camPos.current);

    // 2. LOOK-AROUND — mouse/touch yaw + pitch
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

  // Drive camera directly — no group/primitive needed
  return null;
}
