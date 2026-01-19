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
    if (!modal) return;

    const modalImage = modal.querySelector('.image-modal__image');
    const modalOverlay = modal.querySelector('.image-modal__overlay');
    const modalClose = modal.querySelector('.image-modal__close');
    const viewButtons = document.querySelectorAll('.product-description__view-btn');

    if (!modalImage || !modalOverlay || !modalClose || viewButtons.length === 0) return;

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
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// ========================================
// Artwork Modal
// ========================================

function initArtworkModal() {
    const modal = document.getElementById('artworkModal');
    if (!modal) {
        console.error('Artwork modal not found');
        return;
    }

    const modalOverlay = modal.querySelector('.artwork-modal__overlay');
    const modalClose = modal.querySelector('.artwork-modal__close');
    const modalImage = modal.querySelector('.artwork-modal__image');
    const modalTitle = modal.querySelector('.artwork-modal__title');
    const modalArtist = modal.querySelector('.artwork-modal__artist');
    const modalDescription = modal.querySelector('.artwork-modal__description');
    const artworkButtons = document.querySelectorAll('.product-description__artwork-btn');

    if (artworkButtons.length === 0) {
        console.warn('No artwork buttons found');
        return;
    }

    console.log(`Found ${artworkButtons.length} artwork buttons`);

    // Get artwork data from the slide
    function getArtworkData(button) {
        const slide = button.closest('.swiper-slide');
        if (!slide) {
            console.error('Slide not found');
            return null;
        }

        // Get image from slide's img tag
        const slideImage = slide.querySelector('img');
        const imageUrl = slideImage ? slideImage.src : '';

        if (!imageUrl) {
            console.error('Image URL not found');
        }

        // Get text data from product-description__text-top
        const textTop = slide.querySelector('.product-description__text-top');
        if (!textTop) {
            console.error('Text top not found');
            return null;
        }

        const title = textTop.querySelector('h3')?.textContent || '';
        const artist = textTop.querySelector('p')?.textContent || '';
        const description = Array.from(textTop.querySelectorAll('p')).slice(1).map(p => p.textContent).join(' ').trim();

        const data = {
            imageUrl,
            title,
            artist,
            description
        };

        console.log('Artwork data:', data);
        return data;
    }

    // Open modal with artwork data
    function openArtworkModal(data) {
        console.log('Opening modal with data:', data);

        if (!data) {
            console.error('No data provided');
            return;
        }

        if (!data.imageUrl) {
            console.error('No image URL in data');
            return;
        }

        if (!modalImage) {
            console.error('Modal image element not found');
            return;
        }
        if (!modalTitle) {
            console.error('Modal title element not found');
            return;
        }
        if (!modalArtist) {
            console.error('Modal artist element not found');
            return;
        }
        if (!modalDescription) {
            console.error('Modal description element not found');
            return;
        }

        modalImage.src = data.imageUrl;
        modalImage.alt = data.title || 'Artwork image';
        modalTitle.textContent = data.title || '';
        modalArtist.textContent = data.artist || '';
        modalDescription.textContent = data.description || '';

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        console.log('Modal opened, classes:', modal.className);
        console.log('Modal element:', modal);
        console.log('Modal computed style:', window.getComputedStyle(modal));
    }

    // Close modal
    function closeArtworkModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Add click event to all artwork buttons
    artworkButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Button ${index + 1} clicked`);
            const artworkData = getArtworkData(button);
            openArtworkModal(artworkData);
        });
    });

    // Close modal when clicking overlay or close button
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeArtworkModal);
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeArtworkModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeArtworkModal();
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
        initArtworkModal();
        console.log('🎠 Product description swiper initialized');
        console.log('🖼️ Image modal initialized');
        console.log('🎨 Artwork modal initialized');
    }
});

