/**
 * ==========================================================================
 * Sub-2 Page Scripts
 * ==========================================================================
 * 
 * Page-specific JavaScript for sub-2 page
 * 
 */

// ========================================
// Product Description Swiper
// ========================================

function initProductDescriptionSwiper() {
    const thumbsSwiper = new Swiper('.product-description__thumbs', {
        spaceBetween: 24,
        slidesPerView: 9.5,
        freeMode: true,
        watchSlidesProgress: true,
    });

    const mainSwiper = new Swiper('.product-description__main', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: thumbsSwiper,
        },
    });

    return { mainSwiper, thumbsSwiper };
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on sub-2 page
    if (document.querySelector('.product-description')) {
        initProductDescriptionSwiper();
        console.log('🎠 Product description swiper initialized');
    }
});

