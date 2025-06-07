/**
 * Scroll Manager Component
 * Maneja el scroll progress, header states y efectos de scroll
 */

import { throttle, math } from '../utils/helpers.js';
import { SCROLL_CONFIG, SELECTORS, CSS_CLASSES, CUSTOM_EVENTS } from '../utils/constants.js';

export class ScrollManager {
    constructor() {
        this.scrollProgress = null;
        this.header = null;
        this.lastScrollY = 0;
        this.scrollDirection = 'up';
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        // Scroll state
        this.state = {
            scrollY: 0,
            scrollPercent: 0,
            isAtTop: true,
            isAtBottom: false,
            direction: 'up'
        };
        
        // Bind methods
        this.handleScroll = throttle(this.handleScroll.bind(this), SCROLL_CONFIG.throttleDelay);
        this.handleScrollEnd = this.handleScrollEnd.bind(this);
        
        this.init();
    }

    /**
     * Initialize scroll manager
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.update(); // Initial update
        
        console.log('✅ Scroll Manager initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.scrollProgress = document.querySelector(SELECTORS.scrollProgress);
        this.header = document.querySelector(SELECTORS.header);
        
        if (!this.scrollProgress) {
            console.warn('⚠️ Scroll progress element not found');
        }
        
        if (!this.header) {
            console.warn('⚠️ Header element not found');
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Listen for custom scroll events
        document.addEventListener(CUSTOM_EVENTS.APP_SCROLL, (event) => {
            this.handleCustomScroll(event.detail);
        });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        this.update();
        this.handleScrollDirection();
        this.handleScrollState();
        
        // Clear existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Set scrolling state
        if (!this.isScrolling) {
            this.isScrolling = true;
            document.body.classList.add('is-scrolling');
        }
        
        // Handle scroll end
        this.scrollTimeout = setTimeout(this.handleScrollEnd, 150);
        
        // Dispatch scroll event
        this.dispatchScrollEvent();
    }

    /**
     * Handle scroll end
     */
    handleScrollEnd() {
        this.isScrolling = false;
        document.body.classList.remove('is-scrolling');
        
        // Dispatch scroll end event
        this.dispatchEvent(CUSTOM_EVENTS.APP_SCROLL_END, this.state);
    }

    /**
     * Update scroll state and progress
     */
    update() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = this.calculateScrollPercent();
        
        // Update state
        this.state = {
            ...this.state,
            scrollY,
            scrollPercent,
            isAtTop: scrollY <= 10,
            isAtBottom: scrollPercent >= 99
        };
        
        // Update progress indicator
        this.updateProgress(scrollPercent);
        
        // Update header state
        this.updateHeaderState();
    }

    /**
     * Calculate scroll percentage
     */
    calculateScrollPercent() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;
        
        if (maxScroll <= 0) return 0;
        
        return math.clamp((scrollTop / maxScroll) * 100, 0, 100);
    }

    /**
     * Update scroll progress indicator
     */
    updateProgress(percent) {
        if (!this.scrollProgress) return;
        
        this.scrollProgress.style.width = `${percent}%`;
        this.scrollProgress.setAttribute('aria-valuenow', Math.round(percent));
    }

    /**
     * Handle scroll direction detection
     */
    handleScrollDirection() {
        const currentScrollY = this.state.scrollY;
        
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            // Scrolling down
            if (this.scrollDirection !== 'down') {
                this.scrollDirection = 'down';
                this.state.direction = 'down';
                document.body.classList.add('scroll-down');
                document.body.classList.remove('scroll-up');
            }
        } else if (currentScrollY < this.lastScrollY) {
            // Scrolling up
            if (this.scrollDirection !== 'up') {
                this.scrollDirection = 'up';
                this.state.direction = 'up';
                document.body.classList.add('scroll-up');
                document.body.classList.remove('scroll-down');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }

    /**
     * Handle scroll state changes
     */
    handleScrollState() {
        const { scrollY, isAtTop, isAtBottom } = this.state;
        
        // Update body classes
        document.body.classList.toggle('at-top', isAtTop);
        document.body.classList.toggle('at-bottom', isAtBottom);
        document.body.classList.toggle('scrolled', scrollY > 10);
    }

    /**
     * Update header state based on scroll
     */
    updateHeaderState() {
        if (!this.header) return;
        
        const { scrollY } = this.state;
        const threshold = SCROLL_CONFIG.headerScrollThreshold;
        
        // Add scrolled class when past threshold
        this.header.classList.toggle(CSS_CLASSES.scrolled, scrollY > threshold);
        
        // Hide/show header based on scroll direction (optional)
        if (this.shouldHideHeader()) {
            this.header.classList.add('header--hidden');
        } else {
            this.header.classList.remove('header--hidden');
        }
    }

    /**
     * Determine if header should be hidden
     */
    shouldHideHeader() {
        const { scrollY, direction } = this.state;
        
        // Don't hide if at top
        if (scrollY <= 100) return false;
        
        // Hide when scrolling down past threshold
        return direction === 'down' && scrollY > 200;
    }

    /**
     * Handle custom scroll events
     */
    handleCustomScroll(detail) {
        // Handle any custom scroll logic here
        console.log('Custom scroll event received:', detail);
    }

    /**
     * Smooth scroll to top
     */
    scrollToTop(duration = 800) {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out quad)
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            
            const currentPosition = startPosition * (1 - easeOutQuad);
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = 0) {
        if (!element) return;
        
        const targetPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) * 0.5, 1000); // Max 1 second
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease in out cubic)
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentPosition = startPosition + distance * easeInOutCubic;
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    /**
     * Get current scroll state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Check if user is at top of page
     */
    isAtTop() {
        return this.state.isAtTop;
    }

    /**
     * Check if user is at bottom of page
     */
    isAtBottom() {
        return this.state.isAtBottom;
    }

    /**
     * Get scroll percentage
     */
    getScrollPercent() {
        return this.state.scrollPercent;
    }

    /**
     * Get scroll direction
     */
    getScrollDirection() {
        return this.state.direction;
    }

    /**
     * Add scroll event listener
     */
    onScroll(callback) {
        if (typeof callback !== 'function') {
            console.warn('Scroll callback must be a function');
            return;
        }
        
        document.addEventListener(CUSTOM_EVENTS.APP_SCROLL, (event) => {
            callback(event.detail);
        });
    }

    /**
     * Dispatch scroll events
     */
    dispatchScrollEvent() {
        this.dispatchEvent(CUSTOM_EVENTS.APP_SCROLL, this.state);
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
     * Enable/disable scroll
     */
    toggleScroll(enable = true) {
        if (enable) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    }

    /**
     * Lock scroll (prevent scrolling)
     */
    lockScroll() {
        this.toggleScroll(false);
    }

    /**
     * Unlock scroll (restore scrolling)
     */
    unlockScroll() {
        this.toggleScroll(true);
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Recalculate scroll percentage on resize
        this.update();
    }

    /**
     * Destroy scroll manager
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        
        // Clear timeouts
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Remove body classes
        document.body.classList.remove(
            'is-scrolling', 
            'scroll-down', 
            'scroll-up', 
            'at-top', 
            'at-bottom', 
            'scrolled'
        );
        
        // Remove header classes
        if (this.header) {
            this.header.classList.remove(CSS_CLASSES.scrolled, 'header--hidden');
        }
        
        // Unlock scroll
        this.unlockScroll();
        
        console.log('🧹 Scroll Manager destroyed');
    }
}