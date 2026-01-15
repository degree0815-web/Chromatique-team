/**
 * ==========================================================================
 * Header Component
 * ==========================================================================
 * 
 * Handles header functionality:
 * - Scroll state (background change)
 * - Hide/Show on scroll direction
 * - Mobile menu toggle
 * 
 */

class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.menuToggle = document.querySelector('.header__menu-toggle');
    this.nav = document.querySelector('.header__nav');

    // State
    this.isMenuOpen = false;
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.hideThreshold = 300;
    this.isButtonHovered = false; // Track button hover state

    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleButtonMouseEnter = this.handleButtonMouseEnter.bind(this);
    this.handleButtonMouseLeave = this.handleButtonMouseLeave.bind(this);
    this.handleHeaderMouseEnter = this.handleHeaderMouseEnter.bind(this);
  }

  /**
   * Initialize the header
   */
  init() {
    if (!this.header) {
      console.warn('Header element not found');
      return;
    }

    this.bindEvents();
    this.handleScroll(); // Initial check

    console.log('📌 Header initialized');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Scroll events
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.toggleMenu);
    }

    // Close menu on nav link click
    const navLinks = this.header.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.closeMenu);
    });

    // Prevent header from showing when buttons are hovered
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', this.handleButtonMouseEnter);
      button.addEventListener('mouseleave', this.handleButtonMouseLeave);
    });

    // Prevent header from showing when mouse enters header area while button is hovered
    if (this.header) {
      this.header.addEventListener('mouseenter', this.handleHeaderMouseEnter);
    }

    // Resize handler
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class
    if (currentScrollY > this.scrollThreshold) {
      this.header.classList.add('is-scrolled');
    } else {
      this.header.classList.remove('is-scrolled');
    }

    // Hide/show header based on scroll direction
    // Don't show header if button is being hovered
    if (currentScrollY > this.hideThreshold) {
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down
        this.header.classList.add('is-hidden');
      } else {
        // Scrolling up - but only show if button is not hovered
        if (!this.isButtonHovered) {
          this.header.classList.remove('is-hidden');
        }
      }
    } else {
      this.header.classList.remove('is-hidden');
    }

    this.lastScrollY = currentScrollY;
  }

  /**
   * Handle button mouse enter - keep header hidden
   */
  handleButtonMouseEnter() {
    this.isButtonHovered = true;
    // Ensure header stays hidden when button is hovered
    if (window.scrollY > this.hideThreshold) {
      this.header.classList.add('is-hidden');
    }
  }

  /**
   * Handle button mouse leave - allow header to show normally
   */
  handleButtonMouseLeave() {
    this.isButtonHovered = false;
  }

  /**
   * Handle header mouse enter - keep header hidden if button was hovered
   */
  handleHeaderMouseEnter() {
    // If button was hovered and header is hidden, keep it hidden
    if (this.isButtonHovered && window.scrollY > this.hideThreshold) {
      this.header.classList.add('is-hidden');
    }
  }

  /**
   * Toggle mobile menu
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Update classes
    this.menuToggle.classList.toggle('is-active', this.isMenuOpen);
    this.nav.classList.toggle('is-open', this.isMenuOpen);
    this.header.classList.toggle('menu-open', this.isMenuOpen);

    // Toggle body scroll
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';

    // Animate nav links
    if (this.isMenuOpen) {
      this.animateNavLinks();
    }
  }

  /**
   * Close mobile menu
   */
  closeMenu() {
    if (!this.isMenuOpen) return;

    this.isMenuOpen = false;
    this.menuToggle.classList.remove('is-active');
    this.nav.classList.remove('is-open');
    this.header.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  /**
   * Animate navigation links on menu open
   */
  animateNavLinks() {
    const navItems = this.nav.querySelectorAll('.header__nav-item');

    // Use GSAP if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(navItems,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close menu on desktop breakpoint
    if (window.innerWidth >= 1024 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Destroy the header instance
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleMenu);
    }

    // Remove button event listeners
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.removeEventListener('mouseenter', this.handleButtonMouseEnter);
      button.removeEventListener('mouseleave', this.handleButtonMouseLeave);
    });

    // Remove header event listener
    if (this.header) {
      this.header.removeEventListener('mouseenter', this.handleHeaderMouseEnter);
    }
  }
}

// ========================================
// Export & Initialize
// ========================================

export default Header;

export function initHeader() {
  const header = new Header();
  header.init();
  return header;
}

