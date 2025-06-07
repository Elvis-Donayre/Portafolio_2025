/**
 * Navigation Component
 * Maneja la navegación principal, menú móvil y smooth scrolling
 */

import { smoothScrollTo, debounce } from '../utils/helpers.js';
import { SELECTORS, CSS_CLASSES, CUSTOM_EVENTS } from '../utils/constants.js';

export class Navigation {
    constructor() {
        this.header = null;
        this.navbar = null;
        this.navToggle = null;
        this.navMenu = null;
        this.navLinks = [];
        this.activeSection = null;
        this.isMenuOpen = false;
        
        // Bind methods
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleResize = debounce(this.handleResize.bind(this), 250);
        this.handleScroll = debounce(this.handleScroll.bind(this), 100);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        this.init();
    }

    /**
     * Initialize navigation component
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupIntersectionObserver();
        
        console.log('✅ Navigation component initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.header = document.querySelector(SELECTORS.header);
        this.navbar = document.querySelector(SELECTORS.navbar);
        this.navToggle = document.querySelector('.navbar__toggle');
        this.navMenu = document.querySelector('.navbar__menu');
        this.navLinks = document.querySelectorAll(SELECTORS.navLinks);
        
        if (!this.header || !this.navbar) {
            console.warn('⚠️ Navigation elements not found');
            return;
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation links clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick);
        });
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', this.handleToggleClick);
        }
        
        // Window events
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    /**
     * Handle navigation link clicks
     */
    handleNavClick(event) {
        event.preventDefault();
        
        const link = event.currentTarget;
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) {
            console.warn(`Target element not found: ${targetId}`);
            return;
        }
        
        // Close mobile menu if open
        if (this.isMenuOpen) {
            this.closeMenu();
        }
        
        // Smooth scroll to target
        const headerHeight = this.header ? this.header.offsetHeight : 80;
        smoothScrollTo(targetElement, headerHeight);
        
        // Update active link
        this.updateActiveLink(link);
        
        // Dispatch custom event
        this.dispatchEvent(CUSTOM_EVENTS.NAVIGATION_CLICK, {
            targetId,
            link: link.textContent.trim()
        });
        
        // Focus management for accessibility
        setTimeout(() => {
            targetElement.focus({ preventScroll: true });
            targetElement.removeAttribute('tabindex');
        }, 500);
    }

    /**
     * Handle mobile menu toggle
     */
    handleToggleClick() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.isMenuOpen = true;
        this.navMenu.classList.add('navbar__menu--open');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
        
        // Change hamburger icon to close icon
        const icon = this.navToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
        
        // Focus management
        const firstLink = this.navMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Prevent body scroll on mobile
        document.body.style.overflow = 'hidden';
        
        console.log('📱 Mobile menu opened');
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.isMenuOpen = false;
        this.navMenu.classList.remove('navbar__menu--open');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        
        // Change close icon back to hamburger
        const icon = this.navToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('📱 Mobile menu closed');
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    /**
     * Handle scroll for active section detection
     */
    handleScroll() {
        // This will be called by ScrollManager, but we can also handle it here
        this.updateActiveSection();
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(event) {
        // Close menu on Escape key
        if (event.key === 'Escape' && this.isMenuOpen) {
            this.closeMenu();
            this.navToggle?.focus();
        }
        
        // Handle arrow key navigation in menu
        if (this.isMenuOpen && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault();
            this.handleArrowNavigation(event.key);
        }
    }

    /**
     * Handle arrow key navigation in menu
     */
    handleArrowNavigation(key) {
        const focusableElements = Array.from(this.navMenu.querySelectorAll('a'));
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        let nextIndex;
        if (key === 'ArrowDown') {
            nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        }
        
        focusableElements[nextIndex]?.focus();
    }

    /**
     * Update active navigation link
     */
    updateActiveLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove(CSS_CLASSES.active);
            link.removeAttribute('aria-current');
        });
        
        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add(CSS_CLASSES.active);
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    /**
     * Setup intersection observer for active section detection
     */
    setupIntersectionObserver() {
        const sections = document.querySelectorAll(SELECTORS.sections);
        
        if (!sections.length) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        };
        
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
                    
                    if (correspondingLink && correspondingLink !== this.activeSection) {
                        this.activeSection = correspondingLink;
                        this.updateActiveLink(correspondingLink);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }

    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const sections = document.querySelectorAll(SELECTORS.sections);
        const scrollPosition = window.pageYOffset + 100; // Offset for header
        
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section;
            }
        });
        
        if (activeSection) {
            const sectionId = activeSection.id;
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (correspondingLink && correspondingLink !== this.activeSection) {
                this.activeSection = correspondingLink;
                this.updateActiveLink(correspondingLink);
            }
        }
    }

    /**
     * Get current active section
     */
    getActiveSection() {
        return this.activeSection;
    }

    /**
     * Programmatically navigate to section
     */
    navigateToSection(sectionId) {
        const targetElement = document.querySelector(sectionId);
        const correspondingLink = document.querySelector(`a[href="${sectionId}"]`);
        
        if (targetElement && correspondingLink) {
            const headerHeight = this.header ? this.header.offsetHeight : 80;
            smoothScrollTo(targetElement, headerHeight);
            this.updateActiveLink(correspondingLink);
        }
    }

    /**
     * Check if mobile menu is open
     */
    isMobileMenuOpen() {
        return this.isMenuOpen;
    }

    /**
     * Dispatch custom events
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Close mobile menu on larger screens
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    /**
     * Destroy navigation component
     */
    destroy() {
        // Remove event listeners
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick);
        });
        
        if (this.navToggle) {
            this.navToggle.removeEventListener('click', this.handleToggleClick);
        }
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Disconnect intersection observer
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        // Reset state
        this.closeMenu();
        document.body.style.overflow = '';
        
        console.log('🧹 Navigation component destroyed');
    }
}