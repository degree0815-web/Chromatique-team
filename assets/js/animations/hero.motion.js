/**
 * ==========================================================================
 * Hero Section Animations
 * ==========================================================================
 * 
 * GSAP animations for the hero section:
 * - Title reveal animation
 * - Subtitle and CTA fade in
 * - Background parallax
 * - Scroll indicator animation
 * 
 */

import { easings, durations } from '../core/gsap.config.js';

class HeroMotion {
  constructor(selector = '.hero') {
    this.hero = document.querySelector(selector);
    this.timeline = null;
    
    // Elements
    this.eyebrow = null;
    this.title = null;
    this.subtitle = null;
    this.cta = null;
    this.scrollIndicator = null;
    this.bgImage = null;
  }
  
  /**
   * Initialize hero animations
   */
  init() {
    if (!this.hero) {
      console.warn('Hero section not found');
      return;
    }
    
    // Get elements
    this.eyebrow = this.hero.querySelector('.hero__eyebrow');
    this.title = this.hero.querySelector('.hero__title');
    this.subtitle = this.hero.querySelector('.hero__subtitle');
    this.cta = this.hero.querySelector('.hero__cta');
    this.scrollIndicator = this.hero.querySelector('.hero__scroll');
    this.bgImage = this.hero.querySelector('.hero__bg-image');
    
    // Create animations
    this.createIntroAnimation();
    this.createParallax();
    
    console.log('🎬 Hero animations initialized');
  }
  
  /**
   * Create the intro timeline animation
   */
  createIntroAnimation() {
    this.timeline = gsap.timeline({
      defaults: {
        ease: easings.dramatic,
      },
    });
    
    // Set initial states
    gsap.set([this.eyebrow, this.title, this.subtitle, this.cta, this.scrollIndicator], {
      opacity: 0,
    });
    
    // Eyebrow animation
    if (this.eyebrow) {
      this.timeline.fromTo(this.eyebrow,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: durations.normal },
        0.3
      );
    }
    
    // Title animation (with split text if available)
    if (this.title) {
      const words = this.title.querySelectorAll('.word span');
      
      if (words.length > 0) {
        // Animated word by word
        gsap.set(words, { yPercent: 100 });
        
        this.timeline.to(words, {
          yPercent: 0,
          duration: durations.slower,
          stagger: 0.05,
          ease: easings.expoOut,
        }, 0.5);
      } else {
        // Simple fade in
        this.timeline.fromTo(this.title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: durations.slow },
          0.5
        );
      }
    }
    
    // Subtitle animation
    if (this.subtitle) {
      this.timeline.fromTo(this.subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: durations.normal },
        '-=0.5'
      );
    }
    
    // CTA buttons animation
    if (this.cta) {
      const buttons = this.cta.querySelectorAll('.btn, .link-btn');
      
      this.timeline.fromTo(buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: durations.normal, stagger: 0.1 },
        '-=0.3'
      );
    }
    
    // Scroll indicator animation
    if (this.scrollIndicator) {
      this.timeline.fromTo(this.scrollIndicator,
        { opacity: 0 },
        { opacity: 1, duration: durations.normal },
        '-=0.2'
      );
    }
  }
  
  /**
   * Create parallax effect for background
   */
  createParallax() {
    if (!this.bgImage) return;
    
    gsap.to(this.bgImage, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: this.hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
  
  /**
   * Play the intro animation
   */
  play() {
    if (this.timeline) {
      this.timeline.play();
    }
  }
  
  /**
   * Pause the intro animation
   */
  pause() {
    if (this.timeline) {
      this.timeline.pause();
    }
  }
  
  /**
   * Restart the intro animation
   */
  restart() {
    if (this.timeline) {
      this.timeline.restart();
    }
  }
  
  /**
   * Kill all animations
   */
  destroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
    
    // Kill ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === this.hero || 
          trigger.vars.trigger === this.bgImage) {
        trigger.kill();
      }
    });
  }
}

// ========================================
// Utility: Split Text into Words
// ========================================

/**
 * Split text content into animated words
 * @param {HTMLElement} element - Element to split
 */
export function splitTextIntoWords(element) {
  if (!element) return;
  
  const text = element.textContent;
  const words = text.split(' ');
  
  element.innerHTML = words.map(word => `
    <span class="word"><span>${word}</span></span>
  `).join(' ');
}

// ========================================
// Export & Initialize
// ========================================

export default HeroMotion;

export function initHeroMotion(selector = '.hero') {
  const heroMotion = new HeroMotion(selector);
  heroMotion.init();
  return heroMotion;
}

