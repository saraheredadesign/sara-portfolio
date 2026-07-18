const decisionCarousel = document.querySelector('[data-tf-decisions]');

if (decisionCarousel) {
  const viewport = decisionCarousel.querySelector('[data-tf-decisions-viewport]');
  const track = decisionCarousel.querySelector('[data-tf-decisions-track]');
  const slides = Array.from(decisionCarousel.querySelectorAll('[data-tf-decision-slide]'));
  const previousButton = decisionCarousel.querySelector('[data-tf-decisions-prev]');
  const nextButton = decisionCarousel.querySelector('[data-tf-decisions-next]');
  const status = decisionCarousel.querySelector('[data-tf-decisions-status]');
  let activeIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  viewport.tabIndex = 0;

  const syncDecisionVideos = () => {
    slides.forEach((slide, index) => {
      const video = slide.querySelector('video');
      if (!video) return;

      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const showDecision = (index, { instant = false } = {}) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translate3d(-${activeIndex * viewport.clientWidth}px, 0, 0)`;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;
    status.textContent = `Decision ${activeIndex + 1} of ${slides.length}`;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex));
    });

    syncDecisionVideos();

    if (instant) {
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }
  };

  previousButton.addEventListener('click', () => showDecision(activeIndex - 1));
  nextButton.addEventListener('click', () => showDecision(activeIndex + 1));

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showDecision(activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showDecision(activeIndex + 1);
    }
  });

  viewport.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchmove',
    (event) => {
      touchDeltaX = (event.touches[0]?.clientX ?? touchStartX) - touchStartX;
    },
    { passive: true }
  );

  viewport.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < 45) return;
    showDecision(activeIndex + (touchDeltaX < 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => showDecision(activeIndex, { instant: true }));
  document.addEventListener('visibilitychange', syncDecisionVideos);
  showDecision(0, { instant: true });
}

const darkModeToggle = document.querySelector('[data-tf-dark-toggle]');

if (darkModeToggle) {
  const screen = darkModeToggle.querySelector('[data-tf-dark-screen]');
  const lightSource = new URL('../../assets/screen-light-mode.png', import.meta.url).href;
  const darkSource = new URL('../../assets/screen-dark-mode.png', import.meta.url).href;

  const toggleDarkMode = () => {
    const showDarkMode = darkModeToggle.getAttribute('aria-pressed') !== 'true';
    darkModeToggle.setAttribute('aria-pressed', String(showDarkMode));
    darkModeToggle.setAttribute(
      'aria-label',
      showDarkMode ? 'Switch Truffle screen to light mode' : 'Switch Truffle screen to dark mode'
    );
    screen.src = showDarkMode ? darkSource : lightSource;
    screen.alt = showDarkMode ? 'Truffle home screen in dark mode' : 'Truffle home screen in light mode';
  };

  darkModeToggle.addEventListener('click', toggleDarkMode);
  darkModeToggle.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleDarkMode();
  });
}

const shopCarousel = document.querySelector('[data-tf-shop]');

if (shopCarousel) {
  const viewport = shopCarousel.querySelector('[data-tf-shop-viewport]');
  const track = shopCarousel.querySelector('[data-tf-shop-track]');
  const products = Array.from(track.children);
  const previousButton = shopCarousel.querySelector('[data-tf-shop-prev]');
  const nextButton = shopCarousel.querySelector('[data-tf-shop-next]');
  let activeIndex = 0;
  let maxIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  viewport.tabIndex = 0;

  const getStep = () => {
    if (!products.length) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    return products[0].getBoundingClientRect().width + gap;
  };

  const updateBounds = () => {
    const step = getStep();
    maxIndex = step ? Math.max(0, Math.ceil((track.scrollWidth - viewport.clientWidth) / step)) : 0;
    activeIndex = Math.min(activeIndex, maxIndex);
  };

  const showProduct = (index, { instant = false } = {}) => {
    updateBounds();
    activeIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translate3d(-${activeIndex * getStep()}px, 0, 0)`;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === maxIndex;

    if (instant) {
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }
  };

  previousButton.addEventListener('click', () => showProduct(activeIndex - 1));
  nextButton.addEventListener('click', () => showProduct(activeIndex + 1));

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showProduct(activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showProduct(activeIndex + 1);
    }
  });

  viewport.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchmove',
    (event) => {
      touchDeltaX = (event.touches[0]?.clientX ?? touchStartX) - touchStartX;
    },
    { passive: true }
  );

  viewport.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < 45) return;
    showProduct(activeIndex + (touchDeltaX < 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => showProduct(activeIndex, { instant: true }));
  showProduct(0, { instant: true });
}
