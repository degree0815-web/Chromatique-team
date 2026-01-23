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
// Artwork Modal
// ========================================

function initArtworkModal() {
    const modal = document.getElementById('artworkModal');
    const closeBtn = modal?.querySelector('.artwork-modal__close');
    const overlay = modal?.querySelector('.artwork-modal__overlay');
    const openBtn = document.querySelector('.perfume-list__info-btn');

    if (!modal || !openBtn) return;

    // 작가 정보 데이터 (한글 이름과 설명)
    const artistData = {
        'Claude Monet': {
            nameKo: '클로드 모네',
            desc: '프랑스 인상주의 화가. 빛과 색채의 변화를 포착하여 자연의 순간적인 아름다움을 그려낸 대표적인 인상주의 작가입니다.'
        },
        'Grant Wood': {
            nameKo: '그랜트 우드',
            desc: '미국 화가. 미국 중서부의 풍경과 사람들을 사실적으로 그려낸 지역주의 화가입니다.'
        },
        'Georges Seurat': {
            nameKo: '조르주 쇠라',
            desc: '프랑스 신인상주의 화가. 점묘법을 사용하여 과학적인 색채 이론을 그림에 적용한 선구자입니다.'
        },
        'Edgar Degas': {
            nameKo: '에드가 드가',
            desc: '프랑스 인상주의 화가. 발레리나와 경마장을 주제로 한 작품으로 유명하며, 동작의 순간을 포착하는 데 뛰어났습니다.'
        },
        'René Magritte': {
            nameKo: '르네 마그리트',
            desc: '벨기에 초현실주의 화가. 일상적인 사물을 비현실적인 맥락에 배치하여 관습적인 인식에 도전했습니다.'
        },
        'Pablo-Picasso': {
            nameKo: '파블로 피카소',
            desc: '스페인 출신의 20세기 가장 영향력 있는 화가. 입체주의를 창시하고 다양한 예술 형식을 실험했습니다.'
        },
        'Leonardo da vinci': {
            nameKo: '레오나르도 다 빈치',
            desc: '이탈리아 르네상스의 천재. 예술, 과학, 공학 등 다방면에 뛰어난 재능을 발휘한 인물입니다.'
        },
        'Edvard Munch': {
            nameKo: '에드바르 뭉크',
            desc: '노르웨이 표현주의 화가. 인간의 내면 심리와 감정을 강렬하게 표현한 작품으로 유명합니다.'
        },
        'Gustav Klint': {
            nameKo: '구스타프 클림트',
            desc: '오스트리아 분리파 화가. 장식적이고 화려한 금박을 사용한 작품으로 유명하며, 여성의 아름다움을 주제로 했습니다.'
        },
        'Jean-Honoré Fragonard': {
            nameKo: '장 오노레 프라고나르',
            desc: '프랑스 로코코 화가. 우아하고 장식적인 작품으로 유명하며, 사랑과 유희를 주제로 한 작품을 많이 그렸습니다.'
        },
        'Vincent van gogh': {
            nameKo: '빈센트 반 고흐',
            desc: '네덜란드 후기 인상주의 화가. 강렬한 색채와 두터운 붓터치로 감정을 표현한 작품으로 유명합니다.'
        }
    };

    function openModal() {
        // 현재 활성화된 슬라이드에서 데이터 가져오기
        const bgSwiper = document.querySelector('.perfume-list__bg')?.swiper;
        if (!bgSwiper) return;

        const currentIndex = bgSwiper.realIndex;
        const currentSlide = bgSwiper.slides[currentIndex];

        if (!currentSlide) return;

        const artTitle = currentSlide.dataset.artTitle || '';
        const artArtist = currentSlide.dataset.artArtist || '';
        const artDesc = currentSlide.dataset.artDesc || '';

        // 이미지 번호 계산 (1부터 시작)
        const imageNumber = String(currentIndex + 1).padStart(2, '0');

        // 모달 내용 업데이트
        const frameImg = modal.querySelector('.artwork-modal__frame-img');
        const artTitleEl = modal.querySelector('.artwork-modal__art-title');
        const artistImg = modal.querySelector('.artwork-modal__artist-img');
        const artistNameEn = modal.querySelector('.artwork-modal__artist-name-en');
        const artistNameKo = modal.querySelector('.artwork-modal__artist-name-ko');
        const artistDesc = modal.querySelector('.artwork-modal__artist-desc');
        const artworkDesc = modal.querySelector('.artwork-modal__artwork-desc');

        if (frameImg) {
            frameImg.src = `assets/images/sub-2/frame${imageNumber}.png`;
            frameImg.alt = artTitle;
        }

        if (artTitleEl) artTitleEl.textContent = artTitle;

        if (artistImg) {
            // 5번째 이미지는 .jpg 확장자 사용
            const imageExt = currentIndex === 4 ? 'jpg' : 'png';
            artistImg.src = `assets/images/sub-2/artist${imageNumber}.${imageExt}`;
            artistImg.alt = artArtist;
        }

        if (artistNameEn) artistNameEn.textContent = artArtist;

        // 작가 한글 이름과 설명
        const artistInfo = artistData[artArtist] || {};
        if (artistNameKo) artistNameKo.textContent = artistInfo.nameKo || '';
        if (artistDesc) artistDesc.textContent = artistInfo.desc || '';

        if (artworkDesc) artworkDesc.textContent = artDesc;

        // 모달 열기
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    // 이벤트 리스너
    openBtn.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
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
        initArtworkModal();

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
        console.log('🎨 Artwork modal initialized');
    }
});
