# Planeación completa del frontend — Biblioteca (HTML + CSS + Bootstrap 5.3 + JavaScript)

## 1) Objetivo del proyecto
Construir un frontend minimalista de biblioteca con tres vistas principales, preparado para consumir APIs más adelante:

1. **Inicio** (resumen + navegación rápida).
2. **Todos los libros** (listado, filtros, búsqueda y paginación).
3. **Gestión de libros** (crear, editar, dar de baja/alta).

---

## 2) Alcance funcional (MVP)
### Incluye
- UI responsive con Bootstrap 5.3.
- Diseño visual minimalista.
- Datos mock temporales en frontend.
- Paginación local.
- CRUD básico en cliente (sin backend real todavía).
- Estructura lista para integración API futura.

### No incluye (por ahora)
- Autenticación/login.
- Persistencia real en base de datos.
- Roles/permisos.
- Subida de archivos reales (portadas en servidor).

---

## 3) Estructura de páginas
### A. `index.html` (Inicio)
**Objetivo:** dar contexto y acceso rápido.

**Secciones:**
- Navbar con links: Inicio / Libros / Gestión.
- Hero principal:
  - Título fuerte.
  - Mensaje corto.
  - CTA: “Ver catálogo” y “Gestionar libros”.
- KPIs:
  - Total libros.
  - Disponibles.
  - Inactivos (o prestados según lógica final).
- Últimos añadidos:
  - Grid de cards con datos resumidos.
- Footer simple.

**Preparación para API:**
- IDs para inyectar métricas y últimos libros dinámicamente.

---

### B. `books.html` (Todos los libros)
**Objetivo:** explorar catálogo completo de forma eficiente.

**Secciones:**
- Encabezado de página.
- Bloque de filtros:
  - Buscador por título/autor.
  - Categoría.
  - Estado.
  - Orden A-Z / Z-A.
  - Limpiar filtros.
- Tabla/listado responsive:
  - Título, autor, categoría, stock, estado, acción.
- Paginación Bootstrap al final.

**Comportamientos clave:**
- Filtrado combinado.
- Ordenamiento.
- Reset a página 1 al filtrar.
- Empty state cuando no hay resultados.

---

### C. `manage.html` (Gestión)
**Objetivo:** administrar libros desde una vista operativa.

**Secciones:**
- Encabezado de gestión.
- Formulario (crear/editar):
  - título, autor, categoría, ISBN, stock, estado.
- Tabla administrativa:
  - acciones por fila: editar, dar de baja/alta.
- Filtros de búsqueda en gestión.
- Paginación de resultados.
- Modal de confirmación para acciones sensibles (si se activa flujo de confirmación).

**Comportamientos clave:**
- Modo creación y modo edición.
- Validaciones front.
- Actualización inmediata del listado tras operación.

---

## 4) Diseño visual (vibra minimalista)
- Fondo suave claro.
- Tarjetas blancas con borde sutil y sombra ligera.
- Tipografía limpia y jerarquía marcada.
- Espaciado amplio.
- Uso moderado de color (principalmente neutros + color acento).
- Badges para estado (activo/inactivo) con semántica visual clara.

---

## 5) Arquitectura técnica frontend
### Archivos propuestos
- `assets/css/styles.css` → estilo global.
- `assets/js/mock-data.js` → dataset temporal.
- `assets/js/app.js` → utilidades comunes + lógica compartida.
- `assets/js/books.js` → lógica de catálogo.
- `assets/js/manage.js` → lógica de gestión.

### Principios
- Separar renderizado de lógica de datos.
- Estado local por página.
- Funciones pequeñas y reutilizables.
- Evitar dependencias externas de JS (solo vanilla + Bootstrap JS).

---

## 6) Modelo de datos (temporal)
Estructura sugerida de `Book`:
- `id`
- `title`
- `author`
- `category`
- `isbn`
- `stock`
- `status` (`active` / `inactive`)
- `createdAt`

Esto permite simular:
- listados
- filtros
- paginación
- edición
- cambio de estado

---

## 7) Paginación (estrategia)
- Estado base:
  - `currentPage`
  - `pageSize`
- Cálculo:
  - `totalPages = ceil(totalItems/pageSize)`
  - `slice` de items visibles por página.
- UI:
  - anterior / números / siguiente.
  - estado activo y deshabilitado.
- Regla UX:
  - cualquier cambio de filtro retorna a página 1.

---

## 8) Validaciones de formulario (gestión)
- Campos obligatorios: título, autor, categoría, stock.
- `stock >= 0`.
- Sanitización básica de texto (`trim`).
- Mensajes de error/éxito en alerts Bootstrap.
- Modo edición claramente identificado en el título del formulario y botón principal.

---

## 9) Preparación para APIs futuras
Diseñar capa de servicio (aunque primero use mock):

- `getBooks(params)`
- `createBook(payload)`
- `updateBook(id, payload)`
- `toggleBookStatus(id)`

Contrato esperado de listado paginado:
- `items`
- `page`
- `pageSize`
- `totalItems`
- `totalPages`

Así, cuando llegue backend, se reemplaza la fuente de datos sin rehacer UI completa.

---

## 10) Plan de implementación por fases
### Fase 1 — Base visual compartida
- Navbar, footer, estilos globales, estructura responsive.

### Fase 2 — Inicio
- Hero + KPIs + últimos añadidos + enlaces de navegación.

### Fase 3 — Catálogo
- Tabla, filtros, búsqueda, orden, paginación local.

### Fase 4 — Gestión
- Formulario create/edit + tabla admin + acciones por fila.

### Fase 5 — Refactor API-ready
- Aislar capa de datos/servicios.
- Limpiar funciones de render y eventos.

### Fase 6 — QA visual y funcional
- Pruebas manuales de flujos críticos:
  - filtrar + paginar,
  - crear/editar/baja,
  - navegación entre páginas,
  - responsive móvil/desktop.

---

## 11) Criterios de aceptación
- Navegación correcta entre las 3 páginas.
- Interfaz minimalista consistente.
- Paginación funcional en catálogo y gestión.
- Gestión de libros funcional con mocks.
- Código preparado para integración API posterior sin reescritura mayor.

---

## 12) Riesgos y mitigación
- **Riesgo:** lógica duplicada entre páginas.
  **Mitigación:** mover helpers a `app.js`.

- **Riesgo:** paginación inconsistente tras filtros.
  **Mitigación:** reset de `currentPage` en cada cambio de filtro.

- **Riesgo:** transición a API rompa render.
  **Mitigación:** definir desde ya contrato de datos y capa de servicio.
