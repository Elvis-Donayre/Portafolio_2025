# 🚀 Portfolio Profesional

Un portfolio moderno y responsivo desarrollado con HTML5, CSS3 y JavaScript vanilla, diseñado siguiendo las mejores prácticas de desarrollo web.

## ✨ Características

- 🎨 **5 Paletas de Colores** intercambiables en tiempo real
- 📱 **Diseño Completamente Responsivo** - Mobile First
- ⚡ **Performance Optimizado** - Puntuación 95+ en Lighthouse
- ♿ **Accesibilidad WCAG** - Navegación por teclado y screen readers
- 🌙 **Modo Oscuro** con detección automática de preferencias
- 🎭 **Animaciones Suaves** con respeto a prefer-reduced-motion
- 🔧 **Arquitectura Modular** - Código escalable y mantenible
- 📊 **SEO Optimizado** - Meta tags y structured data

## 🎨 Paletas de Colores Disponibles

1. **Azul Elegante** - Profesional y confiable
2. **Verde Moderno** - Fresco y tecnológico  
3. **Púrpura Elegante** - Creativo y sofisticado
4. **Sunset Naranja** - Energético y llamativo
5. **Minimalista Gris** - Sobrio y profesional ⭐ (Recomendado)

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Variables, Grid, Flexbox, Animations
- **JavaScript ES6+** - Módulos, Classes, Async/Await
- **Intersection Observer API** - Animaciones performantes
- **CSS Custom Properties** - Sistema de diseño escalable

## 📁 Estructura del Proyecto

```
portfolio/
├── 📁 src/
│   ├── 📁 css/
│   │   ├── 📄 reset.css          # CSS Reset moderno
│   │   ├── 📄 variables.css      # Variables del sistema de diseño
│   │   ├── 📄 components.css     # Componentes reutilizables
│   │   ├── 📄 layout.css         # Layout y secciones principales
│   │   ├── 📄 utilities.css      # Clases de utilidad
│   │   └── 📄 responsive.css     # Media queries y responsive
│   ├── 📁 js/
│   │   ├── 📄 main.js            # Entry point principal
│   │   ├── 📁 components/
│   │   │   ├── 📄 navigation.js  # Navegación y menú
│   │   │   ├── 📄 scroll.js      # Manejo de scroll
│   │   │   ├── 📄 animations.js  # Sistema de animaciones
│   │   │   ├── 📄 form.js        # Validación de formularios
│   │   │   └── 📄 palette.js     # Selector de paletas
│   │   └── 📁 utils/
│   │       ├── 📄 helpers.js     # Funciones de utilidad
│   │       └── 📄 constants.js   # Constantes de la aplicación
│   └── 📁 assets/
│       ├── 📁 images/            # Imágenes optimizadas
│       ├── 📁 icons/             # Iconos SVG
│       └── 📁 fonts/             # Fuentes web
├── 📄 index.html                 # Página principal
├── 📄 package.json               # Dependencias y scripts
├── 📄 .gitignore                 # Archivos ignorados por Git
└── 📄 README.md                  # Documentación
```

## 🚀 Inicio Rápido

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/portfolio-profesional.git
   cd portfolio-profesional
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en** `http://localhost:3000`

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con live reload

# Build
npm run build        # Minifica CSS y JS para producción
npm run minify:css   # Minifica solo CSS
npm run minify:js    # Minifica solo JavaScript

# Calidad de Código
npm run lint         # Linter para JavaScript
npm run format       # Formatter con Prettier

# Deployment
npm run deploy       # Deploy a GitHub Pages
```

## 🎯 Personalización

### Cambiar Información Personal

Edita los siguientes archivos para personalizar con tu información:

1. **index.html** - Actualiza meta tags, títulos y contenido
2. **src/js/utils/constants.js** - Cambia constantes como nombre, email, etc.
3. **package.json** - Actualiza información del proyecto

### Agregar Nuevos Proyectos

```html
<article class="project-card">
  <div class="project-card__image">
    <i class="fas fa-icon-name"></i>
  </div>
  <div class="project-card__content">
    <h3 class="project-card__title">Nombre del Proyecto</h3>
    <p class="project-card__description">Descripción breve del proyecto...</p>
    <div class="project-card__tags">
      <span class="tag">React</span>
      <span class="tag">Node.js</span>
    </div>
    <div class="project-card__links">
      <a href="#" class="project-card__link">
        <i class="fas fa-external-link-alt"></i> Demo
      </a>
      <a href="#" class="project-card__link">
        <i class="fab fa-github"></i> GitHub
      </a>
    </div>
  </div>
</article>
```

### Crear Nueva Paleta de Colores

1. **Agrega la paleta en** `src/js/utils/constants.js`:

```javascript
6: {
  name: 'Tu Paleta Custom',
  primary: '#tu-color-primario',
  secondary: '#tu-color-secundario',
  // ... más colores
}
```

2. **Agrega el botón en el HTML**:

```html
<button class="palette-option palette-option--6" data-palette="6"></button>
```

3. **Agrega los estilos CSS**:

```css
.palette-option--6::before { 
  background: linear-gradient(135deg, #color1, #color2); 
}
```

## 🎨 Sistema de Diseño

### Variables CSS Principales

```css
/* Colores */
--color-primary: #374151;
--color-secondary: #3b82f6;
--color-accent: #10b981;

/* Tipografía */
--font-size-base: 1rem;
--font-weight-normal: 400;
--line-height-normal: 1.5;

/* Espaciado */
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;

/* Transiciones */
--transition-normal: 0.3s ease;
```

### Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Tablets pequeñas */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
```

## 📊 Performance

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Lighthouse Score**: 95+

### Optimizaciones Implementadas

- ✅ Lazy loading de imágenes
- ✅ Preload de recursos críticos  
- ✅ Minificación de CSS/JS
- ✅ Compresión de imágenes
- ✅ Service Worker para caché
- ✅ Critical CSS inlined
- ✅ Font-display: swap

## ♿ Accesibilidad

### Características de Accesibilidad

- **Navegación por teclado** completa
- **Screen reader support** con ARIA labels
- **Contraste de colores** WCAG AA
- **Texto escalable** sin pérdida de funcionalidad
- **Focus indicators** visibles
- **Reduced motion** respetado

### Testing de Accesibilidad

```bash
# Instala axe-core para testing
npm install -D @axe-core/cli

# Run accessibility tests
npx axe-core http://localhost:3000
```

## 🌐 SEO

### Meta Tags Incluidos

```html
<!-- Básicos -->
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
```

## 📱 PWA (Progressive Web App)

Para convertir en PWA, agrega:

1. **Web App Manifest** (`manifest.json`)
2. **Service Worker** (`sw.js`)
3. **Meta tags de PWA**

```json
{
  "name": "Portfolio Profesional",
  "short_name": "Portfolio",
  "theme_color": "#374151",
  "background_color": "#111827",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

## 🔧 Desarrollo

### Configuración del Editor

**VSCode Settings** recomendadas:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Extensiones Recomendadas

- ES6 String HTML
- Live Server
- Prettier
- ESLint
- Auto Rename Tag

## 🚀 Deployment

### GitHub Pages

```bash
npm run deploy
```

### Netlify

1. Conecta tu repositorio de GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- Website: [tu-website.com](https://tu-website.com)
- LinkedIn: [tu-linkedin](https://linkedin.com/in/tu-perfil)
- GitHub: [tu-github](https://github.com/tu-usuario)
- Email: tu.email@ejemplo.com

## 🙏 Agradecimientos

- [Inter Font](https://rsms.me/inter/) - Tipografía principal
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Animate.css](https://animate.style/) - Inspiración para animaciones
- [Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/) - CSS Reset

---

⭐ ¡Dale una estrella al proyecto si te ha sido útil!

📖 Para más información, consulta la [documentación completa](./docs/)