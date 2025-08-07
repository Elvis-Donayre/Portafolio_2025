/**
 * Skills Slider Component
 * Maneja el slider de skills con iconos de colores y animaciones
 * Archivo: src/js/components/skillsSlider.js
 */

import { throttle, debounce } from '../utils/helpers.js';
import { CUSTOM_EVENTS } from '../utils/constants.js';

export class SkillsSlider {
    constructor() {
        this.container = null;
        this.track = null;
        this.skillItems = [];
        this.isPlaying = true;
        this.isPaused = false;
        this.animationId = null;
        this.speed = 1; // Velocidad de desplazamiento
        this.position = 0;
        
        // Bind methods
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleResize = debounce(this.handleResize.bind(this), 250);
        this.animate = this.animate.bind(this);
        
        this.init();
    }

    /**
     * Initialize skills slider
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.startAnimation();
        
        console.log('✅ Skills Slider initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.container = document.querySelector('.skills-slider');
        this.track = document.querySelector('.skills-track');
        this.skillItems = Array.from(document.querySelectorAll('.skill-item'));
        
        if (!this.container || !this.track) {
            console.warn('⚠️ Skills slider elements not found');
            return;
        }
        
        console.log(`🎯 Found ${this.skillItems.length} skill items`);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.container) return;
        
        // Mouse events for pause/resume
        this.container.addEventListener('mouseenter', this.handleMouseEnter);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);
        
        // Touch events for mobile
        this.container.addEventListener('touchstart', this.handleMouseEnter, { passive: true });
        this.container.addEventListener('touchend', this.handleMouseLeave, { passive: true });
        
        // Window events
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Skill item clicks
        this.skillItems.forEach(item => {
            item.addEventListener('click', () => this.handleSkillClick(item));
        });
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const options = {
            threshold: 0,
            rootMargin: '50px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resume();
                } else {
                    this.pause();
                }
            });
        }, options);
        
        if (this.container) {
            this.observer.observe(this.container);
        }
    }

    /**
     * Start animation
     */
    startAnimation() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.isPlaying = true;
        this.animate();
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying || this.isPaused) {
            return;
        }
        
        // Incrementar posición
        this.position += this.speed;
        
        // Reset cuando llega al 50% (donde está la duplicación)
        if (this.position >= this.getTrackWidth() / 2) {
            this.position = 0;
        }
        
        // Aplicar transformación
        if (this.track) {
            this.track.style.transform = `translateX(-${this.position}px)`;
        }
        
        this.animationId = requestAnimationFrame(this.animate);
    }

    /**
     * Get track width
     */
    getTrackWidth() {
        if (!this.track) return 0;
        return this.track.scrollWidth;
    }

    /**
     * Pause animation on hover
     */
    handleMouseEnter() {
        this.isPaused = true;
        this.addHoverEffect();
    }

    /**
     * Resume animation on mouse leave
     */
    handleMouseLeave() {
        this.isPaused = false;
        this.removeHoverEffect();
        if (this.isPlaying) {
            this.animate();
        }
    }

    /**
     * Add hover effect to skills
     */
    addHoverEffect() {
        this.skillItems.forEach(item => {
            item.style.animationPlayState = 'paused';
        });
    }

    /**
     * Remove hover effect from skills
     */
    removeHoverEffect() {
        this.skillItems.forEach(item => {
            item.style.animationPlayState = 'running';
        });
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalcular dimensiones si es necesario
        if (this.track) {
            // Forzar recalculo del ancho
            this.track.style.width = 'auto';
            setTimeout(() => {
                this.track.style.width = '';
            }, 10);
        }
    }

    /**
     * Handle skill item click
     */
    handleSkillClick(skillItem) {
        const skillName = skillItem.querySelector('.skill-name').textContent;
        const skillIcon = skillItem.querySelector('.skill-icon i').className;
        
        // Efecto visual de click
        this.animateClick(skillItem);
        
        // Dispatch custom event
        this.dispatchEvent(CUSTOM_EVENTS.SKILL_CLICK || 'skill:click', {
            skill: skillName,
            icon: skillIcon,
            element: skillItem
        });
        
        console.log(`🎯 Skill clicked: ${skillName}`);
    }

    /**
     * Animate skill click
     */
    animateClick(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 100);
    }

    /**
     * Pause slider
     */
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Resume slider
     */
    resume() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animate();
        }
    }

    /**
     * Set animation speed
     */
    setSpeed(speed) {
        this.speed = Math.max(0.1, Math.min(5, speed)); // Clamp between 0.1 and 5
    }

    /**
     * Get slider state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            speed: this.speed,
            position: this.position,
            skillsCount: this.skillItems.length / 2, // Dividido por 2 por la duplicación
            trackWidth: this.getTrackWidth()
        };
    }

    /**
     * Toggle slider play/pause
     */
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
        
        return this.isPlaying;
    }

    /**
     * Reset slider position
     */
    reset() {
        this.position = 0;
        if (this.track) {
            this.track.style.transform = 'translateX(0)';
        }
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
     * Destroy skills slider
     */
    destroy() {
        // Stop animation
        this.pause();
        
        // Remove event listeners
        if (this.container) {
            this.container.removeEventListener('mouseenter', this.handleMouseEnter);
            this.container.removeEventListener('mouseleave', this.handleMouseLeave);
            this.container.removeEventListener('touchstart', this.handleMouseEnter);
            this.container.removeEventListener('touchend', this.handleMouseLeave);
        }
        
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Remove skill click listeners
        this.skillItems.forEach(item => {
            item.removeEventListener('click', () => this.handleSkillClick(item));
        });
        
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Reset styles
        if (this.track) {
            this.track.style.transform = '';
        }
        
        // Clear references
        this.container = null;
        this.track = null;
        this.skillItems = [];
        
        console.log('🧹 Skills Slider destroyed');
    }
}