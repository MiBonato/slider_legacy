let currentSlide = 1;
let trackElement = null;
let dots = [];
let autoplayInterval;
let animationType = 'slide';
let transitionValue = 'transform 0.5s ease-in-out';
let isSliding = false;
const SUPPORTED_ANIMATIONS = ['slide', 'fade'];

function validateConfig(config = {}) {
  const validated = {};
  validated.autoplay = typeof config.autoplay === 'boolean' ? config.autoplay : true;
  validated.duration = typeof config.duration === 'number' && config.duration > 0 ? config.duration : 4500;
  validated.showArrows = typeof config.showArrows === 'boolean' ? config.showArrows : true;
  validated.showDots = typeof config.showDots === 'boolean' ? config.showDots : true;
  validated.animation = SUPPORTED_ANIMATIONS.includes(config.animation) ? config.animation : 'slide';
  validated.transition = (validated.animation === 'slide' && typeof config.transition === 'string') ? config.transition : 'transform 0.5s ease-in-out';
  return validated;
}

export function createSlider({ containerSelector, images, config }) {
  const {
    autoplay,
    duration,
    showArrows,
    showDots,
    animation,
    transition
  } = validateConfig(config);

  animationType = animation;
  transitionValue = transition;

  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`${containerSelector} not found.`);
    return;
  }

  container.innerHTML = '';
  container.classList.add('cs--main--container');

  // Track container
  trackElement = document.createElement('div');
  trackElement.id = 'Slider';
  trackElement.className = 'slider--track';
  if (animation === 'fade') {
    trackElement.classList.add('anim--fade');
  } else {
    trackElement.style.transition = transition;
  }
  container.appendChild(trackElement);

  // Slides
  const validSlides = images.map((img, index) => createImageSlide(img, index)).filter(Boolean);
  if (validSlides.length === 0) return;

  if (animationType === 'slide') {
    const cloneLast = validSlides[validSlides.length - 1].cloneNode(true);
    const cloneFirst = validSlides[0].cloneNode(true);

    trackElement.appendChild(cloneLast);
    validSlides.forEach(slide => trackElement.appendChild(slide));
    trackElement.appendChild(cloneFirst);
  
    currentSlide = 1;
    trackElement.style.transform = `translateX(-${currentSlide * 100}%)`;
  } else if (animationType === 'fade') {
    validSlides.forEach(slide => trackElement.appendChild(slide));
    currentSlide = 0;
  }

  trackElement.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));

  if (showArrows) createNavigationArrows(container);
  if (showDots) createDots(container, validSlides.length);

  if (autoplay) {
    startAutoplay(duration);
    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    container.addEventListener('mouseleave', () => startAutoplay(duration));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') clearInterval(autoplayInterval);
      else if (autoplay) startAutoplay(duration);
    });
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startAutoplay(duration);
      else clearInterval(autoplayInterval);
    }, { threshold: 0.1 });
    observer.observe(container);
  }

  SlideDrag(trackElement, autoplay, duration);
}

function createImageSlide(imageData, index) {
  const sources = imageData?.src || {};
  const fallbackSrc = sources.mobile || sources.tablet || sources.desktop;
  if (!fallbackSrc) return null;

  const picture = document.createElement('picture');
  if (sources.desktop) {
    const source = document.createElement('source');
    source.media = '(min-width: 1024px)';
    source.srcset = sources.desktop;
    picture.appendChild(source);
  }
  if (sources.tablet) {
    const source = document.createElement('source');
    source.media = '(min-width: 600px)';
    source.srcset = sources.tablet;
    picture.appendChild(source);
  }
  const img = document.createElement('img');
  img.src = fallbackSrc;
  img.alt = typeof imageData?.alt === 'string' ? imageData.alt : '';
  picture.appendChild(img);

  const slide = document.createElement('div');
  slide.classList.add('slide', `anim--${animationType}`);
  if (animationType === 'fade' && index === 0) slide.classList.add('active');
  slide.appendChild(picture);

  return slide;
}

function createNavigationArrows(container) {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button--container';

  const leftArrow = document.createElement('button');
  leftArrow.className = 'slider--arrow left';
  leftArrow.setAttribute('aria-label', 'Show previous slide');
  leftArrow.setAttribute('title', 'Previous');
  leftArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" width="4rem" height="7rem"><polygon fill="rgba(255,255,255,50%)" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5"/></svg>`;
  leftArrow.onclick = () => goToSlide('prev');

  const rightArrow = document.createElement('button');
  rightArrow.className = 'slider--arrow right';
  rightArrow.setAttribute('aria-label', 'Show next slide');
  rightArrow.setAttribute('title', 'Next');
  rightArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" width="4rem" height="7rem"><polygon fill="rgba(255,255,255,50%)" points="2.019,0.58 -0.035,2.634 10.646,13.316 -0.035,23.997 2.019,26.052 14.755,13.316"/></svg>`;
  rightArrow.onclick = () => goToSlide('next');

  buttonContainer.appendChild(leftArrow);
  buttonContainer.appendChild(rightArrow);
  container.appendChild(buttonContainer);
}

function createDots(container, count) {
  const dotContainer = document.createElement('div');
  dotContainer.className = 'dot--container';

  dots = [];
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className = 'slider--dot';
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.onclick = () => goToSlide(i);
    dotContainer.appendChild(btn);
    dots.push(btn);
  }
  dots[0]?.classList.add('active');
  container.appendChild(dotContainer);
}

function goToSlide(target) {
  if (animationType === 'fade') {
    if (typeof target === 'string') {
      currentSlide += target === 'next' ? 1 : -1;
      if (currentSlide === -1 ){
        currentSlide = dots.length - 1;
      }
      if (currentSlide >= dots.length){
        currentSlide = 0;
      }
    } else {
      currentSlide = target;
    }
    const slides = trackElement.querySelectorAll('.slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });
    updateDots(currentSlide)
  }

  if (animationType === 'slide') {
    if (isSliding) return;
    isSliding = true;
    if (typeof target === 'string') {
      currentSlide += target === 'next' ? 1 : -1;
    } else {
      currentSlide = target + 1;
    }
    trackElement.style.transition = transitionValue;
    trackElement.style.transform = `translateX(-${currentSlide * 100}%)`;
    trackElement.addEventListener('transitionend', checkLoopEdges, { once: true });
    let realIndex = currentSlide - 1;
    if (realIndex >= dots.length){
      realIndex = 0;
    }
    if (realIndex === -1 ){
      realIndex = dots.length - 1;
    }
    updateDots(realIndex)
  }
}

function checkLoopEdges() {
  const slides = trackElement.querySelectorAll('.slide');
  if (currentSlide === 0) {
    trackElement.style.transition = 'none';
    currentSlide = slides.length - 2;
    trackElement.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  if (currentSlide === slides.length - 1) {
    trackElement.style.transition = 'none';
    currentSlide = 1;
    trackElement.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  isSliding = false;
}

function updateDots(currentSlide) {
  if (!Array.isArray(dots) || !dots.length) return;
  let realIndex = currentSlide;
  dots.forEach((dot, idx) => {
    const isActive = idx === realIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function startAutoplay(duration) {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => goToSlide('next'), duration);
}

function SlideDrag(track, autoplayEnabled, duration) {
  let startX = 0;
  let dragging = false;

  track.addEventListener('mousedown', e => {
    startX = e.clientX;
    dragging = true;
  });

  track.addEventListener('mouseup', e => {
    if (!dragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? 'prev' : 'next');
    dragging = false;
  });

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    clearInterval(autoplayInterval);
  });

  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? 'prev' : 'next');
    if (autoplayEnabled) startAutoplay(duration);
  });
}

window.goToSlide = goToSlide;
