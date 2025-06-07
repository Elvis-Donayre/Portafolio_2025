/**
 * Animation Manager Component
 * Maneja todas las animaciones, parallax y efectos visuales
 */

import { throttle, prefersReducedMotion, isInViewport } from '../utils/helpers.js';
import { INTERSECTION_CONFIG, ANIMATION_DURATION, SELECTORS } from '../utils/constants.js';

export class AnimationManager {
    constructor() {
        this.intersectionObserver = null;
        this.parallaxElements = [];
        this.animatedElements = new Set();
        this.isEnabled = !prefersReducedMotion();
        this.rafId = null;
        
        // Animation state
        this.state = {
            scrollY: 0,
            isVisible: true,
            isPaused: false
        };
        
        // Bind methods
        this.handleIntersection = this.handleIntersection.bind(this);
        this.updateParallax = throttle(this.updateParallax.bind(this), 16);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        this.init();
    }

    /**
     * Initialize animation manager
     */
    init() {
        this.setupIntersectionObserver();
        this.setupParallaxElements();
        this.bindEvents();
        this.observeElements();
        
        console.log('✅ Animation Manager initialized');
        console.log(`🎭 Animations ${this.isEnabled ? 'enabled' : 'disabled (reduced motion)'}`);
    }

    /**
     * Setup intersection observer for scroll animations
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver not supported');
            this.fallbackToScrollListener();
            return;
        }
        
        const options = {
            threshold: INTERSECTION_CONFIG.threshold,
            rootMargin: INTERSECTION_CONFIG.rootMargin
        };
        
        this.intersectionObserver = new IntersectionObserver(
            this.handleIntersection,
            options
        );
    }

    /**
     * Setup parallax elements
     */
    setupParallaxElements() {
        // Define parallax elements with their speeds
        const parallaxSelectors = [
            { selector: '.hero__content', speed: 0.5 },
            { selector: '.hero__profile', speed: 0.3 },
            { selector: '.background', speed: 0.1 }
        ];
        
        parallaxSelectors.forEach(({ selector, speed }) => {
            const element = document.querySelector(selector);
            if (element) {
                this.parallaxElements.push({ element, speed });
            }
        });
        
        console.log(`🌟 Found ${this.parallaxElements.length} parallax elements`);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Visibility change for performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Reduced motion preference change
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.isEnabled = !e.matches;
            this.toggleAnimations(this.isEnabled);
        });
        
        // Custom app events
        document.addEventListener('app:scroll', (event) => {
            this.state.scrollY = event.detail.scrollY;
            if (this.isEnabled && !this.state.isPaused) {
                this.updateParallax();
            }
        });
    }

    /**
     * Observe elements for animations
     */
    observeElements() {
        if (!this.intersectionObserver) return;
        
        // Elements to animate on scroll
        const animatableSelectors = [
            SELECTORS.projectCards,
            SELECTORS.skillItems,
            '.contact-item',
            '.about__text',
            '.hero__actions'
        ];
        
        animatableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Set initial state
                this.setInitialAnimationState(element);
                
                // Observe element
                this.intersectionObserver.observe(element);
            });
        });
    }

    /**
     * Set initial animation state for elements
     */
    setInitialAnimationState(element) {
        if (!this.isEnabled) return;
        
        // Add data attribute to track animation state
        element.dataset.animated = 'false';
        
        // Set initial styles
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${ANIMATION_DURATION.normal}ms ease, transform ${ANIMATION_DURATION.normal}ms ease`;
    }

    /**
     * Handle intersection observer entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
            } else if (this.shouldReverseAnimation(entry.target)) {
                this.reverseAnimation(entry.target);
            }
        });
    }

    /**
     * Animate element into view
     */
    animateElement(element) {
        if (element.dataset.animated === 'true' || !this.isEnabled) return;
        
        element.dataset.animated = 'true';
        this.animatedElements.add(element);
        
        // Add stagger delay for multiple elements
        const delay = this.calculateStaggerDelay(element);
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Add animated class for CSS animations
            element.classList.add('animate-in');
            
            // Dispatch custom event
            this.dispatchEvent('element:animated', { element });
        }, delay);
        
        // Unobserve element after animation (performance optimization)
        setTimeout(() => {
            if (this.intersectionObserver) {
                this.intersectionObserver.unobserve(element);
            }
        }, ANIMATION_DURATION.normal);
    }

    /**
     * Calculate stagger delay for elements
     */
    calculateStaggerDelay(element) {
        const staggerSelectors = [
            SELECTORS.skillItems,
            SELECTORS.projectCards,
            '.contact-item'
        ];
        
        const isStaggerElement = staggerSelectors.some(selector => {
            return element.matches(selector);
        });
        
        if (!isStaggerElement) return 0;
        
        // Find element index in its container
        const parent = element.parentElement;
        const siblings = parent.querySelectorAll(element.tagName);
        const index = Array.from(siblings).indexOf(element);
        
        return index * 100; // 100ms stagger delay
    }

    /**
     * Check if animation should be reversed
     */
    shouldReverseAnimation(element) {
        // Only reverse for certain elements if desired
        return false; // Disabled by default for better UX
    }

    /**
     * Reverse animation (fade out)
     */
    reverseAnimation(element) {
        if (!this.isEnabled) return;
        
        element.dataset.animated = 'false';
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.classList.remove('animate-in');
        
        this.animatedElements.delete(element);
    }

    /**
     * Update parallax effects
     */
    updateParallax() {
        if (!this.isEnabled || this.state.isPaused || this.parallaxElements.length === 0) {
            return;
        }
        
        const scrollY = this.state.scrollY;
        
        this.parallaxElements.forEach(({ element, speed }) => {
            if (!isInViewport(element, 0.1)) return; // Skip if not in viewport
            
            const yPos = scrollY * speed;
            const transform = `translate3d(0, ${yPos}px, 0)`;
            
            // Use transform3d for hardware acceleration
            element.style.transform = transform;
        });
    }

    /**
     * Handle visibility change (pause animations when tab not active)
     */
    handleVisibilityChange() {
        this.state.isVisible = !document.hidden;
        
        if (this.state.isVisible) {
            this.resume();
        } else {
            this.pause();
        }
    }

    /**
     * Pause animations
     */
    pause() {
        this.state.isPaused = true;
        
        // Cancel any running animation frames
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        
        console.log('⏸️ Animations paused');
    }

    /**
     * Resume animations
     */
    resume() {
        this.state.isPaused = false;
        console.log('▶️ Animations resumed');
    }

    /**
     * Toggle animations on/off
     */
    toggleAnimations(enable) {
        this.isEnabled = enable;
        
        if (!enable) {
            // Immediately show all elements
            this.animatedElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.style.transition = 'none';
            });
            
            // Reset parallax elements
            this.parallaxElements.forEach(({ element }) => {
                element.style.transform = 'none';
            });
        } else {
            // Re-enable transitions
            this.animatedElements.forEach(element => {
                element.style.transition = `opacity ${ANIMATION_DURATION.normal}ms ease, transform ${ANIMATION_DURATION.normal}ms ease`;
            });
        }
        
        console.log(`🎭 Animations ${enable ? 'enabled' : 'disabled'}`);
    }

    /**
     * Animate element with custom animation
     */
    animateElementCustom(element, animation, duration = ANIMATION_DURATION.normal) {
        if (!this.isEnabled || !element) return Promise.resolve();
        
        return new Promise(resolve => {
            const animations = {
                fadeIn: () => {
                    element.style.opacity = '0';
                    element.style.transition = `opacity ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                    });
                },
                fadeOut: () => {
                    element.style.transition = `opacity ${duration}ms ease`;
                    element.style.opacity = '0';
                },
                slideInUp: () => {
                    element.style.transform = 'translateY(30px)';
                    element.style.opacity = '0';
                    element.style.transition = `all ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.transform = 'translateY(0)';
                        element.style.opacity = '1';
                    });
                },
                slideInDown: () => {
                    element.style.transform = 'translateY(-30px)';
                    element.style.opacity = '0';
                    element.style.transition = `all ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.transform = 'translateY(0)';
                        element.style.opacity = '1';
                    });
                },
                slideInLeft: () => {
                    element.style.transform = 'translateX(-30px)';
                    element.style.opacity = '0';
                    element.style.transition = `all ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.transform = 'translateX(0)';
                        element.style.opacity = '1';
                    });
                },
                slideInRight: () => {
                    element.style.transform = 'translateX(30px)';
                    element.style.opacity = '0';
                    element.style.transition = `all ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.transform = 'translateX(0)';
                        element.style.opacity = '1';
                    });
                },
                scaleIn: () => {
                    element.style.transform = 'scale(0.8)';
                    element.style.opacity = '0';
                    element.style.transition = `all ${duration}ms ease`;
                    requestAnimationFrame(() => {
                        element.style.transform = 'scale(1)';
                        element.style.opacity = '1';
                    });
                },
                bounce: () => {
                    element.style.animation = `bounce ${duration}ms ease`;
                }
            };
            
            if (animations[animation]) {
                animations[animation]();
                setTimeout(resolve, duration);
            } else {
                console.warn(`Animation "${animation}" not found`);
                resolve();
            }
        });
    }

    /**
     * Create staggered animation for multiple elements
     */
    staggerElements(elements, animation = 'slideInUp', staggerDelay = 100, duration = ANIMATION_DURATION.normal) {
        if (!this.isEnabled) return Promise.resolve();
        
        const promises = [];
        
        elements.forEach((element, index) => {
            const delay = index * staggerDelay;
            
            const promise = new Promise(resolve => {
                setTimeout(() => {
                    this.animateElementCustom(element, animation, duration).then(resolve);
                }, delay);
            });
            
            promises.push(promise);
        });
        
        return Promise.all(promises);
    }

    /**
     * Create typing animation effect
     */
    typeWriter(element, text, speed = 50) {
        if (!this.isEnabled || !element) return Promise.resolve();
        
        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    }

    /**
     * Create counting animation effect
     */
    countUp(element, start = 0, end = 100, duration = 2000) {
        if (!this.isEnabled || !element) return Promise.resolve();
        
        return new Promise(resolve => {
            const startTime = performance.now();
            const range = end - start;
            
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + range * easeOut);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(update);
        });
    }

    /**
     * Create pulse animation
     */
    pulse(element, scale = 1.1, duration = 500) {
        if (!this.isEnabled || !element) return Promise.resolve();
        
        return new Promise(resolve => {
            const originalTransform = element.style.transform;
            
            element.style.transition = `transform ${duration / 2}ms ease`;
            element.style.transform = `scale(${scale})`;
            
            setTimeout(() => {
                element.style.transform = originalTransform;
                setTimeout(resolve, duration / 2);
            }, duration / 2);
        });
    }

    /**
     * Create shake animation
     */
    shake(element, intensity = 10, duration = 500) {
        if (!this.isEnabled || !element) return Promise.resolve();
        
        return new Promise(resolve => {
            const originalTransform = element.style.transform;
            const frames = 10;
            const frameTime = duration / frames;
            let frame = 0;
            
            const animate = () => {
                if (frame < frames) {
                    const x = (Math.random() - 0.5) * intensity;
                    const y = (Math.random() - 0.5) * intensity;
                    element.style.transform = `translate(${x}px, ${y}px)`;
                    frame++;
                    setTimeout(animate, frameTime);
                } else {
                    element.style.transform = originalTransform;
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * Fallback for browsers without IntersectionObserver
     */
    fallbackToScrollListener() {
        const handleScroll = throttle(() => {
            const elements = document.querySelectorAll('[data-animated="false"]');
            
            elements.forEach(element => {
                if (isInViewport(element, 0.2)) {
                    this.animateElement(element);
                }
            });
        }, 100);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();
    }

    /**
     * Get animation state
     */
    getState() {
        return {
            ...this.state,
            isEnabled: this.isEnabled,
            animatedCount: this.animatedElements.size,
            parallaxCount: this.parallaxElements.length
        };
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
     * Destroy animation manager
     */
    destroy() {
        // Disconnect intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Cancel animation frames
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Reset all animated elements
        this.animatedElements.forEach(element => {
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
            element.classList.remove('animate-in');
            delete element.dataset.animated;
        });
        
        // Reset parallax elements
        this.parallaxElements.forEach(({ element }) => {
            element.style.transform = '';
        });
        
        // Clear collections
        this.animatedElements.clear();
        this.parallaxElements = [];
        
        console.log('🧹 Animation Manager destroyed');
    }
}