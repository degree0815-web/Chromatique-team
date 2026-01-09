/**
 * ==========================================================================
 * Product Swiper Component
 * ==========================================================================
 * 
 * Handles the product/perfume carousel with:
 * - Custom navigation
 * - GSAP integration for enhanced animations
 * - Slide counter
 * - Responsive behavior
 * 
 */

import { productSwiperConfig } from '../core/swiper.config.js';

class ProductSwiper {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.selector = selector;
    this.options = options;
    this.swiper = null;
    
    // Elements
    this.prevBtn = null;
    this.nextBtn = null;
    this.counter = null;
    this.progressBar = null;
  }
  
  /**
   * Initialize the swiper
   */
  init() {
    if (!this.container) {
      console.warn(`Product swiper container not found: ${this.selector}`);
      return null;
    }
    
    // Get navigation elements
    this.prevBtn = this.container.parentElement?.querySelector('.swiper-nav__btn--prev');
    this.nextBtn = this.container.parentElement?.querySelector('.swiper-nav__btn--next');
    this.counter = this.container.parentElement?.querySelector('.swiper-nav__counter');
    this.progressBar = this.container.parentElement?.querySelector('.swiper-progress__bar');
    
    // Create swiper instance
    this.createSwiper();
    
    // Setup additional features
    this.setupProgress();
    this.setupHoverEffects();
    
    console.log('🎠 Product swiper initialized');
    
    return this.swiper;
  }
  
  /**
   * Create the Swiper instance
   */
  createSwiper() {
    const config = {
      ...productSwiperConfig,
      
      // Custom navigation
      navigation: {
        nextEl: this.nextBtn,
        prevEl: this.prevBtn,
      },
      
      // Events
      on: {
        init: () => this.onInit(),
        slideChange: () => this.onSlideChange(),
        progress: (swiper, progress) => this.onProgress(progress),
      },
      
      // Merge custom options
      ...this.options,
    };
    
    this.swiper = new Swiper(this.selector, config);
  }
  
  /**
   * Called when swiper initializes
   */
  onInit() {
    this.updateCounter();
    this.animateActiveSlide();
  }
  
  /**
   * Called when slide changes
   */
  onSlideChange() {
    this.updateCounter();
    this.animateActiveSlide();
  }
  
  /**
   * Update progress bar
   */
  onProgress(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }
  }
  
  /**
   * Update slide counter
   */
  updateCounter() {
    if (!this.counter || !this.swiper) return;
    
    const current = this.swiper.realIndex + 1;
    const total = this.swiper.slides.length - (this.swiper.loopedSlides ? this.swiper.loopedSlides * 2 : 0);
    
    this.counter.innerHTML = `
      <span class="current">${String(current).padStart(2, '0')}</span>
      <span class="separator">/</span>
      <span class="total">${String(total).padStart(2, '0')}</span>
    `;
    
    // Animate counter update
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(this.counter.querySelector('.current'),
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }
  
  /**
   * Setup progress bar
   */
  setupProgress() {
    if (!this.progressBar) return;
    
    // Initial progress
    if (this.swiper) {
      const progress = this.swiper.progress;
      this.progressBar.style.width = `${progress * 100}%`;
    }
  }
  
  /**
   * Animate the active slide
   */
  animateActiveSlide() {
    if (typeof gsap === 'undefined' || !this.swiper) return;
    
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    if (!activeSlide) return;
    
    const card = activeSlide.querySelector('.product-card');
    if (!card) return;
    
    // Animate card content
    const content = card.querySelector('.product-card__content');
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    }
  }
  
  /**
   * Setup hover effects on slides
   */
  setupHoverEffects() {
    if (!this.swiper) return;
    
    this.swiper.slides.forEach(slide => {
      const card = slide.querySelector('.product-card');
      if (!card) return;
      
      card.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card.querySelector('.product-card__image'), {
            scale: 1.05,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card.querySelector('.product-card__image'), {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });
    });
  }
  
  /**
   * Go to specific slide
   */
  goTo(index) {
    if (this.swiper) {
      this.swiper.slideToLoop(index);
    }
  }
  
  /**
   * Go to next slide
   */
  next() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
  
  /**
   * Go to previous slide
   */
  prev() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }
  
  /**
   * Destroy the swiper
   */
  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}

// ========================================
// Export & Factory Function
// ========================================

export default ProductSwiper;

/**
 * Create and initialize a product swiper
 * @param {string} selector - CSS selector for swiper container
 * @param {object} options - Custom options
 * @returns {ProductSwiper} ProductSwiper instance
 */
export function createProductSwiper(selector = '.product-swiper', options = {}) {
  const swiper = new ProductSwiper(selector, options);
  swiper.init();
  return swiper;
}

