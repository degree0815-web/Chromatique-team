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
    
    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
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
    
    // Resize handler
    window.addEventListener('resize', this.handleResize);
    
    // Keyboard accessibility
    document.addEventListener('keydown', this.handleKeydown);
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
    if (currentScrollY > this.hideThreshold) {
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down
        this.header.classList.add('is-hidden');
      } else {
        // Scrolling up
        this.header.classList.remove('is-hidden');
      }
    } else {
      this.header.classList.remove('is-hidden');
    }
    
    this.lastScrollY = currentScrollY;
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
    
    // Update ARIA attributes
    this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
    
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
    this.menuToggle.setAttribute('aria-expanded', false);
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
   * Handle keyboard events
   */
  handleKeydown(e) {
    // Close menu on Escape
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
      this.menuToggle.focus();
    }
  }
  
  /**
   * Destroy the header instance
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
    
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleMenu);
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

