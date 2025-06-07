/**
 * Palette Selector Component
 * Maneja el cambio de paletas de colores y persistencia de preferencias
 */

import { storage, setCSSVariable } from '../utils/helpers.js';
import { COLOR_PALETTES, STORAGE_KEYS, CUSTOM_EVENTS } from '../utils/constants.js';

export class PaletteSelector {
    constructor() {
        this.container = null;
        this.paletteButtons = [];
        this.currentPalette = '5'; // Default: Minimalista Gris
        this.isAnimating = false;
        
        // Bind methods
        this.handlePaletteClick = this.handlePaletteClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        this.init();
    }

    /**
     * Initialize palette selector
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSavedPalette();
        this.setupKeyboardNavigation();
        
        console.log('✅ Palette Selector initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.container = document.querySelector('.palette-selector');
        this.paletteButtons = document.querySelectorAll('.palette-option');
        
        if (!this.container) {
            console.warn('⚠️ Palette selector container not found');
            return;
        }
        
        if (!this.paletteButtons.length) {
            console.warn('⚠️ No palette buttons found');
            return;
        }
        
        console.log(`🎨 Found ${this.paletteButtons.length} palette options`);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.paletteButtons.forEach(button => {
            button.addEventListener('click', this.handlePaletteClick);
            button.addEventListener('keydown', this.handleKeydown);
        });
        
        // Listen for theme change events from other components
        document.addEventListener(CUSTOM_EVENTS.THEME_CHANGE, (event) => {
            this.handleExternalThemeChange(event.detail);
        });
        
        // Handle system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            this.updateMetaThemeColor();
        });
    }

    /**
     * Handle palette button clicks
     */
    handlePaletteClick(event) {
        if (this.isAnimating) return;
        
        const button = event.currentTarget;
        const paletteId = button.dataset.palette;
        
        if (!paletteId || paletteId === this.currentPalette) return;
        
        this.changePalette(paletteId);
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(event) {
        const { key } = event;
        
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            this.handlePaletteClick(event);
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
            event.preventDefault();
            this.navigatePalettes(key === 'ArrowDown' ? 1 : -1);
        }
    }

    /**
     * Navigate between palettes with keyboard
     */
    navigatePalettes(direction) {
        const currentIndex = Array.from(this.paletteButtons).findIndex(
            button => button === document.activeElement
        );
        
        if (currentIndex === -1) return;
        
        const nextIndex = currentIndex + direction;
        const targetIndex = Math.max(0, Math.min(nextIndex, this.paletteButtons.length - 1));
        
        this.paletteButtons[targetIndex].focus();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Make palette buttons focusable
        this.paletteButtons.forEach((button, index) => {
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');
            button.setAttribute('role', 'radio');
            button.setAttribute('aria-label', `Paleta ${index + 1}: ${this.getPaletteName(button.dataset.palette)}`);
        });
        
        // Set up radio group
        if (this.container) {
            this.container.setAttribute('role', 'radiogroup');
            this.container.setAttribute('aria-label', 'Selector de paleta de colores');
        }
    }

    /**
     * Change color palette
     */
    changePalette(paletteId) {
        if (!COLOR_PALETTES[paletteId] || this.isAnimating) return;
        
        this.isAnimating = true;
        
        const palette = COLOR_PALETTES[paletteId];
        const oldPalette = this.currentPalette;
        
        // Update active button
        this.updateActiveButton(paletteId);
        
        // Apply palette with animation
        this.applyPaletteWithAnimation(palette).then(() => {
            this.currentPalette = paletteId;
            this.savePalette(paletteId);
            this.updateMetaThemeColor();
            
            // Dispatch change event
            this.dispatchPaletteChangeEvent(paletteId, oldPalette);
            
            // Show notification
            this.showPaletteNotification(palette.name);
            
            this.isAnimating = false;
        });
    }

    /**
     * Apply palette with smooth animation
     */
    applyPaletteWithAnimation(palette) {
        return new Promise((resolve) => {
            // Create transition overlay for smooth color change
            const overlay = this.createTransitionOverlay();
            
            // Apply new colors
            this.applyPaletteColors(palette);
            
            // Animate transition
            requestAnimationFrame(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    if (overlay.parentNode) {
                        document.body.removeChild(overlay);
                    }
                    resolve();
                }, 300);
            });
        });
    }

    /**
     * Create transition overlay for smooth palette changes
     */
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.getCurrentPrimaryColor()};
            opacity: 0.1;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 300ms ease;
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }

    /**
     * Apply palette colors to CSS variables
     */
    applyPaletteColors(palette) {
        const root = document.documentElement;
        
        // Core colors
        setCSSVariable('--color-primary', palette.primary, root);
        setCSSVariable('--color-secondary', palette.secondary, root);
        setCSSVariable('--color-accent', palette.accent, root);
        setCSSVariable('--color-success', palette.success, root);
        
        // Background colors
        setCSSVariable('--color-bg-primary', palette.bg, root);
        setCSSVariable('--color-bg-secondary', palette.bgSecondary, root);
        
        // Gradients
        setCSSVariable('--gradient-primary', `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`, root);
        setCSSVariable('--gradient-hero', palette.hero, root);
        setCSSVariable('--gradient-text', `linear-gradient(135deg, var(--color-text-primary), ${palette.secondary})`, root);
        
        // Shadows
        setCSSVariable('--shadow-glow', `0 10px 30px ${palette.glow}`, root);
        setCSSVariable('--shadow-glow-hover', `0 15px 40px ${palette.glowHover}`, root);
        
        // Update palette option styles
        this.updatePaletteOptionStyles();
    }

    /**
     * Update active button state
     */
    updateActiveButton(paletteId) {
        // Remove active class from all buttons
        this.paletteButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-checked', 'false');
            button.setAttribute('tabindex', '-1');
        });
        
        // Add active class to selected button
        const activeButton = document.querySelector(`[data-palette="${paletteId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-checked', 'true');
            activeButton.setAttribute('tabindex', '0');
        }
    }

    /**
     * Update palette option button styles
     */
    updatePaletteOptionStyles() {
        // Add CSS for palette option gradients if not exists
        let styleElement = document.getElementById('palette-option-styles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'palette-option-styles';
            document.head.appendChild(styleElement);
        }
        
        const styles = Object.entries(COLOR_PALETTES).map(([id, palette]) => {
            return `.palette-option--${id}::before { 
                background: linear-gradient(135deg, ${palette.primary}, ${palette.secondary}); 
            }`;
        }).join('\n');
        
        styleElement.textContent = styles;
    }

    /**
     * Load saved palette from storage
     */
    loadSavedPalette() {
        const savedPalette = storage.get(STORAGE_KEYS.palette, this.currentPalette);
        
        if (COLOR_PALETTES[savedPalette]) {
            this.changePalette(savedPalette);
        } else {
            // Fallback to default
            this.changePalette(this.currentPalette);
        }
        
        console.log(`🎨 Loaded palette: ${this.getPaletteName(savedPalette)}`);
    }

    /**
     * Save palette to storage
     */
    savePalette(paletteId) {
        const success = storage.set(STORAGE_KEYS.palette, paletteId);
        
        if (!success) {
            console.warn('⚠️ Failed to save palette preference');
        }
    }

    /**
     * Get palette name by ID
     */
    getPaletteName(paletteId) {
        return COLOR_PALETTES[paletteId]?.name || 'Desconocida';
    }

    /**
     * Get current primary color
     */
    getCurrentPrimaryColor() {
        return COLOR_PALETTES[this.currentPalette]?.primary || '#374151';
    }

    /**
     * Update meta theme color for mobile browsers
     */
    updateMetaThemeColor() {
        const themeColor = this.getCurrentPrimaryColor();
        
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = themeColor;
    }

    /**
     * Handle external theme change events
     */
    handleExternalThemeChange(detail) {
        if (detail.paletteId && detail.paletteId !== this.currentPalette) {
            this.changePalette(detail.paletteId);
        }
    }

    /**
     * Show palette change notification
     */
    showPaletteNotification(paletteName) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification notification--success';
        notification.innerHTML = `
            <i class="fas fa-palette" aria-hidden="true"></i>
            Paleta cambiada: ${paletteName}
        `;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            background: 'var(--color-success)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        });
        
        // Add to DOM and animate
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }

    /**
     * Dispatch palette change event
     */
    dispatchPaletteChangeEvent(newPaletteId, oldPaletteId) {
        const event = new CustomEvent(CUSTOM_EVENTS.PALETTE_CHANGE, {
            detail: {
                paletteId: newPaletteId,
                paletteName: this.getPaletteName(newPaletteId),
                oldPaletteId,
                palette: COLOR_PALETTES[newPaletteId]
            },
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get current palette info
     */
    getCurrentPalette() {
        return {
            id: this.currentPalette,
            name: this.getPaletteName(this.currentPalette),
            colors: COLOR_PALETTES[this.currentPalette]
        };
    }

    /**
     * Get all available palettes
     */
    getAvailablePalettes() {
        return Object.entries(COLOR_PALETTES).map(([id, palette]) => ({
            id,
            name: palette.name,
            colors: palette
        }));
    }

    /**
     * Set palette programmatically
     */
    setPalette(paletteId) {
        if (COLOR_PALETTES[paletteId]) {
            this.changePalette(paletteId);
            return true;
        }
        
        console.warn(`⚠️ Palette "${paletteId}" not found`);
        return false;
    }

    /**
     * Reset to default palette
     */
    resetToDefault() {
        this.changePalette('5'); // Minimalista Gris
    }

    /**
     * Show/hide palette selector
     */
    toggle(show = null) {
        if (!this.container) return;
        
        const isVisible = !this.container.classList.contains('hidden');
        const shouldShow = show !== null ? show : !isVisible;
        
        this.container.classList.toggle('hidden', !shouldShow);
        
        // Update accessibility
        this.container.setAttribute('aria-hidden', !shouldShow);
        
        if (shouldShow) {
            // Focus first palette button
            this.paletteButtons[0]?.focus();
        }
    }

    /**
     * Enable/disable palette selector
     */
    setEnabled(enabled) {
        this.paletteButtons.forEach(button => {
            button.disabled = !enabled;
            button.setAttribute('aria-disabled', !enabled);
        });
        
        if (this.container) {
            this.container.classList.toggle('disabled', !enabled);
        }
    }

    /**
     * Get palette selector state
     */
    getState() {
        return {
            currentPalette: this.currentPalette,
            currentPaletteName: this.getPaletteName(this.currentPalette),
            isAnimating: this.isAnimating,
            isVisible: this.container ? !this.container.classList.contains('hidden') : false,
            availablePalettes: this.getAvailablePalettes()
        };
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Hide palette selector on very small screens
        if (window.innerWidth < 480) {
            this.toggle(false);
        } else {
            this.toggle(true);
        }
    }

    /**
     * Destroy palette selector
     */
    destroy() {
        // Remove event listeners
        this.paletteButtons.forEach(button => {
            button.removeEventListener('click', this.handlePaletteClick);
            button.removeEventListener('keydown', this.handleKeydown);
        });
        
        // Remove custom styles
        const styleElement = document.getElementById('palette-option-styles');
        if (styleElement) {
            styleElement.remove();
        }
        
        // Reset button states
        this.paletteButtons.forEach(button => {
            button.classList.remove('active');
            button.removeAttribute('aria-checked');
            button.removeAttribute('tabindex');
            button.removeAttribute('role');
            button.removeAttribute('aria-label');
        });
        
        // Reset container
        if (this.container) {
            this.container.removeAttribute('role');
            this.container.removeAttribute('aria-label');
            this.container.classList.remove('hidden', 'disabled');
        }
        
        // Clear references
        this.container = null;
        this.paletteButtons = [];
        this.isAnimating = false;
        
        console.log('🧹 Palette Selector destroyed');
    }
}