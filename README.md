# Introduction

Este repositorio contiene el **frontend de GobDocs**.  
Actualmente el proyecto se encuentra en fase de **setup inicial**, por lo que este README funciona como una **lista técnica de tareas pendientes** para dejar el entorno listo y estable.

---

# Technical To-Do List

## Setup inicial del proyecto
- [ ] Inicializar el proyecto con **Vite**.
- [ ] Definir framework principal (React).
- [ ] Configurar TypeScript (si lo van a usar)
- [ ] Estructurar carpetas base (`src`, `components`, `pages`, `services`, etc.).
- [ ] Definir alias de paths (`@/components`, `@/services`, etc.).

## Dependencias y tooling
- [ ] Instalar y configurar ESLint.
- [ ] Instalar y configurar Prettier.
- [ ] Definir reglas de linting del equipo.
- [ ] Configurar husky + lint-staged (pre-commit hooks).
- [ ] Configurar formateo automático en save.

## Variables de entorno
- [ ] Definir variables de entorno requeridas.
- [ ] Crear archivo `.env.example`.
- [ ] Configurar `import.meta.env` (Vite).
- [ ] Separar environments (`development`, `staging`, `production`).

## Docker
- [ ] Crear `Dockerfile` para frontend.
- [ ] Crear `docker-compose.yml` para entorno local.
- [ ] Configurar hot-reload dentro del contenedor.
- [ ] Documentar comandos Docker (`build`, `up`, `down`).
- [ ] Verificar compatibilidad con backend dockerizado.

## Comunicación con backend
- [ ] Definir cliente HTTP (Axios / Fetch wrapper).
- [ ] Centralizar base URL por environment.
- [ ] Manejo global de errores HTTP.
- [ ] Manejo de estados de loading y errores.

## State management
- [ ] Definir estrategia de estado global (Context, Zustand, Redux, etc.).
- [ ] Separar estado de UI y estado de negocio.
- [ ] Manejar sesión del usuario.

## Routing
- [ ] Configurar sistema de rutas.
- [ ] Rutas públicas vs privadas.
- [ ] Guards de autenticación.
- [ ] Layouts base (auth / dashboard).

## Estilos y UI
- [ ] Definir sistema de estilos (Tailwind, CSS Modules, UI Kit).
- [ ] Configurar tema global.
- [ ] Componentes base reutilizables.
- [ ] Soporte responsive.

## Build y optimización
- [ ] Configurar build de producción.
- [ ] Optimizar bundle (code splitting).
- [ ] Configurar variables de build.
- [ ] Verificar build dentro de Docker.

## Testing
- [ ] Configurar testing framework.
- [ ] Tests unitarios básicos.
- [ ] Tests de componentes.
- [ ] Tests de integración simples.

---

# Build and Test

> Pendiente de configuración.  
Esta sección se completará una vez finalizado el setup técnico.

---

# Contribute

Antes de contribuir, asegúrate de:
- Seguir la estructura definida del proyecto.
- Respetar reglas de linting y formato.
- Mantener el proyecto dockerizable.
