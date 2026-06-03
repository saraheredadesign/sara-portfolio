const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.nav-links');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((section) => {
  observer.observe(section);
});

const letterFxTitle = document.querySelector('[data-letterfx=\"true\"]');

if (letterFxTitle && !letterFxTitle.dataset.processed) {
  const line1 = letterFxTitle.dataset.line1 || '';
  const line2 = letterFxTitle.dataset.line2 || '';
  const line3 = letterFxTitle.dataset.line3 || '';
  const lines = [line1, line2, line3].filter(Boolean);
  const sourceLines =
    lines.length > 0
      ? lines
      : letterFxTitle.innerText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

  const fragment = document.createDocumentFragment();
  sourceLines.forEach((lineText, lineIndex) => {
    const words = lineText.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.classList.add(`line-${lineIndex + 1}`);
      for (const char of word) {
        const span = document.createElement('span');
        span.className = 'char';
        if (char === '.' && wordIndex === words.length - 1 && lineIndex === sourceLines.length - 1) {
          span.classList.add('hero-dot');
        }
        span.setAttribute('aria-hidden', 'true');
        span.textContent = char;
        wordSpan.append(span);
      }
      fragment.append(wordSpan);
      if (wordIndex < words.length - 1) {
        fragment.append(document.createTextNode(' '));
      }
    });
    if (lineIndex < sourceLines.length - 1) {
      fragment.append(document.createElement('br'));
    }
  });

  const ariaText = sourceLines.join(' ');
  letterFxTitle.setAttribute('aria-label', ariaText);
  letterFxTitle.textContent = '';
  letterFxTitle.append(fragment);
  letterFxTitle.dataset.processed = 'true';
}

const focusWordEl = document.querySelector('[data-focus-word]');

if (focusWordEl) {
  const focusWords = [
    'care',
    'structure',
    'clarity',
    'usable products',
    'real needs and small details',
    'iteration',
    'team work'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let phase = 'typing';
  let waitStart = 0;
  let phaseStarted = 0;

  const speed = {
    type: 95,
    blink: 760,
    select: 520
  };

  const tickFocusWord = (time) => {
    const currentWord = focusWords[wordIndex];

    if (phase === 'typing') {
      if (time - waitStart >= speed.type) {
        charIndex += 1;
        focusWordEl.textContent = currentWord.slice(0, charIndex);
        waitStart = time;
        if (charIndex >= currentWord.length) {
          phase = 'blink';
          phaseStarted = time;
        }
      }
    } else if (phase === 'blink') {
      if (time - phaseStarted >= speed.blink) {
        phase = 'select';
        phaseStarted = time;
      }
    } else if (phase === 'select') {
      focusWordEl.classList.add('is-selected');
      if (time - phaseStarted >= speed.select) {
        focusWordEl.textContent = '';
        charIndex = 0;
        focusWordEl.classList.remove('is-selected');
        wordIndex = (wordIndex + 1) % focusWords.length;
        phase = 'typing';
        waitStart = time;
      }
    }

    requestAnimationFrame(tickFocusWord);
  };

  requestAnimationFrame(tickFocusWord);
}

const frameAnimationEl = document.querySelector('[data-frame-animation="true"]');

if (frameAnimationEl) {
  const totalFrames = 9;
  let frameIndex = 1;

  window.setInterval(() => {
    frameIndex = frameIndex >= totalFrames ? 1 : frameIndex + 1;
    frameAnimationEl.src = `assets/${frameIndex}-animation.png`;
  }, 1200);
}

const processRows = Array.from(document.querySelectorAll('.process-row[data-process-step]'));
const processImages = Array.from(document.querySelectorAll('.process-image[data-process-image]'));

if (processRows.length && processImages.length) {
  const setActiveProcessStep = (step) => {
    const stepKey = String(step);

    processRows.forEach((row) => {
      row.classList.toggle('is-active', row.dataset.processStep === stepKey);
      row.setAttribute('aria-selected', row.dataset.processStep === stepKey ? 'true' : 'false');
    });

    processImages.forEach((image) => {
      image.classList.toggle('is-active', image.dataset.processImage === stepKey);
    });
  };

  processRows.forEach((row) => {
    const step = row.dataset.processStep;

    row.addEventListener('mouseenter', () => {
      setActiveProcessStep(step);
    });

    row.addEventListener('focus', () => {
      setActiveProcessStep(step);
    });

    row.addEventListener('click', () => {
      setActiveProcessStep(step);
    });
  });

  const activeRow = processRows.find((row) => row.classList.contains('is-active'));
  setActiveProcessStep(activeRow?.dataset.processStep ?? processRows[0].dataset.processStep);
}

const heroGalleryScroll = document.querySelector('[data-hero-gallery-scroll]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroGalleryScroll && !prefersReducedMotion) {
  heroGalleryScroll.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      const atStart = heroGalleryScroll.scrollLeft <= 0;
      const atEnd =
        heroGalleryScroll.scrollLeft + heroGalleryScroll.clientWidth >= heroGalleryScroll.scrollWidth - 1;

      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) {
        return;
      }

      event.preventDefault();
      heroGalleryScroll.scrollLeft += event.deltaY * 0.95;
    },
    { passive: false }
  );
}

const projectSelectorButtons = Array.from(document.querySelectorAll('[data-featured-project]'));
const truffleFeaturedPanel = document.querySelector('[data-featured-panel="truffle"]');
const schultzFeaturedPanel = document.querySelector('[data-featured-panel="schultz"]');

if (projectSelectorButtons.length && truffleFeaturedPanel && schultzFeaturedPanel) {
  const setFeaturedProject = (projectKey) => {
    const showTruffle = projectKey === 'truffle';

    truffleFeaturedPanel.classList.toggle('is-hidden', !showTruffle);
    schultzFeaturedPanel.classList.toggle('is-hidden', showTruffle);

    projectSelectorButtons.forEach((button) => {
      const isActive = button.dataset.featuredProject === projectKey;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  projectSelectorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setFeaturedProject(button.dataset.featuredProject);
    });
  });

  setFeaturedProject('truffle');
}

const cursor = document.querySelector('.custom-cursor');
const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursor && desktopPointer) {
  document.body.classList.add('has-custom-cursor');

  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('is-visible');
  });

  window.addEventListener('mousedown', () => {
    cursor.classList.add('is-active');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('is-active');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
  });

  document.querySelectorAll('.meta-item:not(#project-schultz-featured .meta-item)').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('#project-schultz-featured .meta-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.remove('is-black');
    });
  });

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.querySelectorAll('.char').forEach((charEl) => {
      charEl.addEventListener('mouseenter', () => {
        const becomesPinkOnHover = !charEl.closest('.word.line-2') && !charEl.classList.contains('hero-dot');
        if (becomesPinkOnHover) {
          cursor.classList.add('is-black');
        } else {
          cursor.classList.remove('is-black');
        }
      });
    });

    heroTitle.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  }

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.process-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    row.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.about-timeline-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.story-timeline, .timeline-milestone, .timeline-icon-img').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.schultz-explore-btn').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('body.moveit-dark-page .prototype-button').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('body.moveit-dark-page .moveit-detail-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.btn-dark').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMoveitPage = document.body.classList.contains('moveit-dark-page');

if (!reducedMotion && !isMoveitPage) {
  let bg = document.querySelector('.calm-lavender-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'calm-lavender-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = `
      <div class="lavender-layer layer-a"></div>
      <div class="lavender-layer layer-b"></div>
      <div class="lavender-glow"></div>
    `;
    document.body.prepend(bg);
  }

  const layerA = bg.querySelector('.layer-a');
  const layerB = bg.querySelector('.layer-b');
  const glow = bg.querySelector('.lavender-glow');
  let raf = 0;
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;

  const onMove = (event) => {
    tx = event.clientX / window.innerWidth - 0.5;
    ty = event.clientY / window.innerHeight - 0.5;
  };

  const onLeave = () => {
    tx = 0;
    ty = 0;
  };

  const tick = () => {
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;

    const x1 = cx * 28;
    const y1 = cy * 18;
    const r1 = cx * 2.1;
    const x2 = -cx * 22;
    const y2 = -cy * 14;
    const r2 = -cx * 1.5;
    const gx = cx * 26;
    const gy = cy * 17;

    if (layerA) {
      layerA.style.transform = `translate3d(${x1}px, ${y1}px, 0) rotate(${r1}deg) scale(1.03)`;
    }
    if (layerB) {
      layerB.style.transform = `translate3d(${x2}px, ${y2}px, 0) rotate(${r2}deg) scale(1.04)`;
    }
    if (glow) {
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    }
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  raf = requestAnimationFrame(tick);
}
const aboutSlider = document.querySelector('[data-about-slider]');

if (aboutSlider) {
  const sliderButtons = Array.from(aboutSlider.querySelectorAll('[data-about-slide]'));
  const sliderPanels = Array.from(aboutSlider.querySelectorAll('[data-about-panel]'));
  const galleryNodes = Array.from(aboutSlider.querySelectorAll('[data-about-gallery]'));
  let indicatorResetTimer = null;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const aboutCarouselImages = {
    animals: [
      'assets/carrousel_1/sara_vet0.png',
      'assets/carrousel_1/sara_vet1.png',
      'assets/carrousel_1/sara_vet2.png'
    ],
    design: [
      'assets/carrousel_2/sara_studio0.png',
      'assets/carrousel_2/sara_studio1.png',
      'assets/carrousel_2/sara_studio2.png',
      'assets/carrousel_2/sara_studio3.png'
    ],
    life: [
      'assets/carrousel_3/life_0.png',
      'assets/carrousel_3/life_1.png',
      'assets/carrousel_3/life_2.png',
      'assets/carrousel_3/life_3.png'
    ]
  };
  const galleryState = new Map();
  const galleryTransitionMs = 460;

  const positionIndicator = (activeButton) => {
    const sliderIndicator = aboutSlider.querySelector('.about-slider-indicator');
    const sliderToggle = aboutSlider.querySelector('.about-slider-toggle');

    if (!sliderIndicator || !activeButton || !sliderToggle) {
      return;
    }

    const toggleStyles = window.getComputedStyle(sliderToggle);
    const inset = parseFloat(toggleStyles.paddingLeft) || 0;

    sliderIndicator.style.width = `${activeButton.offsetWidth}px`;
    sliderIndicator.style.transform = `translateX(${activeButton.offsetLeft - inset}px)`;
  };

  const animateIndicator = () => {
    const sliderIndicator = aboutSlider.querySelector('.about-slider-indicator');

    if (!sliderIndicator) {
      return;
    }

    sliderIndicator.classList.add('is-moving');
    if (indicatorResetTimer) {
      window.clearTimeout(indicatorResetTimer);
    }
    indicatorResetTimer = window.setTimeout(() => {
      sliderIndicator.classList.remove('is-moving');
      indicatorResetTimer = null;
    }, 460);
  };

  const setLayerState = (layer, stateName) => {
    layer.classList.toggle('is-active', stateName === 'active');
    layer.classList.toggle('is-exiting', stateName === 'exiting');
    layer.classList.toggle('is-hidden', stateName === 'hidden');
  };

  const stopTransitionTimer = (state) => {
    if (!state?.transitionTimerId) {
      return;
    }

    window.clearTimeout(state.transitionTimerId);
    state.transitionTimerId = null;
  };

  const setGalleryImage = (state, index, immediate = false) => {
    if (!state?.layers?.length || !state.images.length) {
      return;
    }

    const nextIndex = index % state.images.length;
    const nextSrc = state.images[nextIndex];
    const activeLayerIndex = state.activeLayerIndex ?? 0;
    const incomingLayerIndex = 1 - activeLayerIndex;
    const activeLayer = state.layers[activeLayerIndex];
    const incomingLayer = state.layers[incomingLayerIndex];

    stopTransitionTimer(state);

    if (state.activeThumb) {
      state.activeThumb.classList.remove('is-active');
      state.activeThumb.setAttribute('aria-current', 'false');
    }

    if (state.thumbButtons?.[nextIndex]) {
      state.thumbButtons[nextIndex].classList.add('is-active');
      state.thumbButtons[nextIndex].setAttribute('aria-current', 'true');
      state.activeThumb = state.thumbButtons[nextIndex];
    }

    if (immediate || reducedMotionQuery.matches || state.images.length === 1) {
      state.index = nextIndex;
      state.activeLayerIndex = 0;
      activeLayer.src = nextSrc;
      setLayerState(activeLayer, 'active');
      setLayerState(incomingLayer, 'hidden');
      return;
    }

    incomingLayer.src = nextSrc;
    setLayerState(incomingLayer, 'hidden');
    incomingLayer.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      setLayerState(activeLayer, 'exiting');
      setLayerState(incomingLayer, 'active');
    });

    state.transitionTimerId = window.setTimeout(() => {
      setLayerState(activeLayer, 'hidden');
      setLayerState(incomingLayer, 'active');
      state.activeLayerIndex = incomingLayerIndex;
      state.index = nextIndex;
      state.transitionTimerId = null;
    }, galleryTransitionMs);
  };

  const renderGallery = (slideKey) => {
    const state = galleryState.get(slideKey);
    if (!state) {
      return;
    }

    if (!state.images.length) {
      return;
    }

    const mainIndex = state.index ?? 0;
    const alternateIndex = 1 - (state.activeLayerIndex ?? 0);
    const mainLayer = state.layers[state.activeLayerIndex ?? 0];
    const hiddenLayer = state.layers[alternateIndex];
    state.layers.forEach((layer, layerIndex) => {
      if (layerIndex === (state.activeLayerIndex ?? 0)) {
        setLayerState(layer, 'active');
      } else {
        setLayerState(layer, 'hidden');
      }
    });

    state.images.forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    state.thumbButtons.forEach((button, index) => {
      button.classList.toggle('is-active', index === mainIndex);
      button.setAttribute('aria-current', index === mainIndex ? 'true' : 'false');
    });

    if (mainLayer && hiddenLayer) {
      mainLayer.src = state.images[mainIndex];
      hiddenLayer.src = state.images[mainIndex];
    }
  };

  const setAboutSlide = (slideKey) => {
    sliderButtons.forEach((button) => {
      const isActive = button.dataset.aboutSlide === slideKey;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    sliderPanels.forEach((panel) => {
      const isActive = panel.dataset.aboutPanel === slideKey;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    animateIndicator();
    positionIndicator(sliderButtons.find((button) => button.dataset.aboutSlide === slideKey));

    galleryState.forEach((state, key) => {
      if (key !== slideKey) {
        state.index = 0;
      }
    });

    const state = galleryState.get(slideKey);
    if (state) {
      state.index = 0;
      state.activeLayerIndex = 0;
      setGalleryImage(state, 0, true);
    }
  };

  galleryNodes.forEach((gallery) => {
    const slideKey = gallery.closest('[data-about-panel]')?.dataset.aboutPanel;
    const mainImage = gallery.querySelector('[data-about-gallery-image]');
    const thumbRail = gallery.querySelector('[data-about-gallery-thumbs]');
    const images = aboutCarouselImages[slideKey] ?? [];

    if (!slideKey || !mainImage || !thumbRail || !images.length) {
      return;
    }

    const galleryMain = gallery.querySelector('.about-gallery-main');
    const overlayImage = mainImage.cloneNode(true);
    overlayImage.removeAttribute('data-about-gallery-image');
    overlayImage.alt = '';
    overlayImage.setAttribute('aria-hidden', 'true');
    overlayImage.classList.remove('is-active', 'is-exiting');
    overlayImage.classList.add('is-hidden');
    galleryMain?.appendChild(overlayImage);

    const layers = [mainImage, overlayImage];
    const thumbButtons = [];
    thumbRail.innerHTML = '';

    images.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'about-gallery-thumb';
      button.setAttribute('aria-label', `Show image ${index + 1} for ${slideKey}`);
      button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      button.dataset.imageSrc = src;

      const thumbImage = document.createElement('img');
      thumbImage.src = src;
      thumbImage.alt = '';
      thumbImage.setAttribute('aria-hidden', 'true');
      button.appendChild(thumbImage);

      button.addEventListener('click', () => {
        const state = galleryState.get(slideKey);
        if (!state) {
          return;
        }

        const clickedSrc = button.dataset.imageSrc;
        const clickedIndex = state.images.indexOf(clickedSrc);
        if (clickedIndex === -1) {
          return;
        }

        state.index = clickedIndex;
        setGalleryImage(state, clickedIndex, false);
      });

      thumbRail.appendChild(button);
      thumbButtons.push(button);
    });

    galleryState.set(slideKey, {
      layers,
      images,
      thumbButtons,
      index: 0,
      activeLayerIndex: 0,
      transitionTimerId: null,
      activeThumb: thumbButtons[0] ?? null
    });

    setLayerState(layers[0], 'active');
    if (layers[1]) {
      setLayerState(layers[1], 'hidden');
    }
  });

  sliderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setAboutSlide(button.dataset.aboutSlide);
    });
  });

  window.addEventListener('resize', () => {
    positionIndicator(sliderButtons.find((button) => button.classList.contains('is-active')));
  });

  requestAnimationFrame(() => {
    const activeButton = sliderButtons.find((button) => button.classList.contains('is-active')) ?? sliderButtons[0];
    if (activeButton) {
      setAboutSlide(activeButton.dataset.aboutSlide);
    }
  });

  window.addEventListener('beforeunload', () => {
    galleryState.forEach((state) => {
      stopTransitionTimer(state);
    });
  });
}
