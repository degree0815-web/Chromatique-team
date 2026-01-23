/**
 * ==========================================================================
 * Sub-2 Page Scripts
 * ==========================================================================
 * 
 * Page-specific JavaScript for sub-2 page
 * Perfume List Swiper initialization and data sync
 * 
 */

// ========================================
// Imports
// ========================================

import { initHeader } from './components/header.js';

// ========================================
// Perfume List Swiper
// ========================================

function initPerfumeListSwiper() {
    const thumbsSwiper = new Swiper('.perfume-list__thumbs', {
        spaceBetween: 24,
        slidesPerView: 9.5,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: {
                slidesPerView: 3.5,
                spaceBetween: 12,
            },
            768: {
                slidesPerView: 4.5,
                spaceBetween: 16,
            },
            1200: {
                slidesPerView: 6.5,
                spaceBetween: 20,
            },
            1470: {
                slidesPerView: 7.5,
                spaceBetween: 24,
            },
        },
    });

    const bgSwiper = new Swiper('.perfume-list__bg', {
        // effect: 'fade',
        // fadeEffect: {
        //     crossFade: true,
        // },
        navigation: {
            nextEl: '.perfume-list__nav .swiper-button-next',
            prevEl: '.perfume-list__nav .swiper-button-prev',
        },
        thumbs: {
            swiper: thumbsSwiper,
        },
        on: {
            slideChange: function () {
                updateInfoContent(this.realIndex);
            },
            init: function () {
                // Swiper 초기화 후 높이 업데이트
                setTimeout(() => {
                    const section = document.querySelector('.perfume-list');
                    const bg = document.querySelector('.perfume-list__bg');
                    if (section && bg) {
                        bg.style.height = section.offsetHeight + 'px';
                    }
                }, 100);
            },
        },
    });

    // Initial info content update
    updateInfoContent(0);

    return { bgSwiper, thumbsSwiper };
}

// ========================================
// Update Info Content
// ========================================

function updateInfoContent(index) {
    const slides = document.querySelectorAll('.perfume-list__bg .swiper-slide');
    if (!slides[index]) return;

    const slide = slides[index];
    const perfumeImg = slide.dataset.perfume;
    const title = slide.dataset.title;
    const subtitle = slide.dataset.subtitle;
    const descTop = slide.dataset.descTop;
    const descMiddle = slide.dataset.descMiddle;
    const descBase = slide.dataset.descBase;
    const artTitle = slide.dataset.artTitle;
    const artArtist = slide.dataset.artArtist;
    const artDesc = slide.dataset.artDesc;

    const infoImage = document.querySelector('.perfume-list__info-image img');
    const infoTitle = document.querySelector('.perfume-list__info-title');
    const infoSubtitle = document.querySelector('.perfume-list__info-subtitle');
    const infoNotesTop = document.querySelector('[data-notes="top"]');
    const infoNotesMiddle = document.querySelector('[data-notes="middle"]');
    const infoNotesBase = document.querySelector('[data-notes="base"]');
    const infoArtTitle = document.querySelector('.perfume-list__info-art-title');
    const infoArtArtist = document.querySelector('.perfume-list__info-art-artist');
    const infoArtDesc = document.querySelector('.perfume-list__info-art-desc');

    // Graph values
    const graphSmokyLeather = slide.dataset.graphSmokyLeather || '0';
    const graphMusk = slide.dataset.graphMusk || '0';
    const graphAldehyde = slide.dataset.graphAldehyde || '0';

    // Graph labels
    const graphLabelFirst = slide.dataset.graphLabelFirst || 'First';
    const graphLabelSecond = slide.dataset.graphLabelSecond || 'Second';
    const graphLabelThird = slide.dataset.graphLabelThird || 'Third';

    if (infoImage) infoImage.src = perfumeImg;
    if (infoTitle) infoTitle.textContent = title;
    if (infoSubtitle) infoSubtitle.textContent = subtitle;

    // Update notes (Top, Middle, Base)
    updateNotes(infoNotesTop, descTop);
    updateNotes(infoNotesMiddle, descMiddle);
    updateNotes(infoNotesBase, descBase);

    // Align labels to match longest label (middle) with 20px gap
    alignNoteLabels();

    if (infoArtTitle) infoArtTitle.textContent = artTitle;
    if (infoArtArtist) infoArtArtist.textContent = artArtist;
    if (infoArtDesc) infoArtDesc.textContent = artDesc;

    // Update graph labels
    updateGraphLabels(graphLabelFirst, graphLabelSecond, graphLabelThird);

    // Update graphs
    updateGraphs(graphSmokyLeather, graphMusk, graphAldehyde);
}

// ========================================
// Update Notes
// ========================================

function updateNotes(container, notesText) {
    if (!container || !notesText) return;

    // Remove "Top ", "Middle ", "Base " prefix if present
    let cleanNotes = notesText.replace(/^(Top|Middle|Base)\s+/i, '');

    // Clear container and set as single text content (one bundle)
    container.textContent = cleanNotes;
}

// ========================================
// Align Note Labels
// ========================================

function alignNoteLabels() {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
        const labels = document.querySelectorAll('.perfume-list__info-desc-label');
        if (labels.length === 0) return;

        // Reset widths to measure actual content width
        labels.forEach(label => {
            label.style.width = 'auto';
        });

        // Find the longest label width (should be "Middle")
        let maxWidth = 0;
        labels.forEach(label => {
            const width = label.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        // Apply the max width to all labels and set 20px gap
        labels.forEach(label => {
            label.style.width = `${maxWidth}px`;
        });

        // Set 20px gap between label and notes
        const descContainers = document.querySelectorAll('.perfume-list__info-desc');
        descContainers.forEach(container => {
            container.style.gap = '20px';
        });
    });
}

// ========================================
// Update Graph Labels
// ========================================

function updateGraphLabels(first, second, third) {
    const firstLabel = document.querySelector('[data-graph="smoky-leather"]').closest('.perfume-list__info-graph-item').querySelector('.perfume-list__info-graph-label');
    const secondLabel = document.querySelector('[data-graph="musk"]').closest('.perfume-list__info-graph-item').querySelector('.perfume-list__info-graph-label');
    const thirdLabel = document.querySelector('[data-graph="aldehyde"]').closest('.perfume-list__info-graph-item').querySelector('.perfume-list__info-graph-label');

    if (firstLabel) firstLabel.textContent = first;
    if (secondLabel) secondLabel.textContent = second;
    if (thirdLabel) thirdLabel.textContent = third;
}

// ========================================
// Update Graphs
// ========================================

function updateGraphs(smokyLeather, musk, aldehyde) {
    const smokyLeatherFill = document.querySelector('[data-graph="smoky-leather"]');
    const muskFill = document.querySelector('[data-graph="musk"]');
    const aldehydeFill = document.querySelector('[data-graph="aldehyde"]');

    if (smokyLeatherFill) {
        if (typeof gsap !== 'undefined') {
            gsap.to(smokyLeatherFill, {
                width: `${smokyLeather}%`,
                duration: 0.8,
                ease: 'power2.out'
            });
        } else {
            smokyLeatherFill.style.width = `${smokyLeather}%`;
        }
    }

    if (muskFill) {
        if (typeof gsap !== 'undefined') {
            gsap.to(muskFill, {
                width: `${musk}%`,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.1
            });
        } else {
            muskFill.style.width = `${musk}%`;
        }
    }

    if (aldehydeFill) {
        if (typeof gsap !== 'undefined') {
            gsap.to(aldehydeFill, {
                width: `${aldehyde}%`,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.2
            });
        } else {
            aldehydeFill.style.width = `${aldehyde}%`;
        }
    }
}

// ========================================
// Dynamic Height Observer
// ========================================

function initDynamicHeightObserver() {
    const section = document.querySelector('.perfume-list');
    const bg = document.querySelector('.perfume-list__bg');
    const bgWrapper = bg?.querySelector('.swiper-wrapper');
    const bgSlides = bg?.querySelectorAll('.swiper-slide');

    if (section && bg) {
        const updateHeight = () => {
            const sectionHeight = section.offsetHeight;
            bg.style.height = sectionHeight + 'px';

            if (bgWrapper) {
                bgWrapper.style.height = sectionHeight + 'px';
            }

            if (bgSlides) {
                bgSlides.forEach(slide => {
                    slide.style.height = sectionHeight + 'px';
                });
            }
        };

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                updateHeight();
            }
        });

        observer.observe(section);

        // Initial height set
        updateHeight();

        // Update on window resize
        window.addEventListener('resize', updateHeight);
    }
}

// ========================================
// Initialize
// ========================================

// ========================================
// Swipe Guide Modal
// ========================================

function initSwipeGuide() {
    const swipeGuide = document.getElementById('swipeGuide');
    const infoSection = document.querySelector('.perfume-list__info');

    if (!swipeGuide || !infoSection) return;

    // Check if guide was already shown (using sessionStorage)
    const guideShown = sessionStorage.getItem('perfumeSwipeGuideShown');
    if (guideShown === 'true') return;

    // Check if device is Tablet-S or Mobile
    const isTabletSOrMobile = () => {
        const width = window.innerWidth;
        return (width >= 480 && width <= 767) || (width >= 320 && width <= 479);
    };

    // Only show on Tablet-S and Mobile
    if (!isTabletSOrMobile()) {
        // Hide guide on desktop
        swipeGuide.style.display = 'none';
        return;
    }

    let hasShown = false;
    let scrollTimeout = null;
    let scrollPosition = 0;

    // Function to prevent body scroll while maintaining scroll position
    const preventScroll = () => {
        // Save current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Apply styles to prevent scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
    };

    // Function to allow body scroll and restore position
    const allowScroll = () => {
        // Remove fixed positioning
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    };

    // Function to show guide modal
    const showGuide = () => {
        if (hasShown) return;
        hasShown = true;

        // Prevent scroll
        preventScroll();

        // Show guide modal
        swipeGuide.classList.add('is-active');

        // Mark as shown
        sessionStorage.setItem('perfumeSwipeGuideShown', 'true');

        // Remove all listeners
        window.removeEventListener('scroll', checkSectionBottom, { passive: true });
        if (observer) {
            observer.disconnect();
        }
    };

    // Function to check if info section bottom has reached viewport bottom
    const checkSectionBottom = () => {
        if (hasShown) return;

        // Clear previous timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Debounce scroll check
        scrollTimeout = setTimeout(() => {
            const rect = infoSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // When section bottom is at or near viewport bottom (within 150px)
            if (rect.bottom <= viewportHeight + 150 && rect.bottom >= viewportHeight - 50) {
                showGuide();
            }
        }, 100);
    };

    // Initial check after a short delay
    setTimeout(() => {
        checkSectionBottom();
    }, 500);

    // Listen to scroll events
    window.addEventListener('scroll', checkSectionBottom, { passive: true });

    // Use Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (hasShown) return;

            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;

            // When section bottom is at viewport bottom
            if (rect.bottom <= viewportHeight + 150 && rect.bottom >= viewportHeight - 50) {
                showGuide();
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px'
    });

    observer.observe(infoSection);

    // Close on click
    swipeGuide.addEventListener('click', () => {
        swipeGuide.classList.remove('is-active');
        allowScroll();
    });

    // Also close on touch/click outside
    swipeGuide.addEventListener('touchstart', (e) => {
        if (e.target === swipeGuide) {
            swipeGuide.classList.remove('is-active');
            allowScroll();
        }
    });
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize header
    initHeader();

    if (document.querySelector('.perfume-list')) {
        const { bgSwiper } = initPerfumeListSwiper();
        initDynamicHeightObserver();
        initSwipeGuide();

        // Swiper 초기화 완료 후 높이 재설정
        setTimeout(() => {
            const section = document.querySelector('.perfume-list');
            const bg = document.querySelector('.perfume-list__bg');
            if (section && bg) {
                const sectionHeight = section.offsetHeight;
                bg.style.height = sectionHeight + 'px';
                const bgWrapper = bg.querySelector('.swiper-wrapper');
                const bgSlides = bg.querySelectorAll('.swiper-slide');
                if (bgWrapper) bgWrapper.style.height = sectionHeight + 'px';
                bgSlides.forEach(slide => {
                    slide.style.height = sectionHeight + 'px';
                });
                if (bgSwiper) bgSwiper.update();
            }
        }, 200);

        console.log('✨ Perfume list swiper initialized');
        console.log('📏 Dynamic height observer initialized');
    }
});
