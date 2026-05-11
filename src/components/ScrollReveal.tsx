'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const setupObserver = () => {
      const revealedElements = document.querySelectorAll('.reveal');
      revealedElements.forEach((el) => observer.observe(el));
    };

    setupObserver();

    // Re-run on DOM changes (important for client-side navigation or dynamic content)
    const mutationObserver = new MutationObserver(setupObserver);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
