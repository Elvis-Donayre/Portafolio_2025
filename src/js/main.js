/**
 * Main Application Entry Point
 * Inicializa y coordina todos los módulos de la aplicación incluido el bento mode
 */

import { Navigation } from './components/navigation.js';
import { ScrollManager } from './components/scroll.js';
import { AnimationManager } from './components/animations.js';
import { FormHandler } from './components/form.js';
import { PaletteSelector } from './components/palette.js';
import { SkillsSlider } from './components/skillsSlider.js';
import { debounce, throttle } from './utils/helpers.js';
import { BREAKPOINTS, ANIMATION_DURATION } from './utils/constants.js';

/**
 * Portfolio Application Class - Bento Mode
 * Clase principal que maneja toda la funcionalidad del portfolio en modo bento
 */
class PortfolioApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        
        // Bind methods
        this.handleResize = debounce(this.handleResize.bind(this), 250);
        this.handleScroll = throttle(this.handleScroll.bind(this), 16);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Portfolio App (Bento Mode)...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core components
            this.initializeComponents();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Setup performance optimizations
            this.setupPerformanceOptimizations();
            
            // Setup bento grid animations
            this.setupBentoAnimations();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Portfolio App (Bento Mode) initialized successfully');
            
            // Dispatch custom event
            this.dispatchEvent('app:initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Portfolio App:', error);
            this.handleError(error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        console.log('🔧 Initializing components...');
        
        try {
            // Initialize navigation
            const navigation = new Navigation();
            this.components.set('navigation', navigation);
            
            // Initialize scroll manager
            const scrollManager = new ScrollManager();
            this.components.set('scrollManager', scrollManager);
            
            // Initialize animation manager
            const animationManager = new AnimationManager();
            this.components.set('animationManager', animationManager);
            
            // Initialize form handler
            const formHandler = new FormHandler();
            this.components.set('formHandler', formHandler);
            
            // Initialize palette selector
            const paletteSelector = new PaletteSelector();
            this.components.set('paletteSelector', paletteSelector);
            
            // Initialize skills slider (NUEVO)
            const skillsSlider = new SkillsSlider();
            this.components.set('skillsSlider', skillsSlider);
            
            console.log('✅ All components initialized');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
            throw error;
        }
    }

    /**
     * Bind global event listeners
     */
    bindGlobalEvents() {
        console.log('🎯 Binding global events...');
        
        // Window events
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });
        window.addEventListener('orientationchange', this.handleResize);
        
        // Document events
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        // Custom events
        document.addEventListener('app:themeChange', this.handleThemeChange.bind(this));
        document.addEventListener('skill:click', this.handleSkillClick.bind(this));
        
        console.log('✅ Global events bound');
    }

    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Set viewport height for mobile
        this.updateViewportHeight();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Setup service worker if available
        this.setupServiceWorker();
    }

    /**
     * Setup bento grid animations
     */
    setupBentoAnimations() {
        const bentoItems = document.querySelectorAll('.bento-item');
        
        // Stagger animations for bento items
        bentoItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
        
        console.log('✅ Bento animations setup complete');
    }

    /**
     * Handle window scroll events
     */
    handleScroll() {
        if (!this.isInitialized) return;
        
        const scrollManager = this.components.get('scrollManager');
        const animationManager = this.components.get('animationManager');
        
        if (scrollManager) {
            scrollManager.update();
        }
        
        if (animationManager) {
            animationManager.updateParallax();
        }
        
        // Dispatch custom scroll event
        this.dispatchEvent('app:scroll', {
            scrollY: window.pageYOffset,
            scrollPercent: this.getScrollPercent()
        });
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        if (!this.isInitialized) return;
        
        // Update viewport height
        this.updateViewportHeight();
        
        // Update components
        this.components.forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
        
        // Recalculate bento grid if needed
        this.recalculateBentoGrid();
        
        // Dispatch custom resize event
        this.dispatchEvent('app:resize', {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.getCurrentBreakpoint()
        });
    }

    /**
     * Handle visibility change events
     */
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        
        // Pause/resume animations based on visibility
        const animationManager = this.components.get('animationManager');
        const skillsSlider = this.components.get('skillsSlider');
        
        if (animationManager) {
            if (isVisible) {
                animationManager.resume();
            } else {
                animationManager.pause();
            }
        }
        
        if (skillsSlider) {
            if (isVisible) {
                skillsSlider.resume();
            } else {
                skillsSlider.pause();
            }
        }
        
        this.dispatchEvent('app:visibilityChange', { isVisible });
    }

    /**
     * Handle theme changes
     */
    handleThemeChange(event) {
        const { theme } = event.detail;
        console.log('🎨 Theme changed to:', theme);
        
        // Update meta theme color
        this.updateMetaThemeColor(theme);
        
        // Notify components
        this.components.forEach(component => {
            if (component.handleThemeChange) {
                component.handleThemeChange(theme);
            }
        });
    }

    /**
     * Handle skill clicks
     */
    handleSkillClick(event) {
        const { skill, element } = event.detail;
        console.log('🎯 Skill clicked:', skill);
        
        // Show skill information or perform action
        this.showSkillInfo(skill);
        
        // Analytics tracking
        this.trackEvent('skill_click', {
            skill_name: skill,
            section: 'skills_slider'
        });
    }

    /**
     * Show skill information
     */
    showSkillInfo(skill) {
        // Create and show a tooltip or modal with skill information
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = `
            <div class="skill-tooltip__content">
                <h4>${skill}</h4>
                <p>Click para ver más información sobre esta tecnología.</p>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip near cursor or element
        // Remove after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);
    }

    /**
     * Recalculate bento grid layout
     */
    recalculateBentoGrid() {
        const bentoGrid = document.querySelector('.bento-grid');
        if (!bentoGrid) return;
        
        // Force reflow for responsive adjustments
        bentoGrid.style.display = 'none';
        bentoGrid.offsetHeight; // Trigger reflow
        bentoGrid.style.display = 'grid';
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        console.error('🚨 Global error:', event.error);
        this.handleError(event.error);
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        this.handleError(event.reason);
    }

    /**
     * Generic error handler
     */
    handleError(error) {
        // Log error for debugging
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Show user-friendly error message
        this.showNotification('Ocurrió un error inesperado. Por favor, recarga la página.', 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    /**
     * Update viewport height for mobile
     */
    updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    /**
     * Update meta theme color
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme.primary || '#374151';
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= BREAKPOINTS['2xl']) return '2xl';
        if (width >= BREAKPOINTS.xl) return 'xl';
        if (width >= BREAKPOINTS.lg) return 'lg';
        if (width >= BREAKPOINTS.md) return 'md';
        if (width >= BREAKPOINTS.sm) return 'sm';
        return 'xs';
    }

    /**
     * Get scroll percentage
     */
    getScrollPercent() {
        const scrolled = window.pageYOffset;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        return maxHeight > 0 ? Math.min((scrolled / maxHeight) * 100, 100) : 0;
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload hero image
        const heroImage = document.querySelector('.bento-profile-image img');
        if (heroImage && heroImage.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }
        
        // Preload critical CSS
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            link.onload = function() { this.rel = 'stylesheet'; };
            document.head.appendChild(link);
        });
    }

    /**
     * Setup lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup service worker
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator && 'production' === 'production') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    /**
     * Track events (analytics)
     */
    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        console.log('📊 Event tracked:', eventName, properties);
    }

    /**
     * Get component by name
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Get app state
     */
    getState() {
        const state = {
            isInitialized: this.isInitialized,
            breakpoint: this.getCurrentBreakpoint(),
            scrollPercent: this.getScrollPercent(),
            components: {}
        };
        
        // Get state from each component
        this.components.forEach((component, name) => {
            if (component.getState) {
                state.components[name] = component.getState();
            }
        });
        
        return state;
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
     * Destroy application
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Destroy all components
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        
        // Clear components map
        this.components.clear();
        
        // Reset state
        this.isInitialized = false;
        
        console.log('🧹 Portfolio App destroyed');
    }
}

/**
 * Initialize application when DOM is ready
 */
const app = new PortfolioApp();
app.init();

// Export app instance for global access
window.portfolioApp = app;

// Development helpers
if (process.env.NODE_ENV === 'development') {
    window.app = app;
    window.getAppState = () => app.getState();
    window.getComponent = (name) => app.getComponent(name);
}

export default app;