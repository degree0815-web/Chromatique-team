/**
 * ==========================================================================
 * Swiper Configuration
 * ==========================================================================
 * 
 * Central configuration for Swiper instances.
 * Contains presets and factory functions for different slider types.
 * 
 */

// ========================================
// Default Configuration
// ========================================

export const swiperDefaults = {
  // Accessibility
  a11y: {
    enabled: true,
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
    firstSlideMessage: 'This is the first slide',
    lastSlideMessage: 'This is the last slide',
  },
  
  // Keyboard control
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  
  // Grab cursor
  grabCursor: true,
  
  // Speed
  speed: 800,
  
  // Effect
  effect: 'slide',
};

// ========================================
// Breakpoint Presets
// ========================================

export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

// ========================================
// Swiper Presets
// ========================================

/**
 * Product Carousel Configuration
 * For the signature perfume section
 */
export const productSwiperConfig = {
  ...swiperDefaults,
  
  // Slides
  slidesPerView: 1.2,
  spaceBetween: 20,
  centeredSlides: true,
  
  // Loop
  loop: true,
  loopAdditionalSlides: 2,
  
  // Speed
  speed: 1000,
  
  // Breakpoints
  breakpoints: {
    [breakpoints.sm]: {
      slidesPerView: 1.5,
      spaceBetween: 24,
    },
    [breakpoints.md]: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    [breakpoints.lg]: {
      slidesPerView: 2.5,
      spaceBetween: 40,
    },
    [breakpoints.xl]: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
  
  // Navigation
  navigation: {
    nextEl: '.swiper-nav__btn--next',
    prevEl: '.swiper-nav__btn--prev',
  },
  
  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
};

/**
 * Testimonial Carousel Configuration
 */
export const testimonialSwiperConfig = {
  ...swiperDefaults,
  
  // Slides
  slidesPerView: 1,
  spaceBetween: 40,
  centeredSlides: true,
  
  // Loop
  loop: true,
  
  // Autoplay
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  
  // Effect
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  
  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

/**
 * Gallery Carousel Configuration
 */
export const gallerySwiperConfig = {
  ...swiperDefaults,
  
  // Slides
  slidesPerView: 1.5,
  spaceBetween: 16,
  
  // Freemode
  freeMode: {
    enabled: true,
    sticky: false,
    momentum: true,
    momentumRatio: 0.5,
  },
  
  // Breakpoints
  breakpoints: {
    [breakpoints.md]: {
      slidesPerView: 2.5,
      spaceBetween: 24,
    },
    [breakpoints.lg]: {
      slidesPerView: 3.5,
      spaceBetween: 32,
    },
  },
  
  // Scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    hide: false,
  },
};

/**
 * Hero Carousel Configuration
 * Full-screen hero slider
 */
export const heroSwiperConfig = {
  ...swiperDefaults,
  
  // Slides
  slidesPerView: 1,
  
  // Loop
  loop: true,
  
  // Speed
  speed: 1200,
  
  // Effect
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  
  // Autoplay
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
  },
  
  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class="${className}"><span class="progress"></span></span>`;
    },
  },
};

// ========================================
// Factory Functions
// ========================================

/**
 * Create a product swiper instance
 * @param {string} selector - CSS selector for swiper container
 * @param {object} customConfig - Custom configuration to merge
 * @returns {Swiper} Swiper instance
 */
export function createProductSwiper(selector, customConfig = {}) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`Swiper container not found: ${selector}`);
    return null;
  }

  const config = {
    ...productSwiperConfig,
    ...customConfig,
  };

  const swiper = new Swiper(selector, config);
  
  // Add slide counter update
  updateSlideCounter(swiper, '.swiper-nav__counter');
  
  return swiper;
}

/**
 * Create a testimonial swiper instance
 * @param {string} selector - CSS selector for swiper container
 * @param {object} customConfig - Custom configuration to merge
 * @returns {Swiper} Swiper instance
 */
export function createTestimonialSwiper(selector, customConfig = {}) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`Swiper container not found: ${selector}`);
    return null;
  }

  const config = {
    ...testimonialSwiperConfig,
    ...customConfig,
  };

  return new Swiper(selector, config);
}

/**
 * Create a gallery swiper instance
 * @param {string} selector - CSS selector for swiper container
 * @param {object} customConfig - Custom configuration to merge
 * @returns {Swiper} Swiper instance
 */
export function createGallerySwiper(selector, customConfig = {}) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`Swiper container not found: ${selector}`);
    return null;
  }

  const config = {
    ...gallerySwiperConfig,
    ...customConfig,
  };

  return new Swiper(selector, config);
}

// ========================================
// Utility Functions
// ========================================

/**
 * Update slide counter display
 * @param {Swiper} swiper - Swiper instance
 * @param {string} counterSelector - CSS selector for counter element
 */
function updateSlideCounter(swiper, counterSelector) {
  const counter = document.querySelector(counterSelector);
  if (!counter) return;

  const updateCounter = () => {
    const current = swiper.realIndex + 1;
    const total = swiper.slides.length - (swiper.loopedSlides ? swiper.loopedSlides * 2 : 0);
    
    counter.innerHTML = `
      <span class="current">${String(current).padStart(2, '0')}</span>
      <span class="separator">/</span>
      <span class="total">${String(total).padStart(2, '0')}</span>
    `;
  };

  // Initial update
  updateCounter();

  // Update on slide change
  swiper.on('slideChange', updateCounter);
}

/**
 * Sync two swiper instances (e.g., thumb gallery)
 * @param {Swiper} mainSwiper - Main swiper instance
 * @param {Swiper} thumbSwiper - Thumbnail swiper instance
 */
export function syncSwipers(mainSwiper, thumbSwiper) {
  mainSwiper.controller.control = thumbSwiper;
  thumbSwiper.controller.control = mainSwiper;
}

/**
 * Pause all swiper autoplay
 */
export function pauseAllSwipers() {
  const swipers = document.querySelectorAll('.swiper');
  swipers.forEach(el => {
    if (el.swiper && el.swiper.autoplay) {
      el.swiper.autoplay.stop();
    }
  });
}

/**
 * Resume all swiper autoplay
 */
export function resumeAllSwipers() {
  const swipers = document.querySelectorAll('.swiper');
  swipers.forEach(el => {
    if (el.swiper && el.swiper.autoplay) {
      el.swiper.autoplay.start();
    }
  });
}

/**
 * Destroy all swiper instances
 */
export function destroyAllSwipers() {
  const swipers = document.querySelectorAll('.swiper');
  swipers.forEach(el => {
    if (el.swiper) {
      el.swiper.destroy(true, true);
    }
  });
}

// ========================================
// Initialize
// ========================================

export function initSwipers() {
  console.log('🎠 Swiper configurations loaded');
}

