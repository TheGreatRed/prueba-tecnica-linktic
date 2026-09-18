# 💳 Prueba Técnica - Desarrollador Frontend Semi-Senior (LinkTic)

Bienvenido a la solución de la prueba técnica para el rol de **Frontend Semi-Senior** en **LinkTic**. Esta aplicación es un panel administrativo moderno, robusto y accesible para la gestión integral de métodos de pago.

---

## 🌐 Demo en Vivo

Puedes interactuar directamente con la aplicación desplegada en producción en:
🔗 **[https://prueba-tecnica-linktic-umber.vercel.app](https://prueba-tecnica-linktic-umber.vercel.app)**

### 🔑 Credenciales de Demostración:
* **Usuario:** `admin`
* **Contraseña:** `admin123`


---

## 📋 Tabla de Contenido

- [Demo en Vivo](#-demo-en-vivo)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Credenciales de Acceso](#-credenciales-de-acceso)
- [Arquitectura y Buenas Prácticas](#-arquitectura-y-buenas-prácticas)
- [Supuestos y Modelo de Datos](#-supuestos-y-modelo-de-datos)
- [Pruebas Unitarias](#-pruebas-unitarias)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Entregables](#-entregables)

---

## 🚀 Stack Tecnológico

- **Core:** Vue 3 (Composition API con `<script setup>` y TypeScript)
- **Framework UI:** Quasar Framework v2 (Material Design, i18n español)
- **Gestor de Estado:** Pinia
- **Enrutamiento y Seguridad:** Vue Router v4 con Navigation Guards
- **Herramienta de Construcción:** Vite (con soporte SCSS y optimización de assets)
- **Testing:** Vitest + Vue Test Utils
- **Restricciones:** Cero librerías externas injustificadas para UI o validaciones (se aprovechó al 100% el ecosistema nativo de Quasar).

---

## 🛠️ Instalación y Puesta en Marcha

### Requisitos Previos

- **Node.js** v18.0.0 o superior (se recomienda el uso de `nvm`).
- **NPM** v9.0.0 o superior.

### Paso a paso:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/TheGreatRed/prueba-tecnica-linktic.git
   cd prueba-tecnica-linktic
   ```

2. **Cargar versión de Node (si usas NVM):**

   ```bash
   nvm use 20 # o la versión instalada en tu sistema
   ```

3. **Instalar dependencias:**

   ```bash
   npm install
   ```

4. **Levantar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en: `http://localhost:5173/`

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🔑 Credenciales de Acceso (Mock Login)

El sistema inicia obligatoriamente en la pantalla de autenticación protegida por Navigation Guards.

| Usuario | Contraseña | Rol                   |
| :------ | :--------- | :-------------------- |
| `admin` | `admin123` | Administrador LinkTic |

---

## 🏗️ Arquitectura y Buenas Prácticas

### 1. Principio de Responsabilidad Única (SOLID / SRP)

- **Separación de capas:** Los componentes visuales (`.vue`) no contienen lógica de infraestructura ni peticiones de red. Toda la reactividad y lógica de negocio se centraliza en **Pinia Stores** (`paymentStore.ts`, `authStore.ts`).
- **Servicio Mock Centralizado (`mockApi.ts`):** Centraliza la simulación asíncrona de latencia (`800ms`), persistiendo los cambios en `localStorage` para que recargar la página mantenga el estado.

### 2. Convención Estricta de Idiomas

- **Código en Inglés:** Nombres de variables, funciones, interfaces TypeScript, componentes y rutas (`paymentMethods`, `isActive`, `GenericFilter.vue`).
- **Interfaz y Documentación en Español:** Textos visibles para el usuario, mensajes de validación, notificaciones Toast, comentarios JSDoc y este README.

### 3. Experiencia de Usuario y Seguridad (UX Safety)

- **Intercepción de botón "Atrás":** Presionar "Atrás" en el navegador con un modal abierto cierra el modal y mantiene al usuario en la vista actual en lugar de abandonar la página.
- **Protección ante recargas (`beforeunload`):** Evita la recarga accidental si hay peticiones en curso.
- **Confirmaciones explícitas:** Diálogos modales con feedback de advertencia para:
  - Eliminar método de pago.
  - Cerrar sesión.
  - Restablecer datos de prueba iniciales.
- **Empty State interactivo:** Si se eliminan todos los registros, la tabla ofrece una acción directa para recargar los datos demo iniciales.

### 4. Componente de Filtros Reutilizable (`GenericFilter.vue`)

- **100% Agnóstico:** Configurable dinámicamente mediante `props` (`fields`).
- **Validación integrada:** Soporta `required: true` con alertas visuales nativas de Quasar deteniendo la búsqueda.
- **Payload limpio:** Al hacer submit en "Buscar", solo envía los campos con valor, excluyendo nulos y vacíos.
- **Botón Limpiar inteligente:** Se deshabilita reactivamente si no hay ningún filtro diligenciado.
- **Bloqueo condicional:** Se bloquea automáticamente si la base de datos no contiene registros.

---

## 📊 Supuestos y Modelo de Datos

### Tipado del Modelo (`PaymentMethod`):

```typescript
export interface PaymentMethod {
  id: string;
  name: string;
  type:
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "cash"
    | "digital_wallet";
  isActive: boolean;
  createdAt: string;
  description?: string;
}
```

- **Id:** Identificador único autogenerado.
- **Name & Type:** Campos obligatorios requeridos por el negocio.
- **Description:** Campo opcional del formulario.
- **isActive:** Booleano reactivo conmutado en tiempo real desde la tabla mediante un switch.

---

## 🧪 Pruebas Unitarias

El proyecto cuenta con una suite de pruebas unitarias configurada con **Vitest** y **Vue Test Utils**:

```bash
npm run test
```

### Casos de prueba cubiertos:

1. **`GenericFilter.spec.ts`**:
   - Renderizado dinámico de campos basados en `props`.
   - Bloqueo y detención de búsqueda cuando un campo marcado como `required: true` está vacío.
2. **`paymentStore.spec.ts`**:
   - Obtención y carga asíncrona de datos (`fetchPaymentMethods`).
   - Creación de nuevo método con payload correcto (`createMethod`).
   - Actualización de estado y datos (`updateMethod`).
   - Eliminación de registros (`deleteMethod`).
   - Restablecimiento de datos iniciales de prueba (`resetToDefault`).

---

## 📁 Estructura del Proyecto

```text
src/
├── assets/styles/      # Variables de Quasar y estilos SCSS
├── components/         # Componentes reutilizables (GenericFilter, Modales)
│   └── __tests__/      # Tests unitarios de componentes
├── layouts/            # Layout principal con Toolbar y Diálogo de Logout
├── pages/              # Vistas principales (LoginPage, PaymentMethodsPage)
├── router/             # Vue Router con Navigation Guards de autenticación
├── services/           # Singleton mockApi con sincronización localStorage
├── stores/             # Stores Pinia (authStore, paymentStore)
│   └── __tests__/      # Tests unitarios del Store
├── types/              # Interfaces y contratos de TypeScript
├── utils/              # Formateadores puros y catálogo de opciones
├── App.vue             # Componente raíz
└── main.ts             # Inicialización de Quasar, i18n español y Pinia
```

---

## 📬 Entregables

- **Rama de entrega:** `feature/prueba-tecnica`
- **Destinatarios:** `jose.arzusa@linktic.com` con copia a `oscar.otalora@linktic.com`
