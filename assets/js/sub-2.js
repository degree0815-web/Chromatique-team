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
// Image Modal
// ========================================

function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.image-modal__image');
    const modalOverlay = modal.querySelector('.image-modal__overlay');
    const modalClose = modal.querySelector('.image-modal__close');
    const viewButtons = document.querySelectorAll('.product-description__view-btn');

    if (!modal || viewButtons.length === 0) return;

    // Get background image URL from computed styles
    function getBackgroundImageUrl(element) {
        // Find the parent .product-description__text-image element
        const textImage = element.closest('.product-description__text-image');
        if (!textImage) return '';

        const computedStyle = window.getComputedStyle(textImage);
        const bgImage = computedStyle.backgroundImage;

        // Extract URL from background-image property
        // Format: url("path/to/image.png") or url(path/to/image.png)
        const match = bgImage.match(/url\(['"]?(.+?)['"]?\)/);
        return match ? match[1] : '';
    }

    // Open modal with image
    function openModal(imageUrl) {
        if (imageUrl) {
            modalImage.src = imageUrl;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Add click event to all view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const imageUrl = getBackgroundImageUrl(button);
            openModal(imageUrl);
        });
    });

    // Close modal when clicking overlay or close button
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on sub-2 page
    if (document.querySelector('.product-description')) {
        initProductDescriptionSwiper();
        initImageModal();
        console.log('🎠 Product description swiper initialized');
        console.log('🖼️ Image modal initialized');
    }
});

