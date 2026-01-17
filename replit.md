# Deepak.SEC - Interactive 3D Portfolio

## Overview

This is an interactive 3D portfolio website with a cybersecurity/hacker theme. It features a network topology visualization built with React Three Fiber where users can navigate between different sections (profile, experience, skills, achievements, contact) by clicking on 3D nodes. The application uses a terminal-style overlay system to display content and includes a contact form that persists messages to a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript** single-page application with Vite as the build tool
- **React Three Fiber** for 3D scene rendering with Three.js, including post-processing effects (bloom, noise, vignette)
- **Framer Motion** for UI animations and transitions
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API calls
- **Shadcn/UI** component library built on Radix primitives with Tailwind CSS
- Custom cyberpunk/hacker theme with CSS variables for colors (cyan, purple, green accents on dark background)
- Custom fonts: Orbitron (display), Rajdhani (body), Fira Code (monospace)

### Backend Architecture
- **Express.js** server with TypeScript
- Simple REST API structure defined in `shared/routes.ts` with Zod validation
- Storage layer abstraction in `server/storage.ts` for database operations
- Development uses Vite middleware for HMR; production serves static files from `dist/public`

### Data Storage
- **PostgreSQL** database with Drizzle ORM
- Schema defined in `shared/schema.ts` with Drizzle-Zod integration for type-safe validation
- Currently has a single `messages` table for contact form submissions
- Migrations output to `./migrations` directory via `drizzle-kit`

### Build System
- Custom build script (`script/build.ts`) that:
  - Builds frontend with Vite to `dist/public`
  - Bundles server with esbuild, selectively bundling common dependencies to reduce cold start times
  - Outputs production server as `dist/index.cjs`

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # React components including 3D scene and UI
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
    pages/        # Page components
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database operations
  db.ts           # Drizzle database connection
shared/           # Shared code between client and server
  schema.ts       # Database schema and types
  routes.ts       # API route definitions with Zod schemas
```

## External Dependencies

### Database
- PostgreSQL (required, configured via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations and migrations

### 3D Graphics Stack
- Three.js core library
- @react-three/fiber (React renderer)
- @react-three/drei (helpers and abstractions)
- @react-three/postprocessing (visual effects)
- camera-controls for enhanced camera manipulation

### UI Framework
- Radix UI primitives (comprehensive set of accessible components)
- Tailwind CSS for styling
- class-variance-authority for component variants
- Framer Motion for animations

### Development Tools
- Replit-specific Vite plugins for error overlay, cartographer, and dev banner
- tsx for TypeScript execution in development