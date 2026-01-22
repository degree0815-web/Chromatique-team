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
                slidesPerView: 4.5,
                spaceBetween: 12,
            },
            480: {
                slidesPerView: 5.5,
                spaceBetween: 16,
            },
            768: {
                slidesPerView: 7.5,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 9.5,
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
    const infoDescTop = document.querySelector('.perfume-list__info-desc--top');
    const infoDescMiddle = document.querySelector('.perfume-list__info-desc--middle');
    const infoDescBase = document.querySelector('.perfume-list__info-desc--base');
    const infoArtTitle = document.querySelector('.perfume-list__info-art-title');
    const infoArtArtist = document.querySelector('.perfume-list__info-art-artist');
    const infoArtDesc = document.querySelector('.perfume-list__info-art-desc');

    if (infoImage) infoImage.src = perfumeImg;
    if (infoTitle) infoTitle.textContent = title;
    if (infoSubtitle) infoSubtitle.textContent = subtitle;
    if (infoDescTop) infoDescTop.textContent = descTop;
    if (infoDescMiddle) infoDescMiddle.textContent = descMiddle;
    if (infoDescBase) infoDescBase.textContent = descBase;
    if (infoArtTitle) infoArtTitle.textContent = artTitle;
    if (infoArtArtist) infoArtArtist.textContent = artArtist;
    if (infoArtDesc) infoArtDesc.textContent = artDesc;
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.perfume-list')) {
        const { bgSwiper } = initPerfumeListSwiper();
        initDynamicHeightObserver();

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
