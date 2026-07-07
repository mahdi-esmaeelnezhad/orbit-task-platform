# Orbit API

Orbit API is a production-style backend project for portfolio use. It is a team task management platform with authentication, projects, tasks, caching, API documentation, validation, tests, and full containerization.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Docker
- Redis
- Swagger
- Zod
- ESLint
- Prettier
- Vitest + Supertest

## Features

- JWT-based authentication with register and login
- Modular architecture with domain-based routing
- Project and task management APIs
- Request validation with Zod
- Redis-based rate limiting and project list caching
- Swagger UI at `/docs`
- Prisma schema for relational data modeling
- Linting and formatting setup
- Automated API tests
- Dockerized app with PostgreSQL and Redis

## Project Structure

```text
src/
  config/
  middlewares/
  modules/
    auth/
    users/
    projects/
    tasks/
  utils/
  app.ts
  server.ts
prisma/
tests/
swagger.yaml
docker-compose.yml
```

## Quick Start

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run migrations:

```bash
npx prisma migrate dev --name init
```

5. Run development server:

```bash
npm run dev
```

## Docker Start

```bash
docker compose up --build
```

The API will run on `http://localhost:4000`, and Swagger UI will be available at `http://localhost:4000/docs`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run test`
- `npm run test:watch`

## Suggested Resume Highlights

- Designed and implemented a modular TypeScript backend using Express, Prisma, and PostgreSQL
- Built secure JWT authentication and request validation workflows
- Improved API performance using Redis caching and rate limiting
- Containerized full stack services with Docker Compose
- Wrote integration tests for critical API endpoints with Vitest and Supertest
