/**
 * ==========================================================================
 * Sub-2 Page Scripts
 * ==========================================================================
 * 
 * Page-specific JavaScript for sub-2 page
 * 
 */

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Page initialization code can be added here
    console.log('Sub-2 page loaded');

    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 10,
        slidesPerView: 9.5,
        freeMode: true,
        watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".mySwiper2", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiper,
        },
    });
});
