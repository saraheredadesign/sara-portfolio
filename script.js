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
    'empathy',
    'user research',
    'prototyping and wireframing',
    'solid visual design',
    'usability testing',
    'clear communication',
    'teamwork',
    'adaptability and learning'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let phase = 'typing';
  let waitStart = 0;
  let phaseStarted = 0;

  const speed = {
    type: 65,
    blink: 520,
    select: 360
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

  document.querySelectorAll('.meta-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
    });

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-black');
    });
  });

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
      cursor.classList.add('is-black');
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
