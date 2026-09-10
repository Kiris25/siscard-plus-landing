# 📋 ANATOMÍA DEL PROGRAMA - SISCARD+ LANDING

## 🎯 DESCRIPCIÓN GENERAL

**Siscard+ Landing** es un portal web de autogestión digital que funciona como **centro de servicios centralizado**. Es una interfaz de usuario empresarial diseñada para que clientes accedan a diversos módulos operacionales en un ecosistema financiero/transaccional (Siscard es una plataforma de procesamiento de pagos de Evertec).

### Stack Tecnológico:
- **Lenguaje Principal:** HTML 5 (93.7%)
- **Estilos:** CSS 3 (3.6%)
- **Interactividad:** JavaScript Vanilla (2.7%)
- **Arquitectura:** Frontend estático con componentes reutilizables
- **Almacenamiento:** JSON local + LocalStorage del navegador

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

### **Páginas Principales (HTML)**

| Archivo | Título | Propósito |
|---------|--------|----------|
| `index.html` | Centro de Servicios Siscard+ | Hub central con acceso a todos los módulos |
| `manuales.html` | Centro Documental | Documentación categorizada por producto |
| `formularios.html` | Gestión de Formularios | Formularios basados en parámetros |
| `formulario-parametros.html` | Parámetros del Emisor TRT08SN0 | Configuración de parámetros del sistema |
| `seguridad.html` | Gestión de Seguridad | Usuarios, grupos, permisos y accesos |
| `aprobaciones.html` | Aprobaciones de Solicitudes | Revisión y aprobación de formularios |
| `mis-solicitudes.html` | Mis Solicitudes | Seguimiento de gestiones y estados |
| `landing-ia.html` | Landing IA | Interfaz de consultas con IA (en desarrollo) |
| `comunicados.html` | Comunicados y Avisos | Novedades y actualizaciones del sistema |

### **Componentes Reutilizables** (`components/`)

```
components/
├── topbar.html       (70 líneas) - Barra superior con búsqueda, notificaciones y perfil
├── sidebar.html      (152 líneas) - Menú lateral con navegación principal
└── footer.html       (229 líneas) - Pie de página
```

### **JavaScript** (`js/`)

| Archivo | Líneas | Función Principal |
|---------|--------|-------------------|
| `layout.js` | 231 | Carga dinámica de componentes, navegación activa |
| `app.js` | 198 | Lógica general: búsqueda, menú, filtros, atajos |
| `parametros-source.js` | 308 | Gestor de parámetros y datos externos |

### **Estilos** (`css/`)

```
css/
└── styles.css (1000+ líneas)
    ├── Sistema de colores con CSS variables
    ├── Grid layout responsivo
    ├── Componentes reutilizables (.card, .panel, .button)
    └── Estilos para tour/onboarding
```

### **Datos** (`data/`)

```
data/
├── configuracion.json          Valores por defecto del sistema
├── solicitudes.json            Datos de solicitudes (145KB)
├── aprobaciones.json           Datos de aprobaciones
├── comunicados.json            Datos de comunicados
├── historial.json              Datos históricos
├── dashboard.json              Datos de dashboard
└── formularios/                Subfolder para datos de formularios
```

### **Recursos** (`assets/`)

```
assets/
├── logo-evertec.png            Logo de Evertec (10.7KB)
└── logo.png                    Logo principal
```

---

## ⚙️ FUNCIONALIDADES DETALLADAS

### **1. BARRA LATERAL (Navegación Principal)**

**Archivo:** `components/sidebar.html` + `css/styles.css` (líneas 124-292)

**Funciones:**
- ✅ Branding con logo y nombre de aplicación
- ✅ Navegación por secciones (Principal, Conocimiento, Gestión)
- ✅ Links a 8 módulos principales
- ✅ Sticky positioning (mantiene visible al scroll)
- ✅ Highlight automático de página activa

**Código que lo dispara:**
```javascript
// js/layout.js - líneas 49-85
setActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#sidebar .nav-link[data-page]").forEach(link => {
    const isActive = link.dataset.page === currentPage;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });
}
```

---

### **2. BARRA SUPERIOR (Topbar)**

**Archivo:** `components/topbar.html` + `css/styles.css` (líneas 298-435)

**Funciones:**
- ✅ Título dinámico de página (actualizado por layout.js)
- ✅ Botón menú móvil (mostrado solo en <760px)
- ✅ Notificaciones (badge con número)
- ✅ Botón Ayuda (placeholder para futura integración)
- ✅ Menú de perfil con opciones de usuario

**Código que lo dispara:**
```javascript
// js/layout.js - líneas 87-116
setPageHeading() {
  const titleElement = document.getElementById("sharedPageTitle");
  const subtitleElement = document.getElementById("sharedPageSubtitle");
  
  if (titleElement && document.body.dataset.pageTitle) {
    titleElement.textContent = document.body.dataset.pageTitle;
  }
  if (subtitleElement && document.body.dataset.pageSubtitle) {
    subtitleElement.textContent = document.body.dataset.pageSubtitle;
  }
}
```

---

### **3. BÚSQUEDA GLOBAL**

**Archivo:** `js/app.js` - líneas 91-128 + `index.html` (formulario)

**Funciones:**
- ✅ Búsqueda en tiempo real por palabras clave
- ✅ Normalización de texto (acentos, mayúsculas)
- ✅ Filtra tarjetas de servicios por `data-search`
- ✅ Scroll automático al primer resultado
- ✅ Feedback visual sobre búsqueda

**Código:**
```javascript
// Disparo: formulario en index.html con id="globalSearch"
// Handler en app.js líneas 123-128
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput.value);
  });
}

// Función principal líneas 91-121
function runSearch(query) {
  const cleanQuery = normaliseText(query);
  serviceCards.forEach(card => card.classList.remove("search-match"));
  
  if (!cleanQuery) {
    searchFeedback.textContent = "Escriba una palabra para realizar la búsqueda.";
    return;
  }
  
  const matches = serviceCards.filter(card => {
    const searchableText = `${card.textContent} ${card.dataset.search || ""}`;
    return normaliseText(searchableText).includes(cleanQuery);
  });
  
  matches.forEach(card => card.classList.add("search-match"));
  matches[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
}
```

---

### **4. MENÚ MÓVIL**

**Archivo:** `js/app.js` - líneas 44-66 + `js/layout.js` - líneas 118-150

**Funciones:**
- ✅ Toggle del sidebar en pantallas <760px
- ✅ Cierre automático al hacer clic en link
- ✅ Soporte para tecla Escape

**Código:**
```javascript
// app.js líneas 53-66
if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

// Cierre al hacer clic en link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      closeMobileMenu();
    }
  });
});
```

---

### **5. MENÚ DE PERFIL**

**Archivo:** `js/app.js` - líneas 68-81

**Funciones:**
- ✅ Toggle de menú de perfil al hacer clic
- ✅ Cierre al hacer clic fuera del menú
- ✅ Cierre con tecla Escape

**Código:**
```javascript
if (profileButton && profileMenu) {
  profileButton.addEventListener("click", () => {
    const willOpen = profileMenu.hidden;
    profileMenu.hidden = !willOpen;
    profileButton.setAttribute("aria-expanded", String(willOpen));
  });

  document.addEventListener("click", (event) => {
    if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
      profileMenu.hidden = true;
      profileButton.setAttribute("aria-expanded", "false");
    }
  });
}
```

---

### **6. NOTIFICACIONES (TOAST)**

**Archivo:** `js/app.js` - líneas 20-34

**Funciones:**
- ✅ Muestra mensaje flotante por 3.2 segundos
- ✅ Auto-oculta al expirar
- ✅ Actualiza accesibilidad con `aria-hidden`

**Código:**
```javascript
function showToast(message) {
  if (!toast) return;
  
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 3200);
}
```

---

### **7. FILTROS DE PAÍS Y PRODUCTO**

**Archivo:** `js/app.js` - líneas 130-158

**Funciones:**
- ✅ Dropdowns para país y producto
- ✅ Persistencia en localStorage
- ✅ Restaura valores al recargar
- ✅ Actualiza contexto en footer

**Código:**
```javascript
function updatePortalContext() {
  const country = countryFilter?.value || "Costa Rica";
  const product = productFilter?.value || "Todos";
  const productText = product === "Todos" ? "Todos los productos" : product;
  
  if (footerContext) {
    footerContext.textContent = `${country} · ${productText}`;
  }
  
  localStorage.setItem("siscardPortalCountry", country);
  localStorage.setItem("siscardPortalProduct", product);
}

// Restaura valores guardados
const savedCountry = localStorage.getItem("siscardPortalCountry");
if (savedCountry && [...countryFilter.options].some(opt => opt.value === savedCountry)) {
  countryFilter.value = savedCountry;
}
```

---

### **8. CARACTERÍSTICAS EN DESARROLLO (Coming Soon)**

**Archivo:** `js/app.js` - líneas 83-89

**Funciones:**
- ✅ Identifica elementos con `[data-coming-soon]`
- ✅ Previene navegación por defecto
- ✅ Muestra notificación toast

**Código:**
```javascript
document.querySelectorAll("[data-coming-soon]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    const moduleName = element.dataset.comingSoon;
    showToast(`${moduleName}: acceso preparado para la siguiente integración.`);
  });
});
```

---

### **9. ASISTENTE IA (Placeholder)**

**Archivo:** `js/app.js` - líneas 160-181 + `index.html` (formulario)

**Funciones:**
- ✅ Recolecta queries del usuario
- ✅ Guarda en localStorage para integración futura
- ✅ Muestra notificación de registro

**Código:**
```javascript
// Botones de sugerencias
document.querySelectorAll(".suggestion-list button").forEach((button) => {
  button.addEventListener("click", () => {
    aiInput.value = button.textContent.trim();
    aiInput.focus();
  });
});

// Envío del formulario
if (aiForm && aiInput) {
  aiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = aiInput.value.trim();
    
    if (!query) {
      showToast("Escriba una consulta para continuar.");
      return;
    }
    
    localStorage.setItem("siscardLastAiQuery", query);
    showToast("Consulta registrada. La integración del asistente se encuentra preparada...");
  });
}
```

---

### **10. ATAJOS DE TECLADO**

**Archivo:** `js/app.js` - líneas 183-196

**Funciones:**
- ✅ `Ctrl+K` / `Cmd+K` → Focus en búsqueda
- ✅ `Escape` → Cierra menú y perfil

**Código:**
```javascript
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    if (profileMenu) profileMenu.hidden = true;
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput?.focus();
  }
});
```

---

### **11. GESTOR DE PARÁMETROS DINÁMICOS**

**Archivo:** `js/parametros-source.js` - Completo

**Funciones:**
- ✅ Carga parámetros desde repositorio GitHub Pages
- ✅ Normaliza estructura de datos heterogénea
- ✅ Construye URLs con parámetros

**Configuración:**
```javascript
const PARAMETROS_CONFIG = {
  visorUrl: "https://kiris25.github.io/parametros-emisor/",
  dataBaseUrl: "https://kiris25.github.io/parametros-emisor/data/externo/",
  cacheVersion: "fase-1"
};
```

**API Expuesta:**
```javascript
window.ParametrosSource = {
  config: PARAMETROS_CONFIG,
  cargarOpcion: obtenerOpcionFormulario,      // Carga parámetros de una opción
  construirUrlFicha: construirUrlFicha        // Construye URL de ficha
};
```

**Ejemplo de uso:**
```javascript
// Cargar parámetros de opción 01
const parametros = await window.ParametrosSource.cargarOpcion(1);

// Construir URL de ficha
const url = window.ParametrosSource.construirUrlFicha(parametro);
```

---

## 🔄 FLUJO DE EJECUCIÓN

```
┌─────────────────────────────────────────────────────┐
│         USUARIO ABRE LA PÁGINA                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │   HTML CARGADO          │
         │   (index.html, etc.)    │
         └────────────┬────────────┘
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
┌──────────────┐ ┌──────────┐ ┌─────────────────┐
│ LAYOUT.JS    │ │ APP.JS   │ │PARAMETROS-SRC.JS│
│ ejecuta:     │ │ejecuta:  │ │ Expone API      │
│              │ │          │ │                 │
│1. Carga      │ │1.Menú    │ │window.Parameter │
│  topbar.html │ │  móvil   │ │osSource         │
│              │ │2.Búsqueda│ │                 │
│2. Carga      │ │3.Filtros │ │(Para uso        │
│  sidebar.html│ │4.Toast   │ │ futuro)         │
│              │ │5.Atajos  │ │                 │
│3. Carga      │ │6.IA form │ │                 │
│  footer.html │ └──────────┘ └─────────────────┘
│              │
│4.Marca nav   │
│  activa      │
│              │
│5.Actualiza   │
│  títulos     │
│              │
│6.Dispara:    │
│  siscard:    │
│  layout-     │
│  ready       │
└──────────────┘

         ▼

    PÁGINA LISTA
    Para interacción
    del usuario
```

---

## 💾 DATOS Y PERSISTENCIA

### **LocalStorage**

```javascript
// Guardar/Recuperar preferencias de usuario
localStorage.setItem("siscardPortalCountry", country);
localStorage.getItem("siscardPortalCountry");

localStorage.setItem("siscardPortalProduct", product);
localStorage.getItem("siscardPortalProduct");

localStorage.setItem("siscardLastAiQuery", query);
localStorage.getItem("siscardLastAiQuery");
```

### **Archivos JSON**

```json
// data/configuracion.json
{
  "defaults": {
    "cliente": "",
    "emisor": "",
    "producto": "Todos",
    "accion": ""
  }
}

// data/solicitudes.json
// Contiene array de solicitudes (~145KB)

// data/aprobaciones.json
// Contiene datos de aprobaciones

// data/comunicados.json
// Contiene avisos y comunicados
```

---

## 🎨 SISTEMA DE DISEÑO

### **Colores Principales**

```css
--orange: #ff6c0c              /* Primario - Acciones */
--orange-dark: #e55d00         /* Hover primario */
--orange-soft: #fff3ea         /* Background suave */

--sidebar: #58595b             /* Gris oscuro */
--sidebar-dark: #4a4b4d        /* Más oscuro */
--sidebar-hover: #6a6b6d       /* Hover */

--ink: #4f4f4f                 /* Texto principal */
--ink-2: #3f3f3f               /* Más oscuro */
--muted: #707070               /* Secundario */

--background: #f2f2f2          /* Fondo página */
--surface: #ffffff             /* Fondo elementos */
--surface-soft: #fafafa        /* Gris muy claro */

--line: #d9d9d9                /* Bordes */
--line-strong: #bcbcbc         /* Bordes oscuros */

--blue: #2457a7                /* Informativo */
--green: #16825b               /* Exitoso */
--gold: #b77800                /* Atención */
--red: #b42318                 /* Erróneo */
--purple: #7655b7              /* Especial */
--teal: #168f83                /* Especial */
```

### **Espaciado**

```css
--radius-small: 4px
--radius: 8px
--radius-large: 12px

--shadow-small: 0 1px 3px rgba(0, 0, 0, 0.08)
--shadow-medium: 0 4px 14px rgba(0, 0, 0, 0.10)

--transition: 0.18s ease
```

---

## 📱 PUNTOS DE QUIEBRE RESPONSIVOS

```css
/* Desktop (1180px+) */
.modules-grid { grid-template-columns: repeat(4, 1fr); }

/* Tablet grande (900px - 1180px) */
@media (max-width: 1180px) {
  .modules-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Tablet (760px - 900px) */
@media (max-width: 900px) {
  .service-hero { grid-template-columns: 1fr; }
  .modules-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Móvil (< 760px) */
@media (max-width: 760px) {
  .menu-button { display: block; }  /* Menú hamburguesa visible */
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
}

/* Móvil pequeño (< 650px) */
@media (max-width: 650px) {
  .modules-grid { grid-template-columns: 1fr; }
}
```

---

## 🔌 PUNTOS DE INTEGRACIÓN FUTURA

1. **Asistente IA** (`landing-ia.html`) - Query almacenada en localStorage, lista para API backend
2. **Notificaciones** (`topbar.html`) - Badge visible, funcionalidad en desarrollo
3. **Centro de Ayuda** (`topbar.html`) - Placeholder con `data-coming-soon`
4. **Parámetros Dinámicos** - API `window.ParametrosSource` lista para usar

---

## 🚀 CÓMO INICIAR

1. Clonar repo: `git clone https://github.com/Kiris25/siscard-plus-landing.git`
2. Abrir `index.html` en navegador (no requiere servidor)
3. Navegación con sidebar o módulos en grid
4. Búsqueda con formulario o Ctrl+K
5. Ver localStorage en DevTools para persistencia

---

## ✅ CHECKLIST DE FUNCIONALIDADES

- ✅ Layout responsivo (mobile-first)
- ✅ Navegación por módulos (9 páginas)
- ✅ Menú sidebar sticky
- ✅ Barra superior dinámica con títulos
- ✅ Búsqueda global con normalización
- ✅ Filtros por país y producto
- ✅ Menú de perfil con opciones
- ✅ Sistema de notificaciones (toast)
- ✅ Atajos de teclado (Ctrl+K, Escape)
- ✅ Componentes reutilizables
- ✅ Datos persistentes (localStorage + JSON)
- ✅ Gestor de parámetros con API externa
- ✅ Accesibilidad (aria-labels, aria-expanded)
- ✅ Tour/Onboarding (UI preparada)

---

**Documento generado:** 10-Sep-2026  
**Versión del repo:** main (a10a24a)  
**Autor:** Análisis automático por GitHub Copilot
