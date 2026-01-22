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
          start: 'top 60%',
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
        // Set initial scale to 1 to prevent scale changes
        const img = el.querySelector('img');
        if (img) {
          gsap.set(img, { scale: 1 });
        }

        tl.to(el, {
          '--reveal-progress': 1,
          duration: durations.slower,
          ease: easings.expoInOut,
        });
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

    // Wait for layout to be ready before initializing
    // This prevents white screen on refresh/resize
    const initAnimation = () => {
      // Ensure descSec is visible and has dimensions
      if (descSec.offsetHeight === 0) {
        // Retry after a short delay if element is not ready
        setTimeout(initAnimation, 100);
        return;
      }

      // Set initial states with force3D for better performance
      items.forEach((item, index) => {
        if (index === 0) {
          // First item starts visible
          gsap.set(item, {
            opacity: 1,
            y: 0,
            scale: 1,
            visibility: 'visible',
            display: 'flex', // Ensure display is set
            force3D: true
          });
        } else {
          // Other items start hidden below
          gsap.set(item, {
            opacity: 0,
            y: 100,
            scale: 1,
            visibility: 'visible', // Keep visible for layout but transparent
            display: 'flex', // Ensure display is set
            force3D: true
          });
        }
      });

      // Create master timeline with ScrollTrigger
      // 세 아이템이 균등한 비율을 차지하도록 설정
      const transitionDuration = 1; // 전환 애니메이션 시간
      const pauseAfterOpacity1 = 0.5; // opacity: 1이 된 후 대기 시간
      const extraTimeAfterLastItem = 3; // 마지막 아이템 표시 후 추가 여유 시간

      // 각 아이템이 차지하는 시간을 균등하게 계산
      // 각 아이템 = pause + 표시시간 + 전환시간 (마지막 아이템은 전환시간 없음)
      // 마지막 아이템 표시 후 여유시간 추가
      const itemCount = items.length;
      const baseTimePerItem = 2; // 기본 시간 단위 (초)
      const itemDisplayTime = baseTimePerItem; // 각 아이템이 표시되는 시간 (균등하게 조정)

      // 총 타임라인 길이 계산
      // 각 아이템: pause + 표시시간 + 전환시간 (마지막 아이템은 전환시간 없음)
      // 마지막 아이템 표시 후 여유시간 추가
      const totalTimelineDuration = (pauseAfterOpacity1 + itemDisplayTime + transitionDuration) * (itemCount - 1) +
        (pauseAfterOpacity1 + itemDisplayTime) + extraTimeAfterLastItem;
      const totalScrollHeight = window.innerHeight * totalTimelineDuration / baseTimePerItem;

      // Kill any existing ScrollTrigger for this section
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.trigger === descSec) {
          trigger.kill();
        }
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: descSec,
          start: 'top top',
          end: `+=${totalScrollHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculate on resize
          refreshPriority: 1, // Higher priority for refresh
        },
      });

      // Create transitions for each item pair
      // 각 아이템이 균등한 비율을 차지하도록 타임라인 구성
      items.forEach((item, index) => {
        // 각 아이템이 opacity: 1이 되는 시점 계산
        let currentItemOpacity1Time;
        if (index === 0) {
          // 첫 번째 아이템: 0부터 opacity: 1
          currentItemOpacity1Time = 0;
        } else {
          // 이후 아이템: 이전 아이템의 시작 + pause + 표시시간 + 전환시간
          currentItemOpacity1Time = index * (pauseAfterOpacity1 + itemDisplayTime + transitionDuration);
        }

        // 각 아이템이 opacity: 1이 된 후 0.5초 pause 추가
        masterTl.to({}, { duration: pauseAfterOpacity1 }, currentItemOpacity1Time);

        if (index < items.length - 1) {
          const nextItem = items[index + 1];

          // 전환 시작 시점 계산 (각 아이템이 균등한 비율을 차지)
          // 각 아이템 = pause + 표시시간
          // 전환 시작 = pause + 표시시간
          const transitionStartPosition = currentItemOpacity1Time + pauseAfterOpacity1 + itemDisplayTime;

          // Fade out current item (move up) and fade in next item simultaneously
          masterTl.to(item, {
            opacity: 0,
            y: -100,
            scale: 1, // Keep scale at 1
            duration: transitionDuration,
            ease: 'power2.inOut',
            force3D: true,
          }, transitionStartPosition)
            .fromTo(nextItem,
              { opacity: 0, y: 100, scale: 1, force3D: true }, // Set initial scale to 1
              {
                opacity: 1,
                y: 0,
                scale: 1, // Keep scale at 1
                duration: transitionDuration,
                ease: 'power2.inOut',
                force3D: true,
              },
              transitionStartPosition
            );
        } else {
          // 마지막 아이템: 완전히 표시된 후 1초 pause 추가
          const lastItemDisplayEndTime = currentItemOpacity1Time + pauseAfterOpacity1 + itemDisplayTime;
          masterTl.to({}, { duration: 3 }, lastItemDisplayEndTime);
        }
      });

      this.animations.push(masterTl);
    };

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnimation);
    } else {
      // Use requestAnimationFrame to ensure layout is calculated
      requestAnimationFrame(() => {
        setTimeout(initAnimation, 0);
      });
    }
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
      kvSecContents.querySelector('.kvSec__bt'),
      kvSecContents.querySelector('.kvSec__mount'),
      kvSecContents.querySelector('.kvSec__city'),
      kvSecContents.querySelector('.kvSec__cloud'),
    ].filter(Boolean); // Remove null elements

    if (images.length === 0) return;

    // Total scroll distance for all animations
    // 4 images + 1 second pause after last image (approximately 1 viewport height)
    // kvSec has min-height: 400vh, but we add extra space for the pause
    const pauseDistance = window.innerHeight * 1; // 1 second pause (approximately 1 viewport height)
    const totalScrollDistance = window.innerHeight * 4 + pauseDistance;
    // Each image gets an equal portion of the scroll distance for sequential animation
    // Last image gets extra space for the pause
    const scrollPerImage = window.innerHeight * 1; // Each image animates over 100vh
    const viewportHeight = window.innerHeight;

    // Set initial state: kvSec__contents is fixed
    gsap.set(kvSecContents, { position: 'fixed' });

    // Change kvSec__contents from fixed to sticky when next section (introSec) is detected
    const introSec = document.querySelector('.introSec');
    if (introSec) {
      ScrollTrigger.create({
        trigger: introSec,
        start: 'top bottom',
        end: 'top top',
        onEnter: () => {
          // When introSec reaches the top, change position to sticky
          gsap.set(kvSecContents, { position: 'sticky' });
        },
        onLeaveBack: () => {
          // When scrolling back up before introSec, change back to fixed
          gsap.set(kvSecContents, { position: 'fixed' });
        },
        invalidateOnRefresh: true,
      });
    }

    images.forEach((image, index) => {
      // Each image animates in its own sequential scroll section
      // Calculate the start and end scroll positions for this specific image
      const sectionStart = index * scrollPerImage;
      const isLastImage = index === images.length - 1;

      // Last image gets extra space for pause after animation completes
      // Animation completes in first 80% of section, then pause for remaining 20%
      const sectionEnd = isLastImage
        ? (index + 1) * scrollPerImage + pauseDistance // Last image: animation + pause
        : (index + 1) * scrollPerImage; // Other images: normal animation

      // Set initial state: image starts above (moved up) and invisible
      gsap.set(image, {
        opacity: 0,
        y: `-=${viewportHeight}px`, // Start position: above viewport
      });

      // Create timeline for this image with both movement and fade in
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: kvSec,
          start: () => `top+=${sectionStart}px top`,
          end: () => `top+=${sectionEnd}px top`,
          scrub: 1, // Smooth scrubbing tied to scroll position
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (isLastImage) {
              const progress = self.progress;
              // Last image: animation completes at 80% progress, then pause
              const animationEndProgress = 0.8;

              if (progress <= animationEndProgress) {
                // Animation phase (0% to 80%)
                const animationProgress = progress / animationEndProgress;
                const currentY = -viewportHeight * (1 - animationProgress);
                const currentOpacity = animationProgress;
                gsap.set(image, {
                  y: `${currentY}px`,
                  opacity: currentOpacity,
                });
              } else {
                // Pause phase (80% to 100%) - image stays at final position
                gsap.set(image, {
                  y: '0px',
                  opacity: 1,
                });
              }
            }
          },
        },
      });

      // For non-last images, use normal animation
      if (!isLastImage) {
        // Move down animation (full duration) - image comes down to original position
        tl.to(image, {
          y: '0px', // Move down to original position
          ease: 'none',
        });

        // Fade in animation (starts from beginning)
        // opacity goes from 0 to 1 as image moves down
        tl.to(image, {
          opacity: 1,
          ease: 'none',
        }, '-=98%'); // Overlap with movement animation
      } else {
        // Last image: animation happens in onUpdate callback
        // Set initial values for timeline (timeline still needed for ScrollTrigger)
        tl.to(image, {
          y: '0px',
          opacity: 1,
          ease: 'none',
        });
      }

      this.animations.push(tl);
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

