'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const initialized = useRef(false);

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!initialized.current) {
        ringPos.current = { x: e.clientX, y: e.clientY };
        initialized.current = true;
        document.body.classList.add('cursor-active');
      }

      if (curRef.current) {
        curRef.current.style.left = `${e.clientX}px`;
        curRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.16;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.16;
      
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      
      animId = requestAnimationFrame(animateRing);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a, button, .product-card, .journal-card, .nb, .s-icon, .upload-zone, [role="button"], input, select, textarea'
      );
      if (target) {
        document.body.classList.add('hov');
      } else {
        document.body.classList.remove('hov');
      }
    };

    const handleMouseLeave = () => {
      document.body.classList.remove('cursor-active');
    };

    const handleMouseEnter = () => {
      if (initialized.current) {
        document.body.classList.add('cursor-active');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
      document.body.classList.remove('hov', 'cursor-active');
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef}></div>
      <div id="cur-ring" ref={ringRef}></div>
    </>
  );
}
