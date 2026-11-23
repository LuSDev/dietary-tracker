# Nura — Diario Calórico y Macronutrientes

**Nura** es una Progressive Web App (PWA) *mobile-first* y *local-first* para el seguimiento diario de calorías, distribución de macronutrientes, platos personalizados y progreso histórico.

Diseñada con una estética cálida en crema y verde bosque, funciona 100% en el cliente con respuesta instantánea y persistencia local en el dispositivo.

---

## Características principales

- **Vista diaria (`Hoy`):**
  - Arco calórico de 270° con comparación directa entre calorías **consumidas** y el **objetivo** diario.
  - Barras de progreso de **Proteína**, **Carbos** y **Grasas** con paleta orgánica diferenciada e indicador de exceso.
  - Navegación día a día con flechas y racha de adherencia.
  - Desglose por comida (**Desayuno**, **Almuerzo**, **Merienda**, **Cena**) con edición rápida de cantidades y deshacer al eliminar (`UndoToast`).
- **Registro rápido global:** Botón central `+` en la barra de navegación flotante (`FloatingPillNavbar`) para registrar alimentos o platos desde cualquier pestaña, además de crear alimentos personalizados.
- **Comidas y platos (`Comidas`):** Catálogo base de alimentos y constructor de platos/recetas (`DishBuilderSheet`) con cálculo nutricional automático por porción.
- **Progreso (`Progreso`):** Gráfico de barras calóricas con línea de objetivo, calendario mensual de adherencia e inspección diaria de macronutrientes.
- **Objetivos (`Objetivos`):** Ajuste de calorías diarias, perfiles rápidos de distribución y control fino en gramos para proteína, carbohidratos y grasas.
- **Instalable como PWA:** Configurada con `vite-plugin-pwa` para instalarse en Android / iOS y funcionar sin conexión.

---

## Stack tecnológico

- **Framework:** React 19 + TypeScript
- **Bundler & PWA:** Vite 6 + `vite-plugin-pwa`
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`) + CSS custom properties
- **Estado y persistencia:** Zustand (`persist` en `localStorage`)
- **Animaciones e íconos:** `motion` (`motion/react`) + `lucide-react`

---

## Estructura del proyecto

```text
src/
├── components/        # Vistas principales, sheets modales, navbar y gráficos
├── data/              # Dataset inicial de alimentos y logs semilla (demo)
├── domain/            # Tipos, utilidades de fecha y cálculos nutricionales
├── store/             # Store global de Zustand con persistencia local
├── App.tsx            # Enrutado por pestañas y modales globales
├── index.css          # Tokens de color, tipografía y utilidades mobile-native
└── main.tsx           # Punto de entrada
```

---

## Cómo correrlo en local

### Requisitos
- Node.js 18+ y npm

### Instalación y desarrollo

```bash
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173/`.

### Otros scripts

```bash
npm run build     # Verificación de tipos (tsc -b) + build de producción
npm run preview   # Previsualización local del build generado en dist/
npm run lint      # Análisis estático con ESLint
```

---

## Persistencia de datos

Nura no utiliza backend ni base de datos remota. Todo el estado (objetivos, alimentos personalizados, platos y registros diarios) se almacena localmente en el `localStorage` del navegador bajo la clave `nura-nutrition-storage-v1`.
