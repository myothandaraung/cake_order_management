# Cake Ordering System - Admin (Web)

This monorepo contains the admin back office for the Cake Ordering System.

## Structure

```
├── admin-api/      # Spring Boot REST API (Java 21)
├── admin-web/      # React + Vite frontend (TypeScript)
└── docs/           # Documentation
```

## Quick Start

### Backend (API)

```bash
cd admin-api
cp .env.example .env  # Configure your database
mvn spring-boot:run
```

### Frontend (Web)

```bash
cd admin-web
cp .env.example .env
npm install
npm run dev
```

## Architecture

- **Backend**: Spring Boot API with JWT auth, JPA, Flyway migrations
- **Frontend**: React with MUI, TanStack Query for data fetching
- **Database**: Shared PostgreSQL (Supabase) with the Flutter mobile app

See [docs/admin/ADMIN_SYSTEM_OVERVIEW.md](docs/admin/ADMIN_SYSTEM_OVERVIEW.md) for detailed specifications.
