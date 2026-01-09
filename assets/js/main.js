/**
 * ==========================================================================
 * Main JavaScript Entry Point
 * ==========================================================================
 * 
 * Chromatique - Premium Perfume Brand
 * 
 * This file initializes all modules and manages the application lifecycle.
 * 
 */

// ========================================
// Imports
// ========================================

import { initGSAP, refreshScrollTriggers } from './core/gsap.config.js';
import { initSwipers } from './core/swiper.config.js';
import { initHeader } from './components/header.js';
import { createProductSwiper } from './components/productSwiper.js';
import { initHeroMotion } from './animations/hero.motion.js';
import { initScrollMotion, initScrollProgress } from './animations/scroll.motion.js';

// ========================================
// Application State
// ========================================

const App = {
  isLoaded: false,
  isAnimating: false,
  instances: {
    header: null,
    productSwiper: null,
    heroMotion: null,
    scrollMotion: null,
  },
};

// ========================================
// Initialization
// ========================================

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 Chromatique - Initializing...');
  
  // Initialize GSAP
  initGSAP();
  initSwipers();
  
  // Initialize components
  initComponents();
  
  // Initialize animations
  initAnimations();
  
  // Setup event listeners
  setupEventListeners();
  
  // Mark as loaded
  App.isLoaded = true;
  document.body.classList.add('is-loaded');
  
  console.log('✅ Chromatique - Ready');
}

/**
 * Initialize UI components
 */
function initComponents() {
  // Header
  App.instances.header = initHeader();
  
  // Product Swiper
  if (document.querySelector('.product-swiper')) {
    App.instances.productSwiper = createProductSwiper('.product-swiper');
  }
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Hero animations
  if (document.querySelector('.hero')) {
    App.instances.heroMotion = initHeroMotion('.hero');
  }
  
  // Scroll-based animations
  App.instances.scrollMotion = initScrollMotion();
  
  // Scroll progress indicator
  initScrollProgress();
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
  // Refresh ScrollTrigger on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      refreshScrollTriggers();
    }, 250);
  });
  
  // Refresh ScrollTrigger on font load
  if (document.fonts) {
    document.fonts.ready.then(() => {
      refreshScrollTriggers();
    });
  }
  
  // Handle smooth scroll to anchors
  setupSmoothScroll();
  
  // Handle loading screen
  hideLoadingScreen();
}

/**
 * Setup smooth scroll for anchor links
 */
function setupSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      
      // Use GSAP for smooth scroll
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: target,
          offsetY: 80, // Account for fixed header
        },
        ease: 'power3.inOut',
      });
    });
  });
}

/**
 * Hide loading screen with animation
 */
function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (!loadingScreen) return;
  
  // Animate loading progress
  const progressBar = loadingScreen.querySelector('.loading-screen__progress-bar');
  const counter = loadingScreen.querySelector('.loading-screen__counter');
  
  const tl = gsap.timeline({
    onComplete: () => {
      loadingScreen.remove();
    },
  });
  
  // Simulate loading progress
  if (progressBar) {
    tl.to(progressBar, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: function() {
        if (counter) {
          const progress = Math.round(this.progress() * 100);
          counter.textContent = `${progress}%`;
        }
      },
    });
  }
  
  // Fade out loading screen
  tl.to(loadingScreen, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  });
}

// ========================================
// DOM Ready
// ========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ========================================
// Export for debugging
// ========================================

window.ChromatiqueApp = App;

