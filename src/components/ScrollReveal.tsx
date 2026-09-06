'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll('.reveal:not(.visible)');
      elements.forEach((el) => observer.observe(el));
    };

    observeAll();

    // Safely re-check if new elements are added dynamically (debounced, childList only)
    let timer: ReturnType<typeof setTimeout>;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(observeAll, 100);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}

