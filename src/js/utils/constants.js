/**
 * Application Constants
 * Constantes centralizadas para toda la aplicación
 */

// Breakpoints para responsive design
export const BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

// Duraciones de animación
export const ANIMATION_DURATION = {
    fast: 150,
    normal: 300,
    slow: 500,
    very_slow: 1000
};

// Configuración de scroll
export const SCROLL_CONFIG = {
    throttleDelay: 16, // 60fps
    headerScrollThreshold: 100,
    parallaxSpeed: 0.5,
    smoothScrollOffset: 80
};

// Configuración de intersection observer
export const INTERSECTION_CONFIG = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Configuración de formularios
export const FORM_CONFIG = {
    debounceDelay: 300,
    validationDelay: 500,
    submitTimeout: 10000
};

// Paletas de colores disponibles
export const COLOR_PALETTES = {
    1: {
        name: 'Azul Elegante',
        primary: '#1e40af',
        secondary: '#f59e0b',
        accent: '#06b6d4',
        success: '#10b981',
        bg: '#0f172a',
        bgSecondary: 'rgba(30, 41, 59, 0.5)',
        hero: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #06b6d4 50%, #f59e0b 100%)',
        glow: 'rgba(30, 64, 175, 0.3)',
        glowHover: 'rgba(30, 64, 175, 0.4)'
    },
    2: {
        name: 'Verde Moderno',
        primary: '#059669',
        secondary: '#0891b2',
        accent: '#7c3aed',
        success: '#10b981',
        bg: '#0c1821',
        bgSecondary: 'rgba(12, 24, 33, 0.5)',
        hero: 'linear-gradient(135deg, #059669 0%, #0891b2 50%, #7c3aed 100%)',
        glow: 'rgba(5, 150, 105, 0.3)',
        glowHover: 'rgba(5, 150, 105, 0.4)'
    },
    3: {
        name: 'Púrpura Elegante',
        primary: '#7c3aed',
        secondary: '#ec4899',
        accent: '#06b6d4',
        success: '#10b981',
        bg: '#1a1625',
        bgSecondary: 'rgba(26, 22, 37, 0.5)',
        hero: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #ec4899 75%, #06b6d4 100%)',
        glow: 'rgba(124, 58, 237, 0.3)',
        glowHover: 'rgba(124, 58, 237, 0.4)'
    },
    4: {
        name: 'Sunset Naranja',
        primary: '#ea580c',
        secondary: '#dc2626',
        accent: '#f59e0b',
        success: '#10b981',
        bg: '#1c1917',
        bgSecondary: 'rgba(28, 25, 23, 0.5)',
        hero: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #f59e0b 100%)',
        glow: 'rgba(234, 88, 12, 0.3)',
        glowHover: 'rgba(234, 88, 12, 0.4)'
    },
    5: {
        name: 'Minimalista Gris',
        primary: '#374151',
        secondary: '#3b82f6',
        accent: '#10b981',
        success: '#10b981',
        bg: '#111827',
        bgSecondary: 'rgba(17, 24, 39, 0.5)',
        hero: 'linear-gradient(135deg, #374151 0%, #3b82f6 50%, #10b981 100%)',
        glow: 'rgba(55, 65, 81, 0.3)',
        glowHover: 'rgba(55, 65, 81, 0.4)'
    }
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
    duration: {
        short: 2000,
        normal: 4000,
        long: 6000
    },
    position: {
        top: 'top',
        bottom: 'bottom',
        center: 'center'
    },
    types: {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    }
};

// Configuración de local storage
export const STORAGE_KEYS = {
    theme: 'portfolioTheme',
    palette: 'portfolioPalette',
    preferences: 'portfolioPreferences',
    visited: 'portfolioVisited'
};

// Configuración de performance
export const PERFORMANCE_CONFIG = {
    lazyLoadOffset: 50,
    intersectionThreshold: 0.1,
    debounceResize: 250,
    throttleScroll: 16
};

// Selectores DOM comunes
export const SELECTORS = {
    header: '.header',
    navbar: '.navbar',
    navLinks: '.navbar__link',
    sections: '.section',
    scrollProgress: '#scrollProgress',
    contactForm: '#contactForm',
    paletteOptions: '.palette-option',
    skillItems: '.skill',
    projectCards: '.project-card'
};

// Clases CSS comunes
export const CSS_CLASSES = {
    active: 'active',
    hidden: 'hidden',
    visible: 'visible',
    scrolled: 'header--scrolled',
    loading: 'loading',
    error: 'error',
    success: 'success',
    disabled: 'disabled'
};

// Eventos personalizados
export const CUSTOM_EVENTS = {
    APP_INITIALIZED: 'app:initialized',
    APP_SCROLL: 'app:scroll',
    APP_RESIZE: 'app:resize',
    APP_VISIBILITY_CHANGE: 'app:visibilityChange',
    THEME_CHANGE: 'app:themeChange',
    FORM_SUBMIT: 'form:submit',
    FORM_SUCCESS: 'form:success',
    FORM_ERROR: 'form:error',
    NAVIGATION_CLICK: 'nav:click',
    PALETTE_CHANGE: 'palette:change'
};

// URLs y endpoints de API (si los tienes)
export const API_ENDPOINTS = {
    contact: '/api/contact',
    analytics: '/api/analytics',
    feedback: '/api/feedback'
};

// Configuración de desarrollo
export const DEV_CONFIG = {
    enableLogging: true,
    enableDebugMode: false,
    mockApiCalls: true,
    showPerformanceMetrics: false
};

// Configuración de producción
export const PROD_CONFIG = {
    enableLogging: false,
    enableDebugMode: false,
    mockApiCalls: false,
    showPerformanceMetrics: false,
    enableAnalytics: true
};

// Regex patterns para validación
export const VALIDATION_PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    url: /^https?:\/\/.+\..+/,
    name: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, ingresa un email válido',
    phone: 'Por favor, ingresa un teléfono válido',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'No puede tener más de {max} caracteres',
    network: 'Error de conexión. Por favor, intenta de nuevo',
    server: 'Error del servidor. Por favor, intenta más tarde',
    generic: 'Ocurrió un error inesperado'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
    formSubmit: '¡Mensaje enviado exitosamente!',
    themeChange: 'Tema cambiado correctamente',
    dataLoaded: 'Datos cargados correctamente'
};

// Configuración de accesibilidad
export const A11Y_CONFIG = {
    focusOutlineColor: '#3b82f6',
    skipLinkText: 'Saltar al contenido principal',
    ariaLabels: {
        menu: 'Menú de navegación',
        social: 'Enlaces de redes sociales',
        theme: 'Selector de tema',
        palette: 'Selector de paleta de colores'
    }
};

// Meta información de la aplicación
export const APP_META = {
    name: 'Portfolio Profesional',
    version: '1.0.0',
    author: 'Tu Nombre',
    description: 'Portfolio profesional de desarrollador Full Stack',
    keywords: ['portfolio', 'developer', 'full-stack', 'javascript', 'react'],
    url: 'https://tu-dominio.com'
};

// Configuración de SEO
export const SEO_CONFIG = {
    titleTemplate: '%s | Portfolio Profesional',
    defaultTitle: 'Tu Nombre - Desarrollador Full Stack',
    description: 'Portfolio profesional de [Tu Nombre], desarrollador Full Stack especializado en aplicaciones web modernas',
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image'
};

// Freeze objects to prevent mutations
Object.freeze(BREAKPOINTS);
Object.freeze(ANIMATION_DURATION);
Object.freeze(SCROLL_CONFIG);
Object.freeze(INTERSECTION_CONFIG);
Object.freeze(FORM_CONFIG);
Object.freeze(COLOR_PALETTES);
Object.freeze(NOTIFICATION_CONFIG);
Object.freeze(STORAGE_KEYS);
Object.freeze(PERFORMANCE_CONFIG);
Object.freeze(SELECTORS);
Object.freeze(CSS_CLASSES);
Object.freeze(CUSTOM_EVENTS);
Object.freeze(API_ENDPOINTS);
Object.freeze(VALIDATION_PATTERNS);
Object.freeze(ERROR_MESSAGES);
Object.freeze(SUCCESS_MESSAGES);
Object.freeze(A11Y_CONFIG);
Object.freeze(APP_META);
Object.freeze(SEO_CONFIG);