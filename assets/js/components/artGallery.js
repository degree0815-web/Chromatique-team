/**
 * ==========================================================================
 * Art Gallery Component
 * ==========================================================================
 * 
 * Handles the art gallery slider with:
 * - Swiper integration
 * - Click to change perfume image
 * - Artwork information display
 * - Custom navigation
 * 
 */

import { swiperDefaults, breakpoints } from '../core/swiper.config.js';

class ArtGallery {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.selector = selector;
    this.options = options;
    this.swiper = null;

    // Elements
    this.prevBtn = null;
    this.nextBtn = null;
    this.artworkTitle = null;
    this.artworkArtist = null;

    // Track which slides are showing perfume
    this.perfumeActiveSlides = new Set();

    // Artwork data
    this.artworkData = [
      {
        title: '별이 빛나는 밤 (The Starry Night)',
        artist: '빈센트 반 고흐 (Vincent van Gogh)',
        perfume: '01'
      },
      {
        title: '수련 (Water Lilies)',
        artist: '클로드 모네 (Claude Monet)',
        perfume: '02'
      },
      {
        title: '라 그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)',
        artist: '조르주 쇠라 (Georges Seurat)',
        perfume: '03'
      },
      {
        title: '기억의 지속 (The Persistence of Memory)',
        artist: '살바도르 달리 (Salvador Dalí)',
        perfume: '04'
      },
      {
        title: '해바라기 (Sunflowers)',
        artist: '빈센트 반 고흐 (Vincent van Gogh)',
        perfume: '05'
      }
    ];
  }

  /**
   * Initialize the gallery
   */
  init() {
    if (!this.container) {
      console.warn(`Art gallery container not found: ${this.selector}`);
      return null;
    }

    // Get elements
    this.prevBtn = this.container.querySelector('.artGallerySec__nav--prev');
    this.nextBtn = this.container.querySelector('.artGallerySec__nav--next');
    this.artworkTitle = this.container.querySelector('#artworkTitle');
    this.artworkArtist = this.container.querySelector('#artworkArtist');

    // Create swiper instance
    this.createSwiper();

    // Setup click events
    this.setupClickEvents();

    console.log('🎨 Art gallery initialized');

    return this.swiper;
  }

  /**
   * Create the Swiper instance
   */
  createSwiper() {
    const config = {
      ...swiperDefaults,

      // Slides configuration
      slidesPerView: 1.5,
      spaceBetween: 40,
      centeredSlides: true,

      // Speed
      speed: 600,

      // Effect
      effect: 'slide',

      // Navigation
      navigation: {
        nextEl: this.nextBtn,
        prevEl: this.prevBtn,
      },

      // Breakpoints
      breakpoints: {
        [breakpoints.sm]: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        [breakpoints.md]: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        [breakpoints.lg]: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        [breakpoints.xl]: {
          slidesPerView: 3,
          spaceBetween: 60,
        },
      },

      // Events
      on: {
        init: () => this.onInit(),
        slideChange: () => this.onSlideChange(),
      },

      // Merge custom options
      ...this.options,
    };

    this.swiper = new Swiper(`${this.selector} .artGallerySec__swiper`, config);
  }

  /**
   * Called when swiper initializes
   */
  onInit() {
    this.updateArtworkInfo(0);
  }

  /**
   * Called when slide changes
   */
  onSlideChange() {
    if (!this.swiper) return;

    const realIndex = this.swiper.realIndex;
    this.updateArtworkInfo(realIndex);
  }

  /**
   * Setup click events on slides
   * Only active slide is clickable
   */
  setupClickEvents() {
    if (!this.swiper) return;

    this.swiper.slides.forEach((slide) => {
      slide.addEventListener('click', () => {
        // Only allow clicks on active slide
        if (!slide.classList.contains('swiper-slide-active')) {
          return;
        }

        const perfumeNumber = slide.getAttribute('data-perfume');
        const slideNumber = slide.getAttribute('data-slide');
        const artworkImg = slide.querySelector('.artGallerySec__artwork');

        if (!artworkImg) return;

        // Check if currently showing perfume or artwork
        const isPerfumeActive = this.perfumeActiveSlides.has(slideNumber);

        if (isPerfumeActive) {
          // Switch back to artwork
          this.switchToArtwork(artworkImg, slideNumber);
          this.perfumeActiveSlides.delete(slideNumber);
        } else {
          // Switch to perfume
          this.switchToPerfume(artworkImg, perfumeNumber, slideNumber);
          this.perfumeActiveSlides.add(slideNumber);
        }
      });
    });
  }

  /**
   * Switch slide image to perfume
   */
  switchToPerfume(imgElement, perfumeNumber, slideNumber) {
    const newSrc = `./assets/images/main/perfume${perfumeNumber}.png`;
    // Always store the current src as original (in case it's already changed)
    const originalSrc = imgElement.src || `./assets/images/main/slide${slideNumber}.png`;

    // Store original source (always update to current src)
    imgElement.dataset.original = originalSrc;

    // Check if this slide is active
    const slide = imgElement.closest('.swiper-slide');
    const isActive = slide && slide.classList.contains('swiper-slide-active');
    const targetScale = isActive ? 1.5 : 1.0;

    // Fade out and change image
    if (typeof gsap !== 'undefined') {
      gsap.to(imgElement, {
        opacity: 0,
        scale: isActive ? 1.45 : 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          imgElement.src = newSrc;
          imgElement.alt = `Perfume ${perfumeNumber}`;

          gsap.fromTo(imgElement,
            { opacity: 0, scale: isActive ? 1.45 : 0.95 },
            {
              opacity: 1,
              scale: targetScale,
              duration: 0.4,
              ease: 'power2.out',
            }
          );
        }
      });
    } else {
      // Fallback without GSAP
      imgElement.style.opacity = '0';
      imgElement.style.transform = `scale(${isActive ? 1.45 : 0.95})`;
      setTimeout(() => {
        imgElement.src = newSrc;
        imgElement.alt = `Perfume ${perfumeNumber}`;
        imgElement.style.opacity = '1';
        imgElement.style.transform = `scale(${targetScale})`;
      }, 300);
    }
  }

  /**
   * Switch slide image back to artwork
   */
  switchToArtwork(imgElement, slideNumber) {
    // Get original source, if it's just a filename, add the full path
    let originalSrc = imgElement.dataset.original;

    // If originalSrc doesn't start with './' or '/', it's just a filename
    if (originalSrc && !originalSrc.startsWith('./') && !originalSrc.startsWith('/') && !originalSrc.startsWith('http')) {
      originalSrc = `./assets/images/main/${originalSrc}.png`;
    }

    // Fallback to default path if no original stored
    if (!originalSrc) {
      originalSrc = `./assets/images/main/slide${slideNumber}.png`;
    }

    // Check if this slide is active
    const slide = imgElement.closest('.swiper-slide');
    const isActive = slide && slide.classList.contains('swiper-slide-active');
    const targetScale = isActive ? 1.5 : 1.0;

    // Fade out and change image
    if (typeof gsap !== 'undefined') {
      gsap.to(imgElement, {
        opacity: 0,
        scale: isActive ? 1.45 : 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          imgElement.src = originalSrc;
          imgElement.alt = `Artwork ${slideNumber}`;

          gsap.fromTo(imgElement,
            { opacity: 0, scale: isActive ? 1.45 : 0.95 },
            {
              opacity: 1,
              scale: targetScale,
              duration: 0.4,
              ease: 'power2.out',
            }
          );
        }
      });
    } else {
      // Fallback without GSAP
      imgElement.style.opacity = '0';
      imgElement.style.transform = `scale(${isActive ? 1.45 : 0.95})`;
      setTimeout(() => {
        imgElement.src = originalSrc;
        imgElement.alt = `Artwork ${slideNumber}`;
        imgElement.style.opacity = '1';
        imgElement.style.transform = `scale(${targetScale})`;
      }, 300);
    }
  }

  /**
   * Update artwork information
   */
  updateArtworkInfo(index) {
    const data = this.artworkData[index];
    if (!data) return;

    if (this.artworkTitle) {
      if (typeof gsap !== 'undefined') {
        gsap.to(this.artworkTitle, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            this.artworkTitle.textContent = data.title;
            gsap.to(this.artworkTitle, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        });
      } else {
        this.artworkTitle.style.opacity = '0';
        setTimeout(() => {
          this.artworkTitle.textContent = data.title;
          this.artworkTitle.style.opacity = '1';
        }, 200);
      }
    }

    if (this.artworkArtist) {
      if (typeof gsap !== 'undefined') {
        gsap.to(this.artworkArtist, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          delay: 0.1,
          onComplete: () => {
            this.artworkArtist.textContent = data.artist;
            gsap.to(this.artworkArtist, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        });
      } else {
        this.artworkArtist.style.opacity = '0';
        setTimeout(() => {
          this.artworkArtist.textContent = data.artist;
          this.artworkArtist.style.opacity = '1';
        }, 300);
      }
    }
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
   * Destroy the gallery
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

export default ArtGallery;

/**
 * Create and initialize an art gallery
 * @param {string} selector - CSS selector for gallery container
 * @param {object} options - Custom options
 * @returns {ArtGallery} ArtGallery instance
 */
export function createArtGallery(selector = '.artGallerySec', options = {}) {
  const gallery = new ArtGallery(selector, options);
  gallery.init();
  return gallery;
}
