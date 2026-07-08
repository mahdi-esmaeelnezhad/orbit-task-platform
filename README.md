<div align="center">

# 🛰️ Orbit Task Platform

**A production-style team project & task management backend built with Node.js**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) •
[Quick Start](#-quick-start) •
[API Docs](#-api-documentation) •
[Architecture](#-project-architecture) •
[Docker](#-running-with-docker) •
[Tests](#-tests)

</div>

---

## 📖 About

**Orbit Task Platform** (Orbit API) is a full-featured, production-style backend for team project and task management. It is designed as a portfolio project and demonstrates common industry patterns:

- Modular, domain-driven architecture
- Secure JWT authentication
- Request validation with Zod
- Redis caching for performance
- Rate limiting to prevent abuse
- Interactive API documentation with Swagger UI
- Integration tests with Vitest and Supertest
- Full containerization with Docker Compose

This repository is ideal for showcasing backend development skills — from API design to deployment.

---

## ✨ Features

### Authentication & Users
- User registration and login with JWT
- Password hashing with bcrypt (cost factor: 12)
- User roles: `ADMIN` and `MEMBER`
- User profile endpoint (`GET /api/users/me`)

### Project Management
- Create projects with title and description
- List projects owned by the authenticated user
- Each project includes related tasks (eager loaded)

### Task Management
- Create tasks with title, details, project, and optional due date
- Update task status: `TODO` → `IN_PROGRESS` → `DONE`
- Auto-assign tasks to the creating user

### Infrastructure & Security
- **Redis caching**: project list cache (TTL: 30 seconds) with invalidation on project creation
- **Rate limiting**: max 100 requests per minute per IP
- **Helmet**: HTTP security headers
- **CORS**: cross-origin request support
- **Env validation**: environment variables parsed and validated with Zod

### Development & DevOps
- TypeScript with strict typing
- ESLint + Prettier
- Swagger UI at `/docs`
- Dockerfile and docker-compose for one-command startup
- Prisma Migrate for database schema management

---

## 🛠️ Tech Stack

| Layer | Tool |
|-------|------|
| Runtime | Node.js ≥ 20 |
| Framework | Express 5 |
| Language | TypeScript 5.9 |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| Cache / Rate limit | Redis 7 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod 4 |
| API Docs | Swagger (OpenAPI 3.0) + swagger-ui-express |
| Testing | Vitest + Supertest |
| Code Quality | ESLint 9 + Prettier |
| Containerization | Docker + Docker Compose |

---

## 🏗️ Project Architecture

```
orbit-task-platform/
├── prisma/
│   └── schema.prisma          # Data models: User, Project, Task
├── src/
│   ├── config/
│   │   ├── db.ts              # Prisma client
│   │   ├── env.ts             # Environment variable validation
│   │   └── redis.ts           # Redis connection
│   ├── middlewares/
│   │   ├── auth.ts            # JWT authentication guard
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── rateLimit.ts       # Request rate limiting
│   │   └── validate.ts        # Zod request validation
│   ├── modules/
│   │   ├── auth/              # Register & login
│   │   ├── users/             # User profile
│   │   ├── projects/          # Project CRUD + caching
│   │   └── tasks/             # Task creation & status updates
│   ├── utils/
│   │   └── jwt.ts             # Token sign / verify
│   ├── app.ts                 # Express app & middleware
│   ├── server.ts              # Bootstrap & DB/Redis connection
│   └── types.ts
├── tests/
│   ├── auth.test.ts
│   └── health.test.ts
├── swagger.yaml               # OpenAPI specification
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Request Flow

```
Client Request
    │
    ▼
┌─────────────┐
│   CORS      │
│   Helmet    │
│   Morgan    │
│   JSON      │
│ Rate Limit  │──► Redis (incr/expire per IP)
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│   Router    │────►│ requireAuth  │ (JWT verify)
│  /api/...   │     └──────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  validate   │──► Zod schema parse
│  (Zod)      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  Handler    │────►│ Prisma / Redis│
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│ errorHandler│
└─────────────┘
```

---

## 🗄️ Data Model

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │   Project    │       │     Task     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │──1:N──│ ownerId      │──1:N──│ projectId    │
│ email (uniq) │       │ title        │       │ title        │
│ passwordHash │       │ description  │       │ details      │
│ fullName     │       │ createdAt    │       │ status       │
│ role         │       │ updatedAt    │       │ assigneeId   │
│ createdAt    │       └──────────────┘       │ dueDate      │
│ updatedAt    │                              │ createdAt    │
└──────────────┘◄──────── assignee ──────────│ updatedAt    │
                                              └──────────────┘
```

### Enums

| Enum | Values |
|------|--------|
| `Role` | `ADMIN`, `MEMBER` |
| `TaskStatus` | `TODO`, `IN_PROGRESS`, `DONE` |

### Relationships
- Each **User** can own multiple **Projects** (`onDelete: Cascade`)
- Each **Project** contains multiple **Tasks** (`onDelete: Cascade`)
- Each **Task** can be assigned to a **User** as assignee (`onDelete: SetNull`)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or higher
- [PostgreSQL](https://www.postgresql.org/) 16 (or Docker)
- [Redis](https://redis.io/) 7 (or Docker)
- npm

### Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/mahdi-esmaeilnezhad/orbit-task-platform.git
cd orbit-task-platform
```

**2. Configure environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file (see [Environment Variables](#-environment-variables) for details).

**3. Install dependencies**

```bash
npm install
```

**4. Generate Prisma Client**

```bash
npx prisma generate
```

**5. Run migrations**

```bash
npx prisma migrate dev --name init
```

**6. Start the development server**

```bash
npm run dev
```

The server runs at `http://localhost:4000`.

| URL | Description |
|-----|-------------|
| `http://localhost:4000/health` | Health check |
| `http://localhost:4000/docs` | Swagger UI |
| `http://localhost:4000/api/*` | REST API |

---

## 🐳 Running with Docker

The easiest way to run the full stack (API + PostgreSQL + Redis):

```bash
cp .env.example .env
docker compose up --build
```

Docker Compose starts three services:

| Service | Container | Port |
|---------|-----------|------|
| API | `orbit-api` | `4000` |
| PostgreSQL | `orbit-postgres` | `5432` |
| Redis | `orbit-redis` | `6379` |

> On startup, the API container automatically runs `prisma migrate deploy` and then `npm start`.

To stop:

```bash
docker compose down
```

To remove the database volume:

```bash
docker compose down -v
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment: `development` \| `test` \| `production` |
| `PORT` | `4000` | HTTP server port |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/orbit` | PostgreSQL connection string |
| `JWT_SECRET` | — | JWT signing key (minimum 10 characters) |
| `JWT_EXPIRES_IN` | `1d` | Token expiration (e.g. `1d`, `7d`, `12h`) |
| `REDIS_URL` | `redis://localhost:6379` | Redis address |

### Sample `.env` for Docker

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/orbit
JWT_SECRET=your_super_secure_secret_key_here
JWT_EXPIRES_IN=1d
REDIS_URL=redis://redis:6379
```

> ⚠️ In production, always use a strong, unique `JWT_SECRET` and never commit it to the repository.

---

## 📡 API Documentation

### Authentication

All protected endpoints require the following header:

```
Authorization: Bearer <your_jwt_token>
```

---

### `GET /health`

API health check — no authentication required.

**Response `200`**

```json
{
  "status": "ok"
}
```

---

### `POST /api/auth/register`

Register a new user.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

| Field | Rules |
|-------|-------|
| `email` | Valid email format |
| `password` | Minimum 8 characters |
| `fullName` | Minimum 2 characters |

**Response `201`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `409`** — duplicate email

```json
{
  "message": "Email already exists"
}
```

---

### `POST /api/auth/login`

Log in a user.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response `200`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `401`**

```json
{
  "message": "Invalid credentials"
}
```

---

### `GET /api/users/me`

Get the authenticated user's profile. 🔒

**Response `200`**

```json
{
  "id": "clx...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "MEMBER",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

---

### `GET /api/projects`

List projects owned by the current user (with tasks). 🔒

- Results are served from **Redis cache** (TTL: 30 seconds)
- Cache key: `projects:{userId}`

**Response `200`**

```json
[
  {
    "id": "clx...",
    "title": "Orbit Project",
    "description": "Team task management platform",
    "ownerId": "clx...",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "tasks": []
  }
]
```

---

### `POST /api/projects`

Create a new project. 🔒

**Request Body**

```json
{
  "title": "Orbit Project",
  "description": "Team task management platform"
}
```

| Field | Rules |
|-------|-------|
| `title` | Minimum 3 characters |
| `description` | Minimum 10 characters |

**Response `201`** — created project object

> After creation, the user's project cache is invalidated.

---

### `POST /api/tasks`

Create a new task. 🔒

**Request Body**

```json
{
  "title": "Implement API",
  "details": "Build auth and project endpoints",
  "projectId": "clx_project_id",
  "dueDate": "2026-02-01T00:00:00.000Z"
}
```

| Field | Rules |
|-------|-------|
| `title` | Minimum 3 characters |
| `details` | Minimum 5 characters |
| `projectId` | Project ID (minimum 5 characters) |
| `dueDate` | Optional — ISO 8601 datetime |

**Response `201`** — task object with `status: "TODO"`

---

### `PATCH /api/tasks/:id/status`

Update a task's status. 🔒

**Request Body**

```json
{
  "status": "IN_PROGRESS"
}
```

Allowed values: `TODO` | `IN_PROGRESS` | `DONE`

**Response `200`** — updated task object

---

### Common Error Codes

| Code | Meaning |
|------|---------|
| `400` | Validation error (Zod) |
| `401` | Unauthorized or invalid credentials |
| `409` | Conflict (e.g. duplicate email) |
| `429` | Too many requests (rate limit) |
| `500` | Internal server error |

**Sample validation error**

```json
{
  "message": "Validation failed",
  "issues": [
    {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "path": ["password"],
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

---

### Swagger UI

Interactive OpenAPI documentation is available at:

```
http://localhost:4000/docs
```

Specification file: [`swagger.yaml`](./swagger.yaml)

---

## 🧪 Tests

The project uses **Vitest** and **Supertest** for API integration tests. Prisma and Redis are mocked in tests.

```bash
# Run once
npm test

# Watch mode
npm run test:watch
```

### Test Coverage

| File | Coverage |
|------|----------|
| `tests/health.test.ts` | `GET /health` |
| `tests/auth.test.ts` | `POST /api/auth/register` |

---

## 📜 npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the built version |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 rounds) — never stored in plain text
- JWTs are signed with a configurable secret
- **Helmet** sets HTTP security headers
- **Rate limiting** helps mitigate brute-force and application-level DDoS
- Input validation with **Zod** before reaching the database layer
- In production: use a strong `JWT_SECRET`, HTTPS, and restrict CORS

---

## 🗺️ Roadmap

Future development ideas:

- [ ] Refresh tokens and logout
- [ ] Full task CRUD (update, delete, filter)
- [ ] Multi-user project membership (team members)
- [ ] Pagination and sorting for list endpoints
- [ ] Webhook or notification system
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Broader test coverage (projects, tasks, rate limit)
- [ ] Advanced role-based access control

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Before submitting a PR:
- Run `npm run lint` and `npm test`
- Use `npm run format` to keep code style consistent

---

## 💼 Resume Highlights

This project is well-suited for demonstrating the following skills on a resume:

- Designed and implemented a modular TypeScript backend with Express, Prisma, and PostgreSQL
- Built secure JWT authentication and request validation workflows
- Improved API performance with Redis caching and rate limiting
- Containerized services with Docker Compose
- Wrote integration tests for critical API endpoints with Vitest and Supertest

---

## 📄 License

This project is released under the **MIT** License. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Mahdi Esmaeilnezhad**

- GitHub: [@mahdi-esmaeilnezhad](https://github.com/mahdi-esmaeilnezhad)
- Repository: [orbit-task-platform](https://github.com/mahdi-esmaeilnezhad/orbit-task-platform)

---

<div align="center">

If you find this project useful, give it a ⭐ on GitHub!

</div>
