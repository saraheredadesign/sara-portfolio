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
    const lineSpan = document.createElement('span');
    lineSpan.className = `hero-line line-${lineIndex + 1}`;
    if (lineIndex === 1) {
      lineSpan.classList.add('hero-line--accent');
    }

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
      lineSpan.append(wordSpan);
      if (wordIndex < words.length - 1) {
        lineSpan.append(document.createTextNode(' '));
      }
    });
    fragment.append(lineSpan);
  });

  const ariaText = sourceLines.join(' ');
  letterFxTitle.setAttribute('aria-label', ariaText);
  letterFxTitle.textContent = '';
  letterFxTitle.append(fragment);
  letterFxTitle.dataset.processed = 'true';
}

(() => {
  const hero = document.querySelector('.hero');
  const heroTitle = hero?.querySelector('.hero-title');
  const heroCopyBlock = hero?.querySelector('.hero-copy-block');
  const darkCanvas = document.getElementById('hero-dark-cv');
  const customCursor = document.querySelector('.custom-cursor');
  const supportsDesktopSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktopWidthQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hero || !heroTitle || !heroCopyBlock || !darkCanvas || !supportsDesktopSpotlight || reducedMotion || !desktopWidthQuery.matches) {
    return;
  }

  const darkCtx = darkCanvas.getContext('2d');

  if (!darkCtx) {
    return;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);
  const spotlightDark = rootStyles.getPropertyValue('--hero-spotlight-dark').trim() || '#111111';
  const spotlightPink = rootStyles.getPropertyValue('--pink').trim() || '#ffcdff';

  const lineNodes = Array.from(heroTitle.querySelectorAll('.hero-line'));
  const charNodes = Array.from(heroTitle.querySelectorAll('.char'));

  let dpr = 1;
  let heroRect = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let canvasPadX = 0;
  let canvasPadY = 0;
  let titleFontString = '';
  let lineMetrics = [];
  let charMetrics = [];
  let revealCanvas = null;
  let revealCtx = null;
  let titleMetrics = null;
  let pointerX = -9999;
  let pointerY = -9999;
  let pointerInside = false;
  let blobRadius = 0;
  let blobTarget = 0;
  let minRadius = 0;
  let maxRadius = 0;
  let activationPad = 0;
  let activationPadTop = 0;
  let activationPadBottom = 0;
  let rafId = 0;
  let resizeTimer = 0;
  let lastRevealVisible = null;
  let darkLayerDrawn = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const roundRect = (ctx, x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [];
    }

    const lines = [];
    let current = words.shift();

    while (words.length) {
      const nextWord = words.shift();
      const testLine = `${current} ${nextWord}`;
      if (ctx.measureText(testLine).width <= maxWidth || current === '') {
        current = testLine;
      } else {
        lines.push(current);
        current = nextWord;
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines;
  };

  const syncCanvasMetrics = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    const copyBlockRect = heroCopyBlock.getBoundingClientRect();
    heroRect = heroTitle.getBoundingClientRect();
    const titleStyles = window.getComputedStyle(heroTitle);
    titleFontString = titleStyles.font || `${titleStyles.fontWeight || '700'} ${titleStyles.fontSize} ${titleStyles.fontFamily}`;

    const leftColumnWidth = Math.max(1, Math.round(copyBlockRect.width));
    const leftColumnHeight = Math.max(1, Math.round(copyBlockRect.height));
    minRadius = clamp(Math.round(Math.min(leftColumnWidth, leftColumnHeight) * 0.025), 6, 10);
    maxRadius = clamp(Math.round(Math.min(leftColumnWidth, leftColumnHeight) * 0.17), 64, 88);
    canvasPadX = maxRadius + 16;
    canvasPadY = maxRadius + 16;

    canvasWidth = Math.max(1, Math.round(heroRect.width + canvasPadX * 2));
    canvasHeight = Math.max(1, Math.round(heroRect.height + canvasPadY * 2));

    darkCanvas.style.display = 'block';
    darkCanvas.style.inset = 'auto';
    darkCanvas.style.left = `${heroRect.left - copyBlockRect.left - canvasPadX}px`;
    darkCanvas.style.top = `${heroRect.top - copyBlockRect.top - canvasPadY}px`;
    darkCanvas.style.right = 'auto';
    darkCanvas.style.bottom = 'auto';
    darkCanvas.style.width = `${canvasWidth}px`;
    darkCanvas.style.height = `${canvasHeight}px`;
    darkCanvas.width = Math.max(1, Math.round(canvasWidth * dpr));
    darkCanvas.height = Math.max(1, Math.round(canvasHeight * dpr));

    darkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lineMetrics = lineNodes.map((lineNode, index) => {
      const rect = lineNode.getBoundingClientRect();
      return {
        text: lineNode.textContent.trim(),
        x: rect.left - heroRect.left + canvasPadX,
        y: rect.top - heroRect.top + canvasPadY,
        width: rect.width,
        height: rect.height
      };
    });

    charMetrics = charNodes.map((charNode) => {
      const rect = charNode.getBoundingClientRect();
      const lineIndex = Number(charNode.closest('.hero-line')?.className.match(/line-(\d+)/)?.[1] || 1) - 1;
      return {
        char: charNode.textContent || '',
        x: rect.left - heroRect.left + canvasPadX,
        y: rect.top - heroRect.top + canvasPadY,
        lineIndex
      };
    });

    titleMetrics = {
      left: heroRect.left,
      right: heroRect.right,
      top: heroRect.top,
      bottom: heroRect.bottom,
      x: canvasPadX,
      y: canvasPadY,
      width: heroRect.width,
      height: heroRect.height
    };

    activationPad = clamp(Math.round(Math.min(titleMetrics.width, titleMetrics.height) * 0.28), 28, 72);
    activationPadTop = clamp(Math.round(activationPad * 1.25), 34, 84);
    activationPadBottom = clamp(Math.round(activationPad * 0.18), 6, 14);
    renderRevealLayer();
  };

  const refreshViewportMetrics = () => {
    if (!titleMetrics) {
      return;
    }

    const currentHeroRect = heroTitle.getBoundingClientRect();
    heroRect = currentHeroRect;
    titleMetrics.left = currentHeroRect.left;
    titleMetrics.right = currentHeroRect.right;
    titleMetrics.top = currentHeroRect.top;
    titleMetrics.bottom = currentHeroRect.bottom;
  };

  const drawHighlight = (ctx, metric, fillStyle) => {
    const highlightX = metric.x - Math.max(10, metric.height * 0.16);
    const highlightY = metric.y + metric.height * 0.08;
    const highlightW = metric.width + Math.max(20, metric.height * 0.32);
    const highlightH = metric.height * 0.92;
    const highlightR = highlightH * 0.28;

    ctx.fillStyle = fillStyle;
    roundRect(ctx, highlightX, highlightY, highlightW, highlightH, highlightR);
    ctx.fill();
  };

  const drawTitleChar = (ctx, charMetric, fillStyle) => {
    ctx.fillStyle = fillStyle;
    ctx.fillText(charMetric.char, charMetric.x, charMetric.y);
  };

  const renderRevealLayer = () => {
    revealCanvas = document.createElement('canvas');
    revealCanvas.width = Math.max(1, Math.round(canvasWidth * dpr));
    revealCanvas.height = Math.max(1, Math.round(canvasHeight * dpr));
    revealCtx = revealCanvas.getContext('2d');

    if (!revealCtx) {
      return;
    }

    revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    revealCtx.font = titleFontString;
    revealCtx.textBaseline = 'top';
    revealCtx.textAlign = 'left';

    lineMetrics.forEach((metric, index) => {
      if (index === 1) {
        drawHighlight(revealCtx, metric, spotlightDark);
      }
    });

    charMetrics.forEach((charMetric) => {
      if (charMetric.lineIndex === 1) {
        drawTitleChar(revealCtx, charMetric, spotlightPink);
      } else {
        drawTitleChar(revealCtx, charMetric, '#ffffff');
      }
    });
  };

  const isRevealCursorVisible = () => pointerInside && blobRadius > minRadius + 0.35;

  const syncCursorVisual = (force = false) => {
    if (!customCursor) {
      return;
    }

    const revealVisible = isRevealCursorVisible();

    if (force) {
      customCursor.style.width = '14px';
      customCursor.style.height = '14px';
      customCursor.style.backgroundColor = spotlightDark;
      customCursor.style.boxShadow = '0 0 0 8px rgba(255, 205, 255, 0.18), 0 4px 10px rgba(17, 17, 17, 0.12)';
    }

    if (force || revealVisible !== lastRevealVisible) {
      document.body.classList.toggle('hero-reveal-cursor-active', revealVisible);
      lastRevealVisible = revealVisible;
    }
  };

  const drawDarkLayer = () => {
    if (!isRevealCursorVisible()) {
      if (darkLayerDrawn) {
        darkCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        darkLayerDrawn = false;
      }
      return;
    }

    darkCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const cx = pointerX - heroRect.left + canvasPadX;
    const cy = pointerY - heroRect.top + canvasPadY;
    const transitionRadius = minRadius + Math.max(14, Math.round(maxRadius * 0.18));
    const revealProgress = clamp((blobRadius - minRadius) / Math.max(transitionRadius - minRadius, 1), 0, 1);

    darkCtx.save();
    darkCtx.globalAlpha = 1;
    darkCtx.globalCompositeOperation = 'source-over';
    darkCtx.filter = 'none';
    darkCtx.shadowColor = 'transparent';
    darkCtx.shadowBlur = 0;
    darkCtx.beginPath();
    darkCtx.arc(cx, cy, blobRadius, 0, Math.PI * 2);
    darkCtx.fillStyle = spotlightDark;
    darkCtx.fill();

    if (revealProgress > 0.01 && revealCanvas) {
      darkCtx.save();
      darkCtx.beginPath();
      darkCtx.arc(cx, cy, blobRadius, 0, Math.PI * 2);
      darkCtx.clip();
      darkCtx.globalAlpha = revealProgress;
      darkCtx.drawImage(revealCanvas, 0, 0, canvasWidth, canvasHeight);
      darkCtx.restore();
    }

    darkCtx.restore();
    darkLayerDrawn = true;
  };

  const updateBlobTarget = (clientX, clientY) => {
    if (!heroRect || !titleMetrics) {
      return;
    }

    const inActiveTitleArea =
      clientX >= titleMetrics.left - activationPad &&
      clientX <= titleMetrics.right + activationPad &&
      clientY >= titleMetrics.top - activationPadTop &&
      clientY <= titleMetrics.bottom + activationPadBottom;

    if (!inActiveTitleArea) {
      blobTarget = minRadius;
      pointerInside = false;
      return;
    }

    const dx = Math.max(titleMetrics.left - clientX, 0, clientX - titleMetrics.right);
    const dy = Math.max(titleMetrics.top - clientY, 0, clientY - titleMetrics.bottom);
    const distance = Math.hypot(dx, dy);
    const activation = clamp(1 - distance / activationPad, 0, 1);

    if (activation <= 0.04) {
      blobTarget = minRadius;
      pointerInside = false;
      return;
    }

    pointerInside = true;
    blobTarget = minRadius + (maxRadius - minRadius) * Math.pow(activation, 1.7);
  };

  const onMove = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    updateBlobTarget(pointerX, pointerY);
  };

  const onLeave = () => {
    pointerInside = false;
    blobTarget = minRadius;
    drawDarkLayer();
    syncCursorVisual();
  };

  const onScroll = () => {
    refreshViewportMetrics();
    updateBlobTarget(pointerX, pointerY);
    drawDarkLayer();
    syncCursorVisual();
  };

  const tick = () => {
    blobRadius += (blobTarget - blobRadius) * 0.12;
    blobRadius = Math.max(minRadius, blobRadius);
    drawDarkLayer();
    syncCursorVisual();
    rafId = window.requestAnimationFrame(tick);
  };

  const handleResize = () => {
    if (!desktopWidthQuery.matches) {
      darkCanvas.style.display = 'none';
      pointerInside = false;
      blobRadius = minRadius;
      blobTarget = minRadius;
      document.body.classList.remove('hero-reveal-cursor-active');
      lastRevealVisible = null;
      darkLayerDrawn = false;
      syncCursorVisual(true);
      return;
    }

    syncCanvasMetrics();
    blobRadius = Math.max(blobRadius, minRadius);
    blobTarget = Math.max(blobTarget, minRadius);
    syncCursorVisual(true);
    drawDarkLayer();
  };

  const init = () => {
    syncCanvasMetrics();
    blobRadius = minRadius;
    blobTarget = minRadius;
    syncCursorVisual(true);
    drawDarkLayer();
    rafId = window.requestAnimationFrame(tick);
  };

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(handleResize, 120);
  });

  desktopWidthQuery.addEventListener?.('change', handleResize);

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();

(() => {
  const aboutHero = document.querySelector('.about-hero');
  const aboutHeroContent = aboutHero?.querySelector('.about-hero-content');
  const aboutHeroTitle = aboutHero?.querySelector('.about-hero-title');
  const aboutHeroMedia = aboutHero?.querySelector('.about-hero-media');
  const darkCanvas = document.getElementById('about-hero-dark-cv');
  const customCursor = document.querySelector('.custom-cursor');
  const supportsDesktopSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktopWidthQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!aboutHero || !aboutHeroContent || !aboutHeroTitle || !darkCanvas || !supportsDesktopSpotlight || reducedMotion || !desktopWidthQuery.matches) {
    return;
  }

  const darkCtx = darkCanvas.getContext('2d');

  if (!darkCtx) {
    return;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);
  const spotlightDark = rootStyles.getPropertyValue('--hero-spotlight-dark').trim() || '#111111';
  const spotlightPink = rootStyles.getPropertyValue('--pink').trim() || '#ffcdff';

  const lineNodes = Array.from(aboutHeroTitle.querySelectorAll('.hero-line'));
  const charNodes = Array.from(aboutHeroTitle.querySelectorAll('.char'));

  let dpr = 1;
  let heroRect = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let canvasPadX = 0;
  let canvasPadY = 0;
  let lineMetrics = [];
  let charMetrics = [];
  let revealCanvas = null;
  let revealCtx = null;
  let titleMetrics = null;
  let pointerX = -9999;
  let pointerY = -9999;
  let pointerInside = false;
  let blobRadius = 0;
  let blobTarget = 0;
  let minRadius = 0;
  let maxRadius = 0;
  let activationPad = 0;
  let activationPadTop = 0;
  let activationPadBottom = 0;
  let rafId = 0;
  let resizeTimer = 0;
  let lastRevealVisible = null;
  let darkLayerDrawn = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (value) => value * value * (3 - 2 * value);

  const roundRect = (ctx, x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  const syncCanvasMetrics = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    const contentRect = aboutHeroContent.getBoundingClientRect();
    heroRect = aboutHeroTitle.getBoundingClientRect();

    const titleWidth = Math.max(1, Math.round(heroRect.width));
    const titleHeight = Math.max(1, Math.round(heroRect.height));
    minRadius = clamp(Math.round(Math.min(titleWidth, titleHeight) * 0.025), 6, 10);
    maxRadius = clamp(Math.round(Math.min(titleWidth, titleHeight) * 0.17), 64, 88);
    canvasPadX = maxRadius + 16;
    canvasPadY = maxRadius + 16;

    canvasWidth = Math.max(1, Math.round(heroRect.width + canvasPadX * 2));
    canvasHeight = Math.max(1, Math.round(heroRect.height + canvasPadY * 2));

    darkCanvas.style.display = 'block';
    darkCanvas.style.inset = 'auto';
    darkCanvas.style.left = `${heroRect.left - contentRect.left - canvasPadX}px`;
    darkCanvas.style.top = `${heroRect.top - contentRect.top - canvasPadY}px`;
    darkCanvas.style.right = 'auto';
    darkCanvas.style.bottom = 'auto';
    darkCanvas.style.width = `${canvasWidth}px`;
    darkCanvas.style.height = `${canvasHeight}px`;
    darkCanvas.width = Math.max(1, Math.round(canvasWidth * dpr));
    darkCanvas.height = Math.max(1, Math.round(canvasHeight * dpr));

    darkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lineMetrics = lineNodes.map((lineNode) => {
      const rect = lineNode.getBoundingClientRect();
      return {
        text: lineNode.textContent.trim(),
        x: rect.left - heroRect.left + canvasPadX,
        y: rect.top - heroRect.top + canvasPadY,
        width: rect.width,
        height: rect.height
      };
    });

    charMetrics = charNodes.map((charNode) => {
      const rect = charNode.getBoundingClientRect();
      const charStyles = window.getComputedStyle(charNode);
      const lineIndex = Number(charNode.closest('.hero-line')?.className.match(/line-(\d+)/)?.[1] || 1) - 1;
      return {
        char: charNode.textContent || '',
        x: rect.left - heroRect.left + canvasPadX,
        y: rect.top - heroRect.top + canvasPadY,
        font: charStyles.font || `${charStyles.fontWeight || '700'} ${charStyles.fontSize} ${charStyles.fontFamily}`,
        lineIndex
      };
    });

    titleMetrics = {
      left: heroRect.left,
      right: heroRect.right,
      top: heroRect.top,
      bottom: heroRect.bottom,
      x: canvasPadX,
      y: canvasPadY,
      width: heroRect.width,
      height: heroRect.height
    };

    activationPad = clamp(Math.round(Math.min(titleMetrics.width, titleMetrics.height) * 0.28), 28, 72);
    activationPadTop = clamp(Math.round(activationPad * 1.25), 34, 84);
    activationPadBottom = clamp(Math.round(activationPad * 0.18), 6, 14);

    renderRevealLayer();
  };

  const refreshViewportMetrics = () => {
    if (!titleMetrics) {
      return;
    }

    const currentHeroRect = aboutHeroTitle.getBoundingClientRect();
    heroRect = currentHeroRect;
    titleMetrics.left = currentHeroRect.left;
    titleMetrics.right = currentHeroRect.right;
    titleMetrics.top = currentHeroRect.top;
    titleMetrics.bottom = currentHeroRect.bottom;
  };

  const drawHighlight = (ctx, metric, fillStyle) => {
    const highlightX = metric.x - Math.max(10, metric.height * 0.16);
    const highlightY = metric.y + metric.height * 0.08;
    const highlightW = metric.width + Math.max(20, metric.height * 0.32);
    const highlightH = metric.height * 0.92;
    const highlightR = highlightH * 0.28;

    ctx.fillStyle = fillStyle;
    roundRect(ctx, highlightX, highlightY, highlightW, highlightH, highlightR);
    ctx.fill();
  };

  const renderRevealLayer = () => {
    revealCanvas = document.createElement('canvas');
    revealCanvas.width = Math.max(1, Math.round(canvasWidth * dpr));
    revealCanvas.height = Math.max(1, Math.round(canvasHeight * dpr));
    revealCtx = revealCanvas.getContext('2d');

    if (!revealCtx) {
      return;
    }

    revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    revealCtx.textBaseline = 'top';
    revealCtx.textAlign = 'left';

    lineMetrics.forEach((metric, index) => {
      if (index === 0) {
        drawHighlight(revealCtx, metric, spotlightDark);
      }
    });

    charMetrics.forEach((charMetric) => {
      revealCtx.font = charMetric.font;
      revealCtx.fillStyle = charMetric.lineIndex === 0 ? spotlightPink : '#ffffff';
      revealCtx.fillText(charMetric.char, charMetric.x, charMetric.y);
    });
  };

  const isRevealCursorVisible = () => pointerInside && blobRadius > minRadius + 0.35;

  const syncCursorVisual = (force = false) => {
    if (!customCursor) {
      return;
    }

    const revealVisible = isRevealCursorVisible();

    if (force) {
      customCursor.style.width = '14px';
      customCursor.style.height = '14px';
      customCursor.style.backgroundColor = spotlightDark;
      customCursor.style.boxShadow = '0 0 0 8px rgba(255, 205, 255, 0.18), 0 4px 10px rgba(17, 17, 17, 0.12)';
    }

    if (force || revealVisible !== lastRevealVisible) {
      document.body.classList.toggle('hero-reveal-cursor-active', revealVisible);
      lastRevealVisible = revealVisible;
    }
  };

  const drawDarkLayer = () => {
    if (!isRevealCursorVisible()) {
      if (darkLayerDrawn) {
        darkCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        darkLayerDrawn = false;
      }
      return;
    }

    darkCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const cx = pointerX - heroRect.left + canvasPadX;
    const cy = pointerY - heroRect.top + canvasPadY;
    const transitionRadius = minRadius + Math.max(14, Math.round(maxRadius * 0.18));
    const revealProgress = clamp((blobRadius - minRadius) / Math.max(transitionRadius - minRadius, 1), 0, 1);

    darkCtx.save();
    darkCtx.globalAlpha = 1;
    darkCtx.globalCompositeOperation = 'source-over';
    darkCtx.filter = 'none';
    darkCtx.shadowColor = 'transparent';
    darkCtx.shadowBlur = 0;
    darkCtx.beginPath();
    darkCtx.arc(cx, cy, blobRadius, 0, Math.PI * 2);
    darkCtx.fillStyle = spotlightDark;
    darkCtx.fill();

    if (revealProgress > 0.01 && revealCanvas) {
      darkCtx.save();
      darkCtx.beginPath();
      darkCtx.arc(cx, cy, blobRadius, 0, Math.PI * 2);
      darkCtx.clip();
      darkCtx.globalAlpha = revealProgress;
      darkCtx.drawImage(revealCanvas, 0, 0, canvasWidth, canvasHeight);
      darkCtx.restore();
    }

    darkCtx.restore();
    darkLayerDrawn = true;
  };

  const updateBlobTarget = (clientX, clientY) => {
    if (!heroRect || !titleMetrics) {
      return;
    }

    const inActiveTitleArea =
      clientX >= titleMetrics.left - activationPad &&
      clientX <= titleMetrics.right + activationPad &&
      clientY >= titleMetrics.top - activationPadTop &&
      clientY <= titleMetrics.bottom + activationPadBottom;

    if (!inActiveTitleArea) {
      pointerInside = false;
      blobTarget = minRadius;
      return;
    }

    const dx = Math.max(titleMetrics.left - clientX, 0, clientX - titleMetrics.right);
    const dy = Math.max(titleMetrics.top - clientY, 0, clientY - titleMetrics.bottom);
    const distance = Math.hypot(dx, dy);
    const activation = clamp(1 - distance / activationPad, 0, 1);

    if (activation <= 0.04) {
      pointerInside = false;
      blobTarget = minRadius;
      return;
    }

    pointerInside = true;
    blobTarget = minRadius + (maxRadius - minRadius) * smoothstep(activation);
  };

  const onMove = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    updateBlobTarget(pointerX, pointerY);
  };

  const onLeave = () => {
    pointerInside = false;
    blobTarget = minRadius;
    drawDarkLayer();
    syncCursorVisual();
  };

  const onScroll = () => {
    refreshViewportMetrics();
    updateBlobTarget(pointerX, pointerY);
    drawDarkLayer();
    syncCursorVisual();
  };

  const tick = () => {
    blobRadius += (blobTarget - blobRadius) * 0.095;
    if (Math.abs(blobTarget - blobRadius) < 0.03) {
      blobRadius = blobTarget;
    }
    blobRadius = Math.max(minRadius, blobRadius);
    drawDarkLayer();
    syncCursorVisual();
    rafId = window.requestAnimationFrame(tick);
  };

  const handleResize = () => {
    if (!desktopWidthQuery.matches) {
      darkCanvas.style.display = 'none';
      pointerInside = false;
      blobRadius = minRadius;
      blobTarget = minRadius;
      document.body.classList.remove('hero-reveal-cursor-active');
      lastRevealVisible = null;
      darkLayerDrawn = false;
      syncCursorVisual(true);
      return;
    }

    syncCanvasMetrics();
    blobRadius = Math.max(blobRadius, minRadius);
    blobTarget = Math.max(blobTarget, minRadius);
    syncCursorVisual(true);
    drawDarkLayer();
  };

  const init = () => {
    syncCanvasMetrics();
    blobRadius = minRadius;
    blobTarget = minRadius;
    syncCursorVisual(true);
    drawDarkLayer();
    rafId = window.requestAnimationFrame(tick);
  };

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(handleResize, 120);
  });

  desktopWidthQuery.addEventListener?.('change', handleResize);

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();

(() => {
  const customCursor = document.querySelector('.custom-cursor');

  if (!customCursor) {
    return;
  }

  const supportsDesktopCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktopWidthQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsDesktopCursor || reducedMotion || !desktopWidthQuery.matches) {
    return;
  }

  document.body.classList.add('has-custom-cursor');

  window.addEventListener(
    'mousemove',
    (event) => {
      customCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      customCursor.classList.add('is-visible');
    },
    { passive: true }
  );

  window.addEventListener('mousedown', () => {
    customCursor.classList.add('is-active');
  });

  window.addEventListener('mouseup', () => {
    customCursor.classList.remove('is-active');
  });

  const hideCursor = () => {
    customCursor.classList.remove('is-visible');
    customCursor.classList.remove('is-active');
    customCursor.classList.remove('is-black');
  };

  window.addEventListener('mouseleave', hideCursor);
  document.documentElement.addEventListener('mouseleave', hideCursor);
  window.addEventListener('blur', hideCursor);

  window.addEventListener('resize', () => {
    if (!desktopWidthQuery.matches) {
      document.body.classList.remove('has-custom-cursor');
      customCursor.classList.remove('is-visible', 'is-active', 'is-black');
      return;
    }
  });

  document.querySelectorAll('.meta-item:not(#project-schultz-featured .meta-item)').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    item.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('#project-schultz-featured .meta-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    link.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.schultz-explore-btn').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('body.moveit-dark-page .prototype-button').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('body.moveit-dark-page .moveit-detail-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    card.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

  document.querySelectorAll('.btn-dark:not(.btn-truffle-cta), .btn-light').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-black');
    });

    button.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-black');
    });
  });

})();

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
const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isProjectsPage = document.body.classList.contains('projects-page-body');

const projectSections = Array.from(document.querySelectorAll('.project-section'));
const projectProgressCurrent = document.querySelector('[data-project-progress-current]');
const projectProgressFill = document.querySelector('[data-project-progress-fill]');
const projectsProgress = document.querySelector('.projects-progress');
const projectsEnding = document.querySelector('.projects-ending');

if (isProjectsPage && projectSections.length && projectProgressCurrent) {
  const setActiveProject = (projectIndex) => {
    projectProgressCurrent.textContent = String(projectIndex).padStart(2, '0');
  };

  const updateProjectProgressFill = () => {
    if (!projectProgressFill || !projectSections.length) {
      return;
    }

    const firstSection = projectSections[0];
    const lastSection = projectSections[projectSections.length - 1];
    const start = firstSection.offsetTop;
    const end = lastSection.offsetTop + lastSection.offsetHeight - window.innerHeight;
    const total = Math.max(1, end - start);
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / total));

    projectProgressFill.style.transform = `scaleY(${progress})`;
  };

  const projectObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      const index = activeEntry.target.dataset.projectIndex;
      if (index) {
        setActiveProject(index);
      }
    },
    {
      threshold: [0.35, 0.5, 0.65],
      rootMargin: '-20% 0px -40% 0px'
    }
  );

  projectSections.forEach((section) => projectObserver.observe(section));
  setActiveProject(projectSections[0].dataset.projectIndex || '01');
  updateProjectProgressFill();

  window.addEventListener('scroll', updateProjectProgressFill, { passive: true });
  window.addEventListener('resize', updateProjectProgressFill);
}

if (isProjectsPage && projectsProgress && projectsEnding) {
  const endingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        projectsProgress.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -12% 0px'
    }
  );

  endingObserver.observe(projectsEnding);
}

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
const projectSelectorToggle = document.querySelector('.project-segmented-toggle');

if (projectSelectorButtons.length && truffleFeaturedPanel && schultzFeaturedPanel) {
  let projectSelectorIndicatorResetTimer = null;

  const positionProjectSelectorIndicator = (activeButton) => {
    if (!projectSelectorToggle || !activeButton) {
      return;
    }

    const toggleStyles = window.getComputedStyle(projectSelectorToggle);
    const inset = parseFloat(toggleStyles.paddingLeft) || 0;

    projectSelectorToggle.style.setProperty('--featured-pill-width', `${activeButton.offsetWidth}px`);
    projectSelectorToggle.style.setProperty('--featured-pill-x', `${activeButton.offsetLeft - inset}px`);
  };

  const animateProjectSelectorIndicator = () => {
    if (!projectSelectorToggle) {
      return;
    }

    projectSelectorToggle.classList.add('is-moving');
    if (projectSelectorIndicatorResetTimer) {
      window.clearTimeout(projectSelectorIndicatorResetTimer);
    }
    projectSelectorIndicatorResetTimer = window.setTimeout(() => {
      projectSelectorToggle.classList.remove('is-moving');
      projectSelectorIndicatorResetTimer = null;
    }, 460);
  };

  const setFeaturedProject = (projectKey) => {
    const showTruffle = projectKey === 'truffle';

    truffleFeaturedPanel.classList.toggle('is-hidden', !showTruffle);
    schultzFeaturedPanel.classList.toggle('is-hidden', showTruffle);

    if (projectSelectorToggle) {
      projectSelectorToggle.style.setProperty('--featured-pill-bg', showTruffle ? '#69D3B3' : '#131319');
      projectSelectorToggle.style.setProperty(
        '--featured-pill-shadow',
        showTruffle ? '0 8px 18px rgba(105, 211, 179, 0.34)' : '0 10px 22px rgba(17, 24, 39, 0.22)'
      );
      animateProjectSelectorIndicator();
      positionProjectSelectorIndicator(
        projectSelectorButtons.find((button) => button.dataset.featuredProject === projectKey)
      );
    }

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

  window.addEventListener('resize', () => {
    positionProjectSelectorIndicator(
      projectSelectorButtons.find((button) => button.classList.contains('is-active')) ?? projectSelectorButtons[0]
    );
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
