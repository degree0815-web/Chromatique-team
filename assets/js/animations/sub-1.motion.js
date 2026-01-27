/**
 * ==========================================================================
 * Sub-1 Page Animations
 * ==========================================================================
 * 
 * Handles animations for Brand Philosophy page:
 * - Blur reveal effect with random circular mask movement
 * - Desc section sequential item animations
 * - Intro section text fade in with refraction/distortion effect
 * 
 */

// 애니메이션 인스턴스 저장
let animationInstance = null;

/**
 * Initialize blur reveal animation for sub01__content__bg
 * Creates a circular mask that moves in a random trajectory to reveal the clear image
 * Also adds mouse pointer following effect
 */
export function initSub1BlurReveal() {
  const contentBg = document.querySelector('.sub01__content__bg');
  if (!contentBg) return;

  const clearImageRandom = contentBg.querySelector('.sub01__content__bg--clear-random');
  const clearImageMouse = contentBg.querySelector('.sub01__content__bg--clear-mouse');
  
  if (!clearImageRandom || !clearImageMouse) return;

  // 기존 애니메이션 정리
  if (animationInstance) {
    animationInstance.kill();
    animationInstance = null;
  }

  // 이미지 로드 대기
  const imagesLoaded = [clearImageRandom.complete, clearImageMouse.complete];
  const checkImagesLoaded = () => {
    if (imagesLoaded[0] && imagesLoaded[1]) {
      startBlurRevealAnimation(clearImageRandom, contentBg);
      initMouseBlurReveal(clearImageMouse, contentBg);
    }
  };

  if (clearImageRandom.complete && clearImageMouse.complete) {
    startBlurRevealAnimation(clearImageRandom, contentBg);
    initMouseBlurReveal(clearImageMouse, contentBg);
  } else {
    clearImageRandom.addEventListener('load', () => {
      imagesLoaded[0] = true;
      checkImagesLoaded();
    });
    clearImageMouse.addEventListener('load', () => {
      imagesLoaded[1] = true;
      checkImagesLoaded();
    });
  }

  // Resize 및 Scroll 이벤트 리스너 추가
  let resizeTimeout;
  let scrollTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // 애니메이션 재시작
      if (animationInstance) {
        animationInstance.kill();
        animationInstance = null;
      }
      startBlurRevealAnimation(clearImageRandom, contentBg);
      initMouseBlurReveal(clearImageMouse, contentBg);
    }, 250);
  });

  // 스크롤 시 현재 위치 업데이트 (뷰포트 기준으로 재계산)
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // 스크롤 시에도 뷰포트 내에서만 작동하도록 재계산
      // 애니메이션은 계속 진행하되, 경계만 업데이트
    }, 100);
  });
}

/**
 * Start the blur reveal animation
 * @param {HTMLElement} clearImage - The clear image element
 * @param {HTMLElement} container - The container element
 */
function startBlurRevealAnimation(clearImage, container) {
  // 원형 mask 크기 (픽셀)
  const maskSize = 700;
  const halfMaskSize = maskSize / 2;

  // 뷰포트와 컨테이너의 교차 영역 계산 함수
  function getVisibleBounds() {
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 컨테이너가 뷰포트와 교차하는 영역 계산
    const visibleLeft = Math.max(0, containerRect.left);
    const visibleTop = Math.max(0, containerRect.top);
    const visibleRight = Math.min(viewportWidth, containerRect.right);
    const visibleBottom = Math.min(viewportHeight, containerRect.bottom);

    // 보이는 영역의 크기
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return {
      left: visibleLeft,
      top: visibleTop,
      width: visibleWidth,
      height: visibleHeight,
      containerLeft: containerRect.left,
      containerTop: containerRect.top,
    };
  }

  // 초기 위치 계산
  const bounds = getVisibleBounds();
  let currentX = bounds.left + Math.random() * Math.max(0, bounds.width - maskSize) + halfMaskSize;
  let currentY = bounds.top + Math.random() * Math.max(0, bounds.height - maskSize) + halfMaskSize;

  // 뷰포트 내에서만 유효한 위치로 조정
  currentX = Math.max(halfMaskSize, Math.min(window.innerWidth - halfMaskSize, currentX));
  currentY = Math.max(halfMaskSize, Math.min(window.innerHeight - halfMaskSize, currentY));

  // 초기 mask 위치 설정 (컨테이너 기준 상대 위치)
  const containerRect = container.getBoundingClientRect();
  const relativeX = currentX - containerRect.left;
  const relativeY = currentY - containerRect.top;
  updateMaskPosition(clearImage, relativeX, relativeY);

  // 랜덤 궤적 생성 함수
  function generateRandomPath() {
    const bounds = getVisibleBounds();
    const path = [];
    const numPoints = 8 + Math.floor(Math.random() * 5); // 8-12개의 점

    // 현재 위치를 뷰포트 기준으로 계산
    let viewportX = currentX;
    let viewportY = currentY;

    for (let i = 0; i < numPoints; i++) {
      // 다음 점까지의 거리와 각도 (랜덤)
      const distance = 200 + Math.random() * 300; // 200-500px
      const angle = Math.random() * Math.PI * 2; // 0-2π

      // 뷰포트 내 경계 체크 및 조정
      const nextViewportX = Math.max(
        halfMaskSize,
        Math.min(window.innerWidth - halfMaskSize, viewportX + Math.cos(angle) * distance)
      );
      const nextViewportY = Math.max(
        halfMaskSize,
        Math.min(window.innerHeight - halfMaskSize, viewportY + Math.sin(angle) * distance)
      );

      // 컨테이너 기준 상대 위치로 변환
      const containerRect = container.getBoundingClientRect();
      const relativeX = nextViewportX - containerRect.left;
      const relativeY = nextViewportY - containerRect.top;

      path.push({ x: relativeX, y: relativeY, viewportX: nextViewportX, viewportY: nextViewportY });
      viewportX = nextViewportX;
      viewportY = nextViewportY;
    }

    return path;
  }

  // 애니메이션 실행 함수
  function animatePath() {
    const path = generateRandomPath();
    const timeline = gsap.timeline({
      onComplete: () => {
        // 현재 위치 업데이트 (뷰포트 기준)
        if (path.length > 0) {
          const lastPoint = path[path.length - 1];
          currentX = lastPoint.viewportX;
          currentY = lastPoint.viewportY;
        }
        // 다음 경로 애니메이션 시작
        animatePath();
      },
    });

    // 타임라인 인스턴스 저장
    animationInstance = timeline;

    // 각 경로 포인트를 순차적으로 애니메이션
    path.forEach((point, index) => {
      const duration = 0.7 + Math.random() * 0.7;
      const ease = 'power1.inOut';

      timeline.to(
        clearImage,
        {
          duration: duration,
          ease: ease,
          onUpdate: function () {
            // GSAP의 진행률에 따라 보간
            const progress = this.progress();
            const containerRect = container.getBoundingClientRect();

            // 시작점과 끝점 계산 (뷰포트 기준)
            const startViewportX = index === 0
              ? currentX
              : path[index - 1].viewportX;
            const startViewportY = index === 0
              ? currentY
              : path[index - 1].viewportY;

            const endViewportX = point.viewportX;
            const endViewportY = point.viewportY;

            // 뷰포트 기준 보간
            const viewportX = startViewportX + (endViewportX - startViewportX) * progress;
            const viewportY = startViewportY + (endViewportY - startViewportY) * progress;

            // 컨테이너 기준 상대 위치로 변환
            const relativeX = viewportX - containerRect.left;
            const relativeY = viewportY - containerRect.top;

            updateMaskPosition(clearImage, relativeX, relativeY);
          },
        },
        index === 0 ? 0 : '-=0.1' // 첫 번째는 즉시, 나머지는 약간 겹치게
      );
    });
  }

  // 애니메이션 시작
  animatePath();
}

/**
 * Update mask position for the clear image
 * @param {HTMLElement} element - The image element
 * @param {number} x - X position (center of mask)
 * @param {number} y - Y position (center of mask)
 */
function updateMaskPosition(element, x, y) {
  // CSS mask-position은 mask-origin: center일 때 중심점을 기준으로 설정
  // 마우스 포인터가 마스크의 정확한 중심에 오도록 픽셀 단위로 설정
  const maskX = `${x}px`;
  const maskY = `${y}px`;

  element.style.maskPosition = `${maskX} ${maskY}`;
  element.style.webkitMaskPosition = `${maskX} ${maskY}`;
}

/**
 * Initialize mouse pointer blur reveal effect
 * Creates a circular mask that follows the mouse cursor
 * @param {HTMLElement} clearImageMouse - The clear image element for mouse effect
 * @param {HTMLElement} container - The container element
 */
function initMouseBlurReveal(clearImageMouse, container) {
  const maskSize = 200; // 마우스 포인터용 작은 반경
  const halfMaskSize = maskSize / 2;
  
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMouseInside = false;
  
  // 부드러운 마우스 추적을 위한 애니메이션 루프
  const updateMousePosition = () => {
    if (isMouseInside) {
      // 현재 위치를 목표 위치로 부드럽게 이동 (ease-out 효과)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      
      const containerRect = container.getBoundingClientRect();
      // 마우스 포인터의 정확한 위치를 컨테이너 기준 상대 좌표로 변환
      // 마스크의 중심이 마우스 포인터 위치와 정확히 일치하도록 계산
      const relativeX = currentX - containerRect.left;
      const relativeY = currentY - containerRect.top;
      
      // mask-position을 마우스 포인터 위치에 정확히 맞춤
      // mask-origin: center이므로 마스크의 중심이 이 위치에 오게 됨
      updateMaskPosition(clearImageMouse, relativeX, relativeY);
    }
    
    requestAnimationFrame(updateMousePosition);
  };
  
  // 애니메이션 루프 시작
  updateMousePosition();
  
  // 마우스 이동 이벤트
  const handleMouseMove = (e) => {
    const containerRect = container.getBoundingClientRect();
    
    // 컨테이너 내부에 있는지 확인
    isMouseInside = 
      e.clientX >= containerRect.left &&
      e.clientX <= containerRect.right &&
      e.clientY >= containerRect.top &&
      e.clientY <= containerRect.bottom;
    
    if (isMouseInside) {
      // 마우스 포인터의 정확한 중앙 위치를 목표로 설정
      // e.clientX, e.clientY는 이미 마우스 포인터의 정확한 위치
      targetX = e.clientX;
      targetY = e.clientY;
      
      // 컨테이너 경계 내로 제한 (mask가 컨테이너 밖으로 나가지 않도록)
      targetX = Math.max(
        containerRect.left + halfMaskSize,
        Math.min(containerRect.right - halfMaskSize, targetX)
      );
      targetY = Math.max(
        containerRect.top + halfMaskSize,
        Math.min(containerRect.bottom - halfMaskSize, targetY)
      );
    }
  };
  
  // 마우스가 컨테이너를 벗어날 때
  const handleMouseLeave = () => {
    isMouseInside = false;
  };
  
  // 마우스가 컨테이너에 들어올 때
  const handleMouseEnter = (e) => {
    isMouseInside = true;
    handleMouseMove(e);
  };
  
  // 이벤트 리스너 등록
  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseenter', handleMouseEnter);
  container.addEventListener('mouseleave', handleMouseLeave);
  
  // 초기 위치 설정 (컨테이너 중앙)
  const containerRect = container.getBoundingClientRect();
  targetX = containerRect.left + containerRect.width / 2;
  targetY = containerRect.top + containerRect.height / 2;
  currentX = targetX;
  currentY = targetY;
  
  // 초기 mask 위치 설정
  updateMaskPosition(clearImageMouse, containerRect.width / 2, containerRect.height / 2);
  
  // 정리 함수 반환 (필요시 사용)
  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Initialize sequential animation for sub01__descSec items
 * Items animate from bottom to top sequentially
 * Within each item: image animates first, then text after 0.2s delay
 */
export function initSub1DescSecAnimation() {
  const descSec = document.querySelector('.sub01__descSec');
  if (!descSec) return;

  const items = descSec.querySelectorAll('.sub01__descSec__item');
  if (items.length === 0) return;

  // 각 item의 이미지와 텍스트 요소 선택
  items.forEach((item, index) => {
    const img = item.querySelector('img');
    const txtWrap = item.querySelector('.sub01__descSec__item__txtWrap');

    if (!img || !txtWrap) return;

    // 초기 상태 설정: 아래에서 시작, 투명
    gsap.set([img, txtWrap], {
      y: 700,
      opacity: 0,
      force3D: true,
    });

    // 각 item이 뷰포트에 들어올 때 애니메이션
    const itemTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });

    // 이미지 먼저 애니메이션
    itemTimeline.to(img, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    });

    itemTimeline.to(
      txtWrap,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.5' // 이미지 애니메이션 완료 후 0.5초 후에 시작
    );
  });
}

/**
 * Initialize fade in animation with refraction/distortion effect for sub01__introSec
 * Text elements fade in slowly with a glass-like refraction and distortion effect
 * Enhanced with more dynamic distortion effects
 */
export function initSub1IntroSecAnimation() {
  const introSec = document.querySelector('.sub01__introSec');
  if (!introSec) return;

  const txtWrap = introSec.querySelector('.sub01__introSec__txt__wrap');
  if (!txtWrap) return;

  // 모든 텍스트 요소 선택
  const textElements = txtWrap.querySelectorAll('h3, h2, p');
  if (textElements.length === 0) return;

  // 초기 상태 설정: 강한 블러, 왜곡, 스케일
  gsap.set(textElements, {
    opacity: 0,
    filter: 'blur(25px)',
    rotationX: 25, // 더 강한 X축 회전
    rotationY: 10, // Y축 회전 추가
    skewX: 5, // X축 기울임 추가
    scale: 0.8, // 더 작은 스케일에서 시작
    y: 30, // 아래에서 시작
    force3D: true,
    transformPerspective: 1000,
  });

  // 스크롤 기반 페이드 인 및 굴절 효과 애니메이션
  textElements.forEach((element, index) => {
    // 각 요소마다 약간씩 다른 왜곡 효과를 주기 위한 랜덤 값
    const randomRotationX = 20 + Math.random() * 10; // 20-30도
    const randomRotationY = 5 + Math.random() * 10; // 5-15도
    const randomSkew = 3 + Math.random() * 4; // 3-7도

    // 초기 상태를 각 요소마다 약간 다르게 설정
    gsap.set(element, {
      rotationX: randomRotationX,
      rotationY: randomRotationY,
      skewX: randomSkew,
    });

    // 메인 애니메이션 타임라인
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: introSec,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });

    // 페이드 인과 왜곡/굴절 효과를 동시에 적용
    tl.to(
      element,
      {
        opacity: 1,
        filter: 'blur(0px)',
        rotationX: 0,
        rotationY: 0,
        skewX: 0,
        scale: 1,
        y: 0,
        duration: 1.5, // 페이드인과 왜곡이 함께 일어나는 시간
        ease: 'power3.out',
      },
      index * 0.15 // 각 요소마다 0.15초 지연
    );
  });
}
