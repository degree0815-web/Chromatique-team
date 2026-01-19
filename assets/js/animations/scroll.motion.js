/**
 * ==========================================================================
 * Scroll-based Animations
 * ==========================================================================
 * 
 * GSAP ScrollTrigger animations for various sections:
 * - Fade in on scroll
 * - Parallax effects
 * - Staggered reveals
 * - Counter animations
 * - Horizontal scroll sections
 * 
 */

import { easings, durations, scrollTriggerPresets } from '../core/gsap.config.js';

class ScrollMotion {
  constructor() {
    this.animations = [];
    this.scrollTriggers = [];
  }

  /**
   * Initialize all scroll animations
   */
  init() {
    this.initFadeAnimations();
    this.initParallaxElements();
    this.initStaggerAnimations();
    this.initCounterAnimations();
    this.initRevealAnimations();
    this.initMarquee();
    this.initDescSecAnimation();
    this.initKvSecAnimation();

    console.log('📜 Scroll animations initialized');
  }

  /**
   * Fade in animations for [data-animate="fade"] elements
   */
  initFadeAnimations() {
    const elements = document.querySelectorAll('[data-animate="fade"]');

    elements.forEach(el => {
      const direction = el.dataset.direction || 'up';
      const delay = parseFloat(el.dataset.delay) || 0;

      let fromVars = { opacity: 0 };

      switch (direction) {
        case 'up':
          fromVars.y = 60;
          break;
        case 'down':
          fromVars.y = -60;
          break;
        case 'left':
          fromVars.x = 60;
          break;
        case 'right':
          fromVars.x = -60;
          break;
      }

      const anim = gsap.from(el, {
        ...fromVars,
        duration: durations.slow,
        ease: easings.dramatic,
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      this.animations.push(anim);
    });
  }

  /**
   * Parallax effects for [data-parallax] elements
   */
  initParallaxElements() {
    const elements = document.querySelectorAll('[data-parallax]');

    elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 50;

      const anim = gsap.to(el, {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      this.animations.push(anim);
    });
  }

  /**
   * Staggered animations for [data-stagger] containers
   */
  initStaggerAnimations() {
    const containers = document.querySelectorAll('[data-stagger]');

    containers.forEach(container => {
      const children = container.children;
      const staggerAmount = parseFloat(container.dataset.stagger) || 0.1;

      const anim = gsap.from(children, {
        opacity: 0,
        y: 40,
        duration: durations.normal,
        ease: easings.dramatic,
        stagger: staggerAmount,
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      this.animations.push(anim);
    });
  }

  /**
   * Counter animations for [data-counter] elements
   */
  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.counter) || 0;
      const duration = parseFloat(counter.dataset.duration) || 2;
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';

      const obj = { value: 0 };

      const anim = gsap.to(obj, {
        value: target,
        duration: duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          counter.textContent = prefix + Math.round(obj.value) + suffix;
        },
      });

      this.animations.push(anim);
    });
  }

  /**
   * Image/element reveal animations
   */
  initRevealAnimations() {
    const reveals = document.querySelectorAll('.img-reveal, .reveal-mask');

    reveals.forEach(el => {
      const isImgReveal = el.classList.contains('img-reveal');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (isImgReveal) {
        // Image reveal animation
        tl.to(el, {
          '--reveal-progress': 1,
          duration: durations.slower,
          ease: easings.expoInOut,
        })
          .to(el.querySelector('img'), {
            scale: 1,
            duration: durations.slower,
            ease: easings.expoOut,
          }, '-=0.8');
      } else {
        // Mask reveal animation
        const cover = el.querySelector('.reveal-mask__cover');
        if (cover) {
          tl.to(cover, {
            scaleX: 0,
            transformOrigin: 'right center',
            duration: durations.slower,
            ease: easings.expoInOut,
          });
        }
      }

      this.animations.push(tl);
    });
  }

  /**
   * Initialize descSec scroll animation
   * Items fade out upward and next item fades in
   */
  initDescSecAnimation() {
    const descSec = document.querySelector('.descSec');
    if (!descSec) return;

    const items = descSec.querySelectorAll('.descSec__item');
    if (items.length < 2) return;

    // Set initial states
    items.forEach((item, index) => {
      if (index === 0) {
        // First item starts visible
        gsap.set(item, { opacity: 1, y: 0, scale: 1 });
      } else {
        // Other items start hidden below
        gsap.set(item, { opacity: 0, y: 100, scale: 0.95 });
      }
    });

    // Create master timeline with ScrollTrigger
    // Each item has display time + transition time
    const itemDisplayTime = 1.5; // 아이템이 표시되는 시간
    const transitionDuration = 1; // 전환 애니메이션 시간

    // 총 타임라인 길이 계산: (표시시간 + 전환시간) * (아이템수 - 1) + 마지막 아이템 표시시간
    const totalTimelineDuration = (itemDisplayTime + transitionDuration) * (items.length - 1) + itemDisplayTime;
    const totalScrollHeight = window.innerHeight * totalTimelineDuration / itemDisplayTime;

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: descSec,
        start: 'top top',
        end: `+=${totalScrollHeight}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Create transitions for each item pair
    items.forEach((item, index) => {
      if (index < items.length - 1) {
        const nextItem = items[index + 1];
        // 각 아이템이 표시되는 시간 + 이전 전환 시간
        // 첫 번째 아이템: 0부터 시작
        // 두 번째 아이템: itemDisplayTime + transitionDuration 후 시작
        // 세 번째 아이템: (itemDisplayTime + transitionDuration) * 2 후 시작
        const timelinePosition = index * (itemDisplayTime + transitionDuration) + itemDisplayTime;

        // Fade out current item (move up) and fade in next item simultaneously
        masterTl.to(item, {
          opacity: 0,
          y: -100,
          scale: 0.95,
          duration: transitionDuration,
          ease: 'power2.inOut',
        }, timelinePosition)
          .fromTo(nextItem,
            { opacity: 0, y: 100, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: transitionDuration,
              ease: 'power2.inOut',
            },
            timelinePosition
          );
      }
    });

    this.animations.push(masterTl);
  }

  /**
   * Initialize kvSec background images scroll animation
   * Images move up sequentially as user scrolls (in HTML order)
   * HTML order: city -> mount -> bt -> cloud
   * Background remains fixed, only images move up
   * kvSec has 300vh height, kvSec__contents is fixed
   */
  initKvSecAnimation() {
    const kvSec = document.querySelector('.kvSec');
    if (!kvSec) return;

    const kvSecContents = kvSec.querySelector('.kvSec__contents');
    if (!kvSecContents) return;

    // Get images in HTML order from kvSec__contents
    const images = [
      kvSecContents.querySelector('.kvSec__city'),
      kvSecContents.querySelector('.kvSec__mount'),
      kvSecContents.querySelector('.kvSec__bt'),
      kvSecContents.querySelector('.kvSec__cloud'),
    ].filter(Boolean); // Remove null elements

    if (images.length === 0) return;

    // Total scroll distance for all animations (300vh = 3 viewport heights)
    // kvSec has min-height: 300vh, so animation occurs over this scroll distance
    const totalScrollDistance = window.innerHeight * 3;
    // Each image gets an equal portion of the scroll distance for sequential animation
    // Each image animates over 75vh (300vh / 4 images)
    const scrollPerImage = totalScrollDistance / images.length;
    const viewportHeight = window.innerHeight;

    images.forEach((image, index) => {
      // Each image animates in its own sequential scroll section
      // Calculate the start and end scroll positions for this specific image
      const sectionStart = index * scrollPerImage;
      const sectionEnd = (index + 1) * scrollPerImage;

      // Create separate ScrollTrigger for each image with different start/end positions
      // Each image moves up by viewport height (maintaining same ratio)
      const anim = gsap.to(image, {
        y: `-=${viewportHeight}px`, // Move up by viewport height
        ease: 'none',
        scrollTrigger: {
          trigger: kvSec,
          start: () => `top+=${sectionStart}px top`,
          end: () => `top+=${sectionEnd}px top`,
          scrub: 1, // Smooth scrubbing tied to scroll position
          invalidateOnRefresh: true,
        },
      });

      this.animations.push(anim);
    });
  }

  /**
   * Initialize marquee/infinite scroll text
   */
  initMarquee() {
    const marquees = document.querySelectorAll('.marquee');

    marquees.forEach(marquee => {
      const content = marquee.querySelector('.marquee__content');
      if (!content) return;

      // Clone content for seamless loop
      const clone = content.cloneNode(true);
      marquee.appendChild(clone);

      // Animate with GSAP for smoother control
      const tl = gsap.timeline({ repeat: -1 });

      tl.to([content, clone], {
        xPercent: -100,
        duration: 30,
        ease: 'none',
      });

      // Pause on hover
      marquee.addEventListener('mouseenter', () => tl.pause());
      marquee.addEventListener('mouseleave', () => tl.resume());

      this.animations.push(tl);
    });
  }

  /**
   * Create a pinned horizontal scroll section
   * @param {string} selector - CSS selector for the section
   */
  createHorizontalScroll(selector) {
    const section = document.querySelector(selector);
    if (!section) return null;

    const track = section.querySelector('.horizontal-section__track');
    const panels = section.querySelectorAll('.horizontal-section__panel');

    if (!track || !panels.length) return null;

    // Calculate total width
    const totalWidth = Array.from(panels).reduce((acc, panel) => {
      return acc + panel.offsetWidth;
    }, 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    tl.to(track, {
      x: -(totalWidth - window.innerWidth),
      ease: 'none',
    });

    this.animations.push(tl);

    return tl;
  }

  /**
   * Create a pinned section with content change
   * @param {string} selector - CSS selector for the section
   */
  createPinnedSection(selector) {
    const section = document.querySelector(selector);
    if (!section) return null;

    const items = section.querySelectorAll('[data-pinned-item]');
    if (!items.length) return null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${items.length * 100}%`,
        pin: true,
        scrub: true,
      },
    });

    items.forEach((item, index) => {
      if (index < items.length - 1) {
        tl.to(item, {
          opacity: 0,
          y: -50,
          duration: 1,
        })
          .fromTo(items[index + 1],
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1 },
            '-=0.5'
          );
      }
    });

    this.animations.push(tl);

    return tl;
  }

  /**
   * Refresh all ScrollTrigger instances
   */
  refresh() {
    ScrollTrigger.refresh();
  }

  /**
   * Kill all animations
   */
  destroy() {
    // Kill all animations
    this.animations.forEach(anim => {
      if (anim.kill) anim.kill();
    });

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    this.animations = [];
    this.scrollTriggers = [];
  }
}

// ========================================
// Export & Initialize
// ========================================

export default ScrollMotion;

export function initScrollMotion() {
  const scrollMotion = new ScrollMotion();
  scrollMotion.init();
  return scrollMotion;
}

// ========================================
// Scroll Progress Indicator
// ========================================

export function initScrollProgress(selector = '.scroll-progress__bar') {
  const progressBar = document.querySelector(selector);
  if (!progressBar) return;

  gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
}

