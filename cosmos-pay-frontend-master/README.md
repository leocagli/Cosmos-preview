# Cosmos Pay Frontend

Aplicación frontend de Cosmos Pay para la experiencia pública y el panel de desarrolladores.

## Sitio web

- Producción: https://cosmos.cloudycoding.com/

## Qué incluye

- Landing pública de Cosmos
- Flujo de autenticación
- Documentación pública de Cosmos Pay
- Panel de desarrolladores
- Gestión y visualización de links de pago

## Stack

- React 19
- TypeScript
- Vite
- React Router
- i18next
- Recharts

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estructura

```text
src/
├── api/
├── assets/
├── components/
├── context/
├── hooks/
├── i18n/
└── pages/
```

## Variables de entorno

Usa `.env.example` como base para crear tu `.env`.

## Estado de validación

- `npm run build`: OK
- `npm run lint`: actualmente falla por errores preexistentes del proyecto
