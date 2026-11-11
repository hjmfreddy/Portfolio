const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll('.cover').forEach((cover) => {
  const reset = () => {
    cover.style.removeProperty('--tilt-x');
    cover.style.removeProperty('--tilt-y');
  };

  cover.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || !precisePointer.matches || event.pointerType !== 'mouse') return;
    const bounds = cover.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cover.style.setProperty('--tilt-x', `${-y * 8}deg`);
    cover.style.setProperty('--tilt-y', `${x * 10}deg`);
  });
  cover.addEventListener('pointerleave', reset);
  cover.addEventListener('pointercancel', reset);
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.replace('image-waiting', 'image-arrival');
      observer.unobserve(target);
    });
  }, { rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.cover img, .case figure img').forEach((image) => {
    const frame = image.closest('.cover, figure');
    frame.classList.add('image-waiting');
    observer.observe(frame);
  });
}
