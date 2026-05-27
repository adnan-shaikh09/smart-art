import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const observeAll = () => {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => {
          if (!el.classList.contains('visible')) {
            intersectionObserver.observe(el);
          }
        });
    };

    // Observe elements already in DOM
    observeAll();

    // Watch for elements added to DOM dynamically (after API calls)
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollAnimation;
