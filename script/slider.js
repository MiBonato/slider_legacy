export class Slider {
  constructor({ containerSelector, images, config = {} }) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error(`${containerSelector} not found.`);
      return;
    }

    this.images = images;
    this.config = this.validateConfig(config);
    this.currentSlide = this.config.animation === 'fade' ? 0 : 1;
    this.trackElement = null;
    this.dots = [];
    this.autoplayInterval = null;
    this.isSliding = false;

    this.init();
  }

  validateConfig(config) {
    return {
      autoplay: typeof config.autoplay === 'boolean' ? config.autoplay : true,
      duration: typeof config.duration === 'number' && config.duration > 0 ? config.duration : 4500,
      showArrows: typeof config.showArrows === 'boolean' ? config.showArrows : true,
      showDots: typeof config.showDots === 'boolean' ? config.showDots : true,
      animation: ['slide', 'fade'].includes(config.animation) ? config.animation : 'slide',
      transition: typeof config.transition === 'string' ? config.transition : 'transform 0.5s ease-in-out'
    };
  }

  init() {
    this.container.innerHTML = '';
    this.container.classList.add('cs--main--container');

    this.trackElement = document.createElement('div');
    this.trackElement.className = 'slider--track';
    this.trackElement.id = 'Slider';

    if (this.config.animation === 'fade') {
      this.trackElement.classList.add('anim--fade');
    } else {
      this.trackElement.style.transition = this.config.transition;
    }
    this.container.appendChild(this.trackElement);

    const validSlides = this.images.map((img, i) => this.createSlide(img, i)).filter(Boolean);
    if (!validSlides.length) return;

    if (this.config.animation === 'slide') {
      const cloneLast = validSlides[validSlides.length - 1].cloneNode(true);
      const cloneFirst = validSlides[0].cloneNode(true);
      this.trackElement.appendChild(cloneLast);
      validSlides.forEach(slide => this.trackElement.appendChild(slide));
      this.trackElement.appendChild(cloneFirst);
      this.trackElement.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    } else {
      validSlides.forEach(slide => this.trackElement.appendChild(slide));
    }

    this.trackElement.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));

    if (this.config.showArrows) this.createArrows();
    if (this.config.showDots) this.createDots(validSlides.length);

    if (this.config.autoplay) this.setupAutoplay();

    this.setupDrag();
  }

  createSlide(data, index) {
    const sources = data?.src || {};
    const fallback = sources.mobile || sources.tablet || sources.desktop;
    if (!fallback) return null;

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
    img.src = fallback;
    img.alt = data.alt || '';
    picture.appendChild(img);

    const slide = document.createElement('div');
    slide.className = `slide anim--${this.config.animation}`;
    slide.dataset.index = index;
    if (this.config.animation === 'fade' && index === 0) slide.classList.add('active');
    slide.appendChild(picture);
    return slide;
  }

  createArrows() {
    const nav = document.createElement('div');
    nav.className = 'button--container';

    const left = document.createElement('button');
    left.className = 'slider--arrow left';
    left.setAttribute('aria-label', 'Previous');
    left.innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" width="4rem" height="7rem"><polygon fill="currentColor" points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5"/></svg>`;
    left.onclick = () => this.goTo('prev');

    const right = document.createElement('button');
    right.className = 'slider--arrow right';
    right.setAttribute('aria-label', 'Next');
    right.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" width="4rem" height="7rem"><polygon fill="currentColor" points="2.019,0.58 -0.035,2.634 10.646,13.316 -0.035,23.997 2.019,26.052 14.755,13.316"/></svg>`;
    right.onclick = () => this.goTo('next');

    nav.append(left, right);
    this.container.appendChild(nav);
  }

  createDots(count) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dot--container';

    this.dots = Array.from({ length: count }, (_, i) => {
      const btn = document.createElement('button');
      btn.className = 'slider--dot';
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.onclick = () => this.goTo(i);
      if (i === 0) btn.classList.add('active');
      wrapper.appendChild(btn);
      return btn;
    });

    this.container.appendChild(wrapper);
  }

  updateDots(index) {
    this.dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  goTo(target) {
    if (this.config.animation === 'fade') {
      if (typeof target === 'string') {
        this.currentSlide += target === 'next' ? 1 : -1;
        this.currentSlide = (this.currentSlide + this.dots.length) % this.dots.length;
      } else {
        this.currentSlide = target;
      }
      const slides = this.trackElement.querySelectorAll('.slide');
      slides.forEach((slide, i) => slide.classList.toggle('active', i === this.currentSlide));
      this.updateDots(this.currentSlide);
    } else {
      if (this.isSliding) return;
      this.isSliding = true;
      if (typeof target === 'string') {
        this.currentSlide += target === 'next' ? 1 : -1;
      } else {
        this.currentSlide = target + 1;
      }
      this.trackElement.style.transition = this.config.transition;
      this.trackElement.style.transform = `translateX(-${this.currentSlide * 100}%)`;
      this.trackElement.addEventListener('transitionend', () => this.checkEdges(), { once: true });

      let real = this.currentSlide - 1;
      if (real < 0) real = this.dots.length - 1;
      if (real >= this.dots.length) real = 0;
      this.updateDots(real);
    }
  }

  checkEdges() {
    const slides = this.trackElement.querySelectorAll('.slide');
    if (this.currentSlide === 0) {
      this.trackElement.style.transition = 'none';
      this.currentSlide = slides.length - 2;
      this.trackElement.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    } else if (this.currentSlide === slides.length - 1) {
      this.trackElement.style.transition = 'none';
      this.currentSlide = 1;
      this.trackElement.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    this.isSliding = false;
  }

  setupAutoplay() {
    const restart = () => {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = setInterval(() => this.goTo('next'), this.config.duration);
    };
    restart();
    this.container.addEventListener('mouseenter', () => clearInterval(this.autoplayInterval));
    this.container.addEventListener('mouseleave', restart);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') restart();
      else clearInterval(this.autoplayInterval);
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) restart();
      else clearInterval(this.autoplayInterval);
    }, { threshold: 0.1 });
    observer.observe(this.container);
  }

  setupDrag() {
    let startX = 0;
    let dragging = false;

    this.trackElement.addEventListener('mousedown', e => {
      startX = e.clientX;
      dragging = true;
    });

    this.trackElement.addEventListener('mouseup', e => {
      if (!dragging) return;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 50) this.goTo(diff > 0 ? 'prev' : 'next');
      dragging = false;
    });

    this.trackElement.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      clearInterval(this.autoplayInterval);
    });

    this.trackElement.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) this.goTo(diff > 0 ? 'prev' : 'next');
      if (this.config.autoplay) this.setupAutoplay();
    });
  }
}
