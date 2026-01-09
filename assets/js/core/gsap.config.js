/**
 * ==========================================================================
 * GSAP Configuration & Registration
 * ==========================================================================
 * 
 * Central configuration for GSAP and its plugins.
 * Handles plugin registration and global defaults.
 * 
 */

// ========================================
// Plugin Registration
// ========================================

/**
 * Register GSAP plugins
 * Call this function after GSAP is loaded
 */
export function registerGSAPPlugins() {
  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Register other plugins as needed
  // gsap.registerPlugin(SplitText); // Premium plugin
  // gsap.registerPlugin(ScrollSmoother); // Premium plugin
}

// ========================================
// Global Defaults
// ========================================

/**
 * Set global GSAP defaults
 */
export function setGSAPDefaults() {
  gsap.defaults({
    duration: 1,
    ease: 'power3.out',
  });

  // ScrollTrigger defaults
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      start: 'top 80%',
      end: 'bottom 20%',
    });
  }
}

// ========================================
// Easing Presets
// ========================================

export const easings = {
  // Standard easings
  smooth: 'power2.out',
  smoothInOut: 'power2.inOut',
  
  // Dramatic easings
  dramatic: 'power3.out',
  dramaticInOut: 'power3.inOut',
  
  // Bounce & Elastic
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.5)',
  
  // Custom cubic bezier (luxury feel)
  luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
  luxuryInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  
  // Expo for dramatic reveals
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
};

// ========================================
// Duration Presets
// ========================================

export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 1,
  slower: 1.5,
  slowest: 2,
};

// ========================================
// Animation Presets
// ========================================

export const animationPresets = {
  // Fade in
  fadeIn: {
    opacity: 0,
    duration: durations.normal,
    ease: easings.smooth,
  },

  // Slide up
  slideUp: {
    y: 60,
    opacity: 0,
    duration: durations.slow,
    ease: easings.dramatic,
  },

  // Slide from left
  slideLeft: {
    x: -60,
    opacity: 0,
    duration: durations.slow,
    ease: easings.dramatic,
  },

  // Slide from right
  slideRight: {
    x: 60,
    opacity: 0,
    duration: durations.slow,
    ease: easings.dramatic,
  },

  // Scale up
  scaleUp: {
    scale: 0.9,
    opacity: 0,
    duration: durations.slow,
    ease: easings.smooth,
  },

  // Reveal (for masked elements)
  reveal: {
    yPercent: 100,
    duration: durations.slower,
    ease: easings.expoOut,
  },
};

// ========================================
// ScrollTrigger Presets
// ========================================

export const scrollTriggerPresets = {
  // Standard trigger (plays once when entering)
  standard: {
    start: 'top 80%',
    toggleActions: 'play none none none',
  },

  // Scrub animation (tied to scroll position)
  scrub: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  },

  // Pin section
  pin: {
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: 1,
  },

  // Parallax
  parallax: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
};

// ========================================
// Utility Functions
// ========================================

/**
 * Create a stagger animation
 * @param {string} selector - CSS selector for elements
 * @param {object} fromVars - GSAP from variables
 * @param {number} stagger - Stagger amount
 * @param {object} scrollTriggerConfig - ScrollTrigger config
 */
export function createStaggerAnimation(selector, fromVars = {}, stagger = 0.1, scrollTriggerConfig = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return null;

  return gsap.from(elements, {
    ...animationPresets.slideUp,
    ...fromVars,
    stagger: stagger,
    scrollTrigger: {
      trigger: elements[0].parentElement,
      ...scrollTriggerPresets.standard,
      ...scrollTriggerConfig,
    },
  });
}

/**
 * Create a parallax effect
 * @param {string} selector - CSS selector for element
 * @param {number} speed - Parallax speed (negative = opposite direction)
 */
export function createParallax(selector, speed = 50) {
  const element = document.querySelector(selector);
  if (!element) return null;

  return gsap.to(element, {
    yPercent: speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      ...scrollTriggerPresets.parallax,
    },
  });
}

/**
 * Create a reveal animation with mask
 * @param {string} selector - CSS selector for element
 */
export function createReveal(selector) {
  const element = document.querySelector(selector);
  if (!element) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      ...scrollTriggerPresets.standard,
    },
  });

  // Animate the cover out
  tl.to(element.querySelector('.reveal-mask__cover'), {
    scaleX: 0,
    transformOrigin: 'right center',
    duration: durations.slower,
    ease: easings.expoInOut,
  });

  return tl;
}

/**
 * Kill all ScrollTriggers
 * Useful for cleanup or page transitions
 */
export function killAllScrollTriggers() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

/**
 * Refresh all ScrollTriggers
 * Call after dynamic content changes
 */
export function refreshScrollTriggers() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// ========================================
// Initialize
// ========================================

export function initGSAP() {
  registerGSAPPlugins();
  setGSAPDefaults();
  
  console.log('✨ GSAP initialized');
}

