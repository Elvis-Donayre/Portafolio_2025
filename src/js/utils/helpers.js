/**
 * Utility Helper Functions
 * Funciones de utilidad reutilizables
 */

/**
 * Throttle function - limita la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en milisegundos
 * @returns {Function} Función throttled
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function - retrasa la ejecución hasta que pase el tiempo especificado
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en milisegundos
 * @param {boolean} immediate - Ejecutar inmediatamente
 * @returns {Function} Función debounced
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Create a promise that resolves after specified time
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del delay
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Elemento a verificar
 * @param {number} threshold - Porcentaje del elemento que debe estar visible (0-1)
 * @returns {boolean} True si está en el viewport
 */
export function isInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    if (threshold === 0) {
        return vertInView && horInView;
    }
    
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    
    return (visibleArea / totalArea) >= threshold;
}

/**
 * Get scroll percentage of page
 * @returns {number} Porcentaje de scroll (0-100)
 */
export function getScrollPercent() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    return maxHeight > 0 ? Math.min((scrolled / maxHeight) * 100, 100) : 0;
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Elemento o selector
 * @param {number} offset - Offset adicional
 * @param {number} duration - Duración de la animación
 */
export function smoothScrollTo(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

/**
 * Easing function for smooth animations
 * @param {number} t - Current time
 * @param {number} b - Start value
 * @param {number} c - Change in value
 * @param {number} d - Duration
 * @returns {number} Eased value
 */
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

/**
 * Format string with template literals
 * @param {string} template - String template with {key} placeholders
 * @param {Object} values - Valores para reemplazar
 * @returns {string} String formateado
 */
export function formatString(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return values.hasOwnProperty(key) ? values[key] : match;
    });
}

/**
 * Validate email address
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefijo para el ID
 * @returns {string} ID único
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {*} obj - Objeto a clonar
 * @returns {*} Objeto clonado
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Get CSS custom property value
 * @param {string} property - Nombre de la propiedad CSS
 * @param {HTMLElement} element - Elemento de referencia
 * @returns {string} Valor de la propiedad
 */
export function getCSSVariable(property, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Set CSS custom property value
 * @param {string} property - Nombre de la propiedad CSS
 * @param {string} value - Valor a establecer
 * @param {HTMLElement} element - Elemento de referencia
 */
export function setCSSVariable(property, value, element = document.documentElement) {
    element.style.setProperty(property, value);
}

/**
 * Get current breakpoint
 * @returns {string} Breakpoint actual ('xs', 'sm', 'md', 'lg', 'xl')
 */
export function getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 640) return 'sm';
    return 'xs';
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True si prefiere movimiento reducido
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 * @returns {boolean} True si prefiere modo oscuro
 */
export function prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get device type based on user agent and screen size
 * @returns {string} Tipo de dispositivo ('mobile', 'tablet', 'desktop')
 */
export function getDeviceType() {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        return width < 768 ? 'mobile' : 'tablet';
    }
    
    return width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
}

/**
 * Safe localStorage operations
 */
export const storage = {
    /**
     * Get item from localStorage safely
     * @param {string} key - Clave del item
     * @param {*} defaultValue - Valor por defecto
     * @returns {*} Valor del localStorage o defaultValue
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage: ${error.message}`);
            return defaultValue;
        }
    },
    
    /**
     * Set item in localStorage safely
     * @param {string} key - Clave del item
     * @param {*} value - Valor a guardar
     * @returns {boolean} True si se guardó correctamente
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error writing to localStorage: ${error.message}`);
            return false;
        }
    },
    
    /**
     * Remove item from localStorage safely
     * @param {string} key -