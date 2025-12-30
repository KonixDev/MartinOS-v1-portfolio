# 🖥️ Windows 11 Web Clone - Plan de Desarrollo

## 📋 Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | MartinOS / Windows 11 Web Clone |
| **Framework** | Next.js 16.x (última versión estable) |
| **Node.js** | 20.x+ (LTS) |
| **React** | 19.x |
| **Tipo de Deploy** | Static Export (sin backend) |
| **Persistencia** | localStorage / IndexedDB |
| **Hosting** | GitHub Pages / Cloudflare Pages / Netlify (gratis) |

---

## 🔧 Requisitos Técnicos

### Versiones Específicas (Diciembre 2025)

```json
{
  "engines": {
    "node": ">=20.9.0"
  },
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Configuración para Static Export

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true  // Obligatorio para static export
  },
  trailingSlash: true,  // Mejor compatibilidad con hosting estático
  // distDir: 'dist'    // Opcional: cambiar directorio de salida
}

export default nextConfig
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
windows11-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página única (SPA)
│   │   └── globals.css           # Estilos globales
│   │
│   ├── components/
│   │   ├── desktop/
│   │   │   ├── Desktop.tsx       # Contenedor principal del escritorio
│   │   │   ├── DesktopIcon.tsx   # Icono individual draggable
│   │   │   ├── DesktopGrid.tsx   # Grid de iconos
│   │   │   └── Wallpaper.tsx     # Fondo de pantalla
│   │   │
│   │   ├── window/
│   │   │   ├── Window.tsx        # Ventana principal (drag + resize)
│   │   │   ├── WindowTitleBar.tsx    # Barra de título
│   │   │   ├── WindowControls.tsx    # Botones min/max/close
│   │   │   ├── WindowContent.tsx     # Contenido de la ventana
│   │   │   └── WindowManager.tsx     # Orquestador de ventanas
│   │   │
│   │   ├── taskbar/
│   │   │   ├── Taskbar.tsx           # Barra de tareas completa
│   │   │   ├── StartButton.tsx       # Botón de inicio
│   │   │   ├── TaskbarApps.tsx       # Apps en la taskbar
│   │   │   ├── TaskbarItem.tsx       # Item individual
│   │   │   ├── SystemTray.tsx        # Bandeja del sistema
│   │   │   ├── Clock.tsx             # Reloj
│   │   │   └── QuickSettings.tsx     # Panel de configuración rápida
│   │   │
│   │   ├── start-menu/
│   │   │   ├── StartMenu.tsx         # Menú de inicio completo
│   │   │   ├── PinnedApps.tsx        # Apps ancladas
│   │   │   ├── RecommendedSection.tsx # Sección recomendados
│   │   │   ├── SearchBar.tsx         # Barra de búsqueda
│   │   │   └── PowerMenu.tsx         # Menú de apagado
│   │   │
│   │   ├── context-menu/
│   │   │   ├── ContextMenu.tsx       # Menú contextual
│   │   │   ├── MenuItem.tsx          # Item del menú
│   │   │   └── menus/                # Configuraciones de menús
│   │   │       ├── desktopMenu.ts
│   │   │       ├── fileMenu.ts
│   │   │       └── folderMenu.ts
│   │   │
│   │   └── ui/                       # Componentes reutilizables
│   │       ├── Icon.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── apps/                         # Aplicaciones del OS
│   │   ├── file-explorer/
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── AddressBar.tsx
│   │   │   │   ├── FileList.tsx
│   │   │   │   └── FileItem.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── notepad/
│   │   │   ├── Notepad.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── Settings.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Personalization.tsx
│   │   │   │   ├── System.tsx
│   │   │   │   └── About.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── browser/
│   │   │   ├── Browser.tsx
│   │   │   ├── components/
│   │   │   │   ├── AddressBar.tsx
│   │   │   │   └── Tabs.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── terminal/
│   │   │   ├── Terminal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── image-viewer/
│   │       ├── ImageViewer.tsx
│   │       └── index.ts
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── windowStore.ts            # Estado de ventanas
│   │   ├── desktopStore.ts           # Estado del escritorio
│   │   ├── fileSystemStore.ts        # Sistema de archivos virtual
│   │   └── settingsStore.ts          # Configuración del usuario
│   │
│   ├── hooks/
│   │   ├── useWindow.ts              # Hook para ventanas
│   │   ├── useContextMenu.ts         # Hook para menú contextual
│   │   ├── useFileSystem.ts          # Hook para filesystem
│   │   ├── useKeyboardShortcuts.ts   # Atajos de teclado
│   │   └── useLocalStorage.ts        # Persistencia
│   │
│   ├── lib/
│   │   ├── filesystem/
│   │   │   ├── index.ts
│   │   │   ├── operations.ts
│   │   │   └── defaultFiles.ts       # Archivos iniciales
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                 # clsx + tailwind-merge
│   │       └── date.ts               # Formateo de fechas
│   │
│   ├── types/
│   │   ├── window.ts
│   │   ├── file.ts
│   │   ├── app.ts
│   │   └── settings.ts
│   │
│   └── constants/
│       ├── apps.ts                   # Registry de apps
│       ├── icons.ts                  # Paths de iconos
│       └── defaultSettings.ts        # Configuración por defecto
│
├── public/
│   ├── icons/                        # Iconos del sistema
│   │   ├── apps/
│   │   ├── files/
│   │   └── system/
│   ├── wallpapers/                   # Fondos de pantalla
│   └── sounds/                       # Sonidos (opcional)
│
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 📦 Dependencias

### package.json

```json
{
  "name": "windows11-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build"
  },
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    
    "zustand": "^5.0.0",
    "react-rnd": "^10.4.0",
    "framer-motion": "^11.15.0",
    "react-contexify": "^6.0.0",
    "dexie": "^4.0.0",
    "dexie-react-hooks": "^1.1.0",
    
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    
    "lucide-react": "^0.460.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

---

## ✅ Desglose de Tareas

### Fase 0: Setup del Proyecto (Día 1)

#### 0.1 Inicialización
- [ ] Crear proyecto Next.js 16 con TypeScript
  ```bash
  npx create-next-app@latest windows11-web --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Configurar `next.config.js` para static export
- [ ] Instalar dependencias principales
- [ ] Configurar Tailwind con tema personalizado
- [ ] Crear estructura de carpetas
- [ ] Configurar ESLint y Prettier
- [ ] Inicializar repositorio Git

#### 0.2 Configuración de Tailwind
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'win-bg': '#f3f3f3',
        'win-surface': '#ffffff',
        'win-accent': '#0078d4',
        'win-text': '#1a1a1a',
        'win-border': '#e5e5e5',
        'win-dark-bg': '#202020',
        'win-dark-surface': '#2d2d2d',
        'win-dark-text': '#ffffff',
        'win-dark-border': '#3d3d3d',
      },
      backdropBlur: {
        'acrylic': '20px',
        'mica': '60px',
      },
      boxShadow: {
        'window': '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08)',
        'window-active': '0 4px 8px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'window-open': 'windowOpen 0.15s ease-out',
        'window-close': 'windowClose 0.12s ease-in',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        windowOpen: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        windowClose: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

### Fase 1: Window Manager (Días 2-4)

#### 1.1 Types y Interfaces
- [ ] Crear `types/window.ts`
```typescript
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
}

export interface WindowActions {
  openWindow: (appId: string, props?: Record<string, any>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
}
```

#### 1.2 Zustand Store para Windows
- [ ] Crear `stores/windowStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WindowState, WindowActions } from '@/types/window';
import { APP_REGISTRY } from '@/constants/apps';

interface WindowStore extends WindowActions {
  windows: WindowState[];
  activeWindowId: string | null;
  zIndexCounter: number;
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,
      zIndexCounter: 100,

      openWindow: (appId, props) => {
        const app = APP_REGISTRY[appId];
        if (!app) return '';

        const id = `${appId}-${Date.now()}`;
        const zIndex = get().zIndexCounter;
        
        // Calcular posición centrada con offset aleatorio
        const offsetX = Math.random() * 100 - 50;
        const offsetY = Math.random() * 100 - 50;
        
        const newWindow: WindowState = {
          id,
          appId,
          title: app.name,
          icon: app.icon,
          position: {
            x: (window.innerWidth - app.defaultSize.width) / 2 + offsetX,
            y: (window.innerHeight - app.defaultSize.height) / 2 + offsetY,
          },
          size: app.defaultSize,
          minSize: app.minSize,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          zIndex,
        };

        set((state) => ({
          windows: [...state.windows.map(w => ({ ...w, isFocused: false })), newWindow],
          activeWindowId: id,
          zIndexCounter: state.zIndexCounter + 1,
        }));

        return id;
      },

      closeWindow: (id) => {
        set((state) => {
          const remaining = state.windows.filter((w) => w.id !== id);
          const newActive = remaining.length > 0 
            ? remaining.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id 
            : null;
          
          return {
            windows: remaining,
            activeWindowId: newActive,
          };
        });
      },

      minimizeWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
          ),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }));
      },

      maximizeWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  isMaximized: true,
                  prevPosition: w.position,
                  prevSize: w.size,
                  position: { x: 0, y: 0 },
                  size: { 
                    width: window.innerWidth, 
                    height: window.innerHeight - 48 // Altura de taskbar
                  },
                }
              : w
          ),
        }));
      },

      restoreWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            
            if (w.isMinimized) {
              return { ...w, isMinimized: false, isFocused: true };
            }
            
            if (w.isMaximized && w.prevPosition && w.prevSize) {
              return {
                ...w,
                isMaximized: false,
                position: w.prevPosition,
                size: w.prevSize,
              };
            }
            
            return w;
          }),
          activeWindowId: id,
          zIndexCounter: state.zIndexCounter + 1,
        }));
      },

      focusWindow: (id) => {
        const zIndex = get().zIndexCounter;
        set((state) => ({
          windows: state.windows.map((w) => ({
            ...w,
            isFocused: w.id === id,
            zIndex: w.id === id ? zIndex : w.zIndex,
          })),
          activeWindowId: id,
          zIndexCounter: state.zIndexCounter + 1,
        }));
      },

      updatePosition: (id, position) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        }));
      },

      updateSize: (id, size) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        }));
      },
    }),
    {
      name: 'window-storage',
      partialize: (state) => ({ 
        // Solo persistir configuración, no ventanas abiertas
      }),
    }
  )
);
```

#### 1.3 Componente Window
- [ ] Crear `components/window/Window.tsx`
- [ ] Implementar drag con react-rnd
- [ ] Implementar resize con react-rnd
- [ ] Añadir animaciones con Framer Motion
- [ ] Implementar snap to edges (Aero Snap)

#### 1.4 Window Title Bar
- [ ] Crear `components/window/WindowTitleBar.tsx`
- [ ] Implementar drag handle
- [ ] Double-click para maximizar

#### 1.5 Window Controls
- [ ] Crear `components/window/WindowControls.tsx`
- [ ] Botón minimize
- [ ] Botón maximize/restore
- [ ] Botón close
- [ ] Estilos hover (colores Windows 11)

#### 1.6 Window Manager
- [ ] Crear `components/window/WindowManager.tsx`
- [ ] Renderizar todas las ventanas activas
- [ ] Manejar z-index ordering

---

### Fase 2: Desktop y Taskbar (Días 5-7)

#### 2.1 Desktop
- [ ] Crear `components/desktop/Desktop.tsx`
- [ ] Implementar wallpaper
- [ ] Grid de iconos
- [ ] Selección de iconos
- [ ] Context menu del desktop

#### 2.2 Desktop Icons
- [ ] Crear `components/desktop/DesktopIcon.tsx`
- [ ] Double-click para abrir
- [ ] Drag & drop para reorganizar
- [ ] Selección visual
- [ ] Persistencia de posiciones en localStorage

#### 2.3 Taskbar
- [ ] Crear `components/taskbar/Taskbar.tsx`
- [ ] Layout centrado (estilo Windows 11)
- [ ] Efecto acrylic/blur

#### 2.4 Start Button
- [ ] Crear `components/taskbar/StartButton.tsx`
- [ ] Toggle Start Menu
- [ ] Icono de Windows

#### 2.5 Taskbar Apps
- [ ] Crear `components/taskbar/TaskbarApps.tsx`
- [ ] Mostrar apps pinneadas
- [ ] Mostrar ventanas abiertas
- [ ] Indicador de ventana activa
- [ ] Click para focus/restore

#### 2.6 System Tray
- [ ] Crear `components/taskbar/SystemTray.tsx`
- [ ] Iconos del sistema (wifi, sonido, batería)
- [ ] Click para Quick Settings

#### 2.7 Clock
- [ ] Crear `components/taskbar/Clock.tsx`
- [ ] Hora actualizada cada minuto
- [ ] Fecha formateada
- [ ] Click para calendario (opcional)

---

### Fase 3: Start Menu y Context Menu (Días 8-10)

#### 3.1 Start Menu
- [ ] Crear `components/start-menu/StartMenu.tsx`
- [ ] Animación de apertura/cierre
- [ ] Layout de Windows 11 (pinned + recommended)
- [ ] Efecto acrylic

#### 3.2 Search Bar
- [ ] Crear `components/start-menu/SearchBar.tsx`
- [ ] Input funcional
- [ ] Filtrar apps por nombre

#### 3.3 Pinned Apps
- [ ] Crear `components/start-menu/PinnedApps.tsx`
- [ ] Grid de apps pinneadas
- [ ] Click para abrir app

#### 3.4 Power Menu
- [ ] Crear `components/start-menu/PowerMenu.tsx`
- [ ] Sleep / Shutdown / Restart (solo visual)

#### 3.5 Context Menu
- [ ] Instalar y configurar react-contexify
- [ ] Crear menú del desktop
- [ ] Crear menú de archivos
- [ ] Crear menú de carpetas
- [ ] Estilos Windows 11 (acrylic, rounded)

---

### Fase 4: Sistema de Archivos Virtual (Días 11-14)

#### 4.1 Dexie Database Setup
- [ ] Crear `lib/filesystem/index.ts`
```typescript
import Dexie, { Table } from 'dexie';

export interface FileSystemItem {
  id?: number;
  name: string;
  path: string;
  parentPath: string;
  type: 'file' | 'folder';
  mimeType?: string;
  content?: string;       // Para archivos de texto
  blobId?: string;        // Para archivos binarios
  icon?: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

export class FileSystemDB extends Dexie {
  items!: Table<FileSystemItem>;

  constructor() {
    super('WindowsFileSystem');
    this.version(1).stores({
      items: '++id, path, parentPath, type, name',
    });
  }
}

export const db = new FileSystemDB();
```

#### 4.2 Operaciones del FileSystem
- [ ] Crear `lib/filesystem/operations.ts`
- [ ] `createFolder(path, name)`
- [ ] `createFile(path, name, content)`
- [ ] `deleteItem(path)`
- [ ] `renameItem(path, newName)`
- [ ] `moveItem(fromPath, toPath)`
- [ ] `copyItem(fromPath, toPath)`
- [ ] `getChildren(path)`
- [ ] `getItem(path)`

#### 4.3 Archivos por Defecto
- [ ] Crear `lib/filesystem/defaultFiles.ts`
- [ ] Estructura inicial: Desktop, Documents, Downloads, Pictures
- [ ] Archivos de ejemplo

#### 4.4 Zustand Store para FileSystem
- [ ] Crear `stores/fileSystemStore.ts`
- [ ] Current path
- [ ] Selected items
- [ ] Clipboard (copy/cut)
- [ ] History (back/forward)

---

### Fase 5: Apps Core (Días 15-18)

#### 5.1 File Explorer
- [ ] Crear estructura en `apps/file-explorer/`
- [ ] Sidebar con Quick Access
- [ ] Address bar funcional
- [ ] Lista de archivos/carpetas
- [ ] Double-click para abrir
- [ ] Navegación back/forward
- [ ] Crear nueva carpeta
- [ ] Renombrar archivos

#### 5.2 Notepad
- [ ] Crear `apps/notepad/Notepad.tsx`
- [ ] Textarea para edición
- [ ] Guardar archivo (en filesystem virtual)
- [ ] Abrir archivo
- [ ] Nombre del archivo en título

#### 5.3 Settings
- [ ] Crear estructura en `apps/settings/`
- [ ] Página: Personalization (wallpaper, theme)
- [ ] Página: System (about)
- [ ] Sidebar de navegación
- [ ] Persistir configuración en localStorage

#### 5.4 Calculator
- [ ] Crear `apps/calculator/Calculator.tsx`
- [ ] Calculadora básica funcional
- [ ] Diseño Windows 11

#### 5.5 Terminal
- [ ] Crear `apps/terminal/Terminal.tsx`
- [ ] Comandos básicos: `dir`, `cd`, `cls`, `echo`
- [ ] Output formateado
- [ ] Historial de comandos

---

### Fase 6: Browser y Polish (Días 19-21)

#### 6.1 Browser
- [ ] Crear estructura en `apps/browser/`
- [ ] Address bar
- [ ] iframe sandboxed
- [ ] Tabs (básico)
- [ ] Navegación básica

#### 6.2 Image Viewer
- [ ] Crear `apps/image-viewer/ImageViewer.tsx`
- [ ] Mostrar imagen
- [ ] Zoom básico

#### 6.3 Keyboard Shortcuts
- [ ] Crear `hooks/useKeyboardShortcuts.ts`
- [ ] Alt+F4: Cerrar ventana activa
- [ ] Win+D: Mostrar desktop (minimizar todo)
- [ ] Win: Toggle Start Menu
- [ ] Alt+Tab: Cambiar ventana (simplificado)

#### 6.4 Polish Visual
- [ ] Revisar todos los efectos acrylic
- [ ] Ajustar animaciones
- [ ] Revisar responsive (mínimo tablets)
- [ ] Dark mode completo
- [ ] Favicon y meta tags

---

### Fase 7: Testing y Deploy (Días 22-24)

#### 7.1 Testing Manual
- [ ] Probar todas las apps
- [ ] Probar todos los shortcuts
- [ ] Probar persistencia (localStorage)
- [ ] Probar en diferentes navegadores

#### 7.2 Performance
- [ ] Revisar bundle size
- [ ] Lazy loading de apps
- [ ] Optimizar re-renders

#### 7.3 Deploy
- [ ] Configurar GitHub Actions para build
- [ ] Deploy a GitHub Pages
- [ ] Verificar funcionamiento en producción

#### 7.4 README
- [ ] Screenshots/GIFs
- [ ] Instrucciones de uso
- [ ] Stack técnico
- [ ] Architecture Decision Records (ADRs)

---

## 🗂️ Registry de Aplicaciones

```typescript
// src/constants/apps.ts
import { FileExplorer } from '@/apps/file-explorer';
import { Notepad } from '@/apps/notepad';
import { Settings } from '@/apps/settings';
import { Browser } from '@/apps/browser';
import { Terminal } from '@/apps/terminal';
import { Calculator } from '@/apps/calculator';
import { ImageViewer } from '@/apps/image-viewer';

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  singleton?: boolean;  // Solo una instancia permitida
}

export const APP_REGISTRY: Record<string, AppConfig> = {
  'file-explorer': {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: '/icons/apps/file-explorer.svg',
    component: FileExplorer,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 400, height: 300 },
  },
  'notepad': {
    id: 'notepad',
    name: 'Notepad',
    icon: '/icons/apps/notepad.svg',
    component: Notepad,
    defaultSize: { width: 650, height: 450 },
    minSize: { width: 300, height: 200 },
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    icon: '/icons/apps/settings.svg',
    component: Settings,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 750, height: 500 },
    singleton: true,
  },
  'browser': {
    id: 'browser',
    name: 'Edge',
    icon: '/icons/apps/edge.svg',
    component: Browser,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 600, height: 400 },
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal',
    icon: '/icons/apps/terminal.svg',
    component: Terminal,
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    icon: '/icons/apps/calculator.svg',
    component: Calculator,
    defaultSize: { width: 320, height: 500 },
    minSize: { width: 280, height: 400 },
    singleton: true,
  },
  'image-viewer': {
    id: 'image-viewer',
    name: 'Photos',
    icon: '/icons/apps/photos.svg',
    component: ImageViewer,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
  },
};

// Apps para el desktop
export const DESKTOP_APPS = ['file-explorer', 'browser', 'notepad', 'terminal'];

// Apps pinneadas en Start Menu
export const PINNED_APPS = [
  'browser',
  'file-explorer',
  'settings',
  'notepad',
  'terminal',
  'calculator',
];

// Apps en taskbar (pinneadas)
export const TASKBAR_PINNED = ['file-explorer', 'browser', 'terminal'];
```

---

## 💾 Persistencia con localStorage

```typescript
// src/stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  wallpaper: string;
  accentColor: string;
  taskbarPosition: 'bottom' | 'top';
  showDesktopIcons: boolean;
}

interface SettingsStore extends Settings {
  setTheme: (theme: Settings['theme']) => void;
  setWallpaper: (wallpaper: string) => void;
  setAccentColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      wallpaper: '/wallpapers/default.jpg',
      accentColor: '#0078d4',
      taskbarPosition: 'bottom',
      showDesktopIcons: true,

      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: 'windows-settings',
    }
  )
);
```

---

## 🎨 CSS Utilities

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* Efecto Acrylic de Windows 11 */
  .acrylic {
    @apply bg-white/70 dark:bg-neutral-900/80;
    @apply backdrop-blur-[20px] backdrop-saturate-[180%];
    @apply border border-white/30 dark:border-white/10;
  }

  /* Efecto Mica (más sutil) */
  .mica {
    @apply bg-gray-100/90 dark:bg-neutral-900/95;
    @apply backdrop-blur-[60px];
  }

  /* Sombra de ventana Windows 11 */
  .window-shadow {
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.04),
      0 8px 16px rgba(0, 0, 0, 0.08),
      0 16px 32px rgba(0, 0, 0, 0.04);
  }

  .window-shadow-active {
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.08),
      0 16px 32px rgba(0, 0, 0, 0.12),
      0 32px 64px rgba(0, 0, 0, 0.08);
  }

  /* Botones de control de ventana */
  .window-control {
    @apply w-11 h-8 flex items-center justify-center;
    @apply transition-colors duration-100;
  }

  .window-control:hover {
    @apply bg-black/5 dark:bg-white/10;
  }

  .window-control-close:hover {
    @apply bg-red-500 text-white;
  }
}
```

---

## 📊 Estimación de Tiempo

| Fase | Duración | Acumulado |
|------|----------|-----------|
| Setup | 1 día | 1 día |
| Window Manager | 3 días | 4 días |
| Desktop + Taskbar | 3 días | 7 días |
| Start Menu + Context Menu | 3 días | 10 días |
| Filesystem | 4 días | 14 días |
| Apps Core | 4 días | 18 días |
| Browser + Polish | 3 días | 21 días |
| Testing + Deploy | 3 días | **24 días** |

**Total estimado: ~4 semanas** (trabajando part-time)

---

## 🔗 Referencias del Proyecto de Referencia

El proyecto **EduardoPicolo/Windows-11-web** usa:
- **Chakra UI** para componentes (nosotros usaremos Tailwind)
- **Turborepo** para monorepo (nosotros tendremos un solo proyecto)
- **pnpm** como package manager

Características implementadas en el proyecto de referencia que debemos replicar:
1. Window management completo (drag, resize, minimize, maximize)
2. Taskbar funcional con iconos de apps
3. Start menu con búsqueda
4. Desktop con wallpaper personalizable
5. Efectos visuales de Windows 11 (blur, rounded corners)

---

## 📝 Notas Importantes

### Static Export Limitations
Con `output: 'export'`:
- ❌ No Server Components con datos dinámicos
- ❌ No API Routes
- ❌ No middleware.ts
- ✅ localStorage para persistencia
- ✅ IndexedDB para filesystem virtual
- ✅ Todo el procesamiento en cliente

### Compatibilidad de Navegadores
- Chrome 90+ (backdrop-filter support)
- Firefox 103+ (backdrop-filter support)
- Safari 14+ (webkit prefix para backdrop-filter)
- Edge 90+

---

## 🚀 Próximos Pasos

1. **Crear el repositorio** en GitHub
2. **Inicializar el proyecto** con Next.js 16
3. **Empezar por el Window Manager** (es el core de todo)
4. **Iterar incrementalmente** con cada fase

¿Listo para comenzar? 💪
