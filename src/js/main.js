/**
 * Main Application Entry Point
 * Inicializa y coordina todos los módulos de la aplicación
 */

import { Navigation } from './components/navigation.js';
import { ScrollManager } from './components/scroll.js';
import { AnimationManager } from './components/animations.js';
import { FormHandler } from './components/form.js';
import { PaletteSelector } from './components/palette.js';
import { debounce, throttle } from './utils/helpers.js';
import { BREAKPOINTS, ANIMATION_DURATION } from './utils/constants.js';

/**
 * Portfolio Application Class
 * Clase principal que maneja toda la funcionalidad del portfolio
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
            console.log('🚀 Initializing Portfolio App...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core components
            this.initializeComponents();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Setup performance optimizations
            this.setupPerformanceOptimizations();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Portfolio App initialized successfully');
            
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
        if (animationManager) {
            if (isVisible) {
                animationManager.resume();
            } else {
                animationManager.pause();
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
        this.showNotification('Ocurrió un error inesperado. Por favor, recarga la página