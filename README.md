<div align="center">

# 🛰️ Orbit Task Platform

**پلتفرم مدیریت پروژه و وظایف تیمی — بک‌اند production-style با Node.js**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[ویژگی‌ها](#-ویژگیها) •
[شروع سریع](#-شروع-سریع) •
[مستندات API](#-مستندات-api) •
[معماری](#-معماری-پروژه) •
[Docker](#-اجرای-با-docker) •
[تست](#-تستها)

</div>

---

## 📖 درباره پروژه

**Orbit Task Platform** (Orbit API) یک بک‌اند کامل و production-style برای مدیریت پروژه‌ها و وظایف تیمی است. این پروژه به‌عنوان یک نمونه‌کار (portfolio) طراحی شده و الگوهای رایج صنعت نرم‌افزار را در خود جای داده است:

- معماری ماژولار و domain-driven
- احراز هویت امن با JWT
- اعتبارسنجی ورودی با Zod
- کش Redis برای بهبود عملکرد
- Rate limiting برای محافظت در برابر سوءاستفاده
- مستندسازی تعاملی با Swagger UI
- تست‌های یکپارچه‌سازی با Vitest و Supertest
- کانتینرسازی کامل با Docker Compose

این مخزن برای نمایش مهارت‌های backend development — از طراحی API تا deploy — مناسب است.

---

## ✨ ویژگی‌ها

### احراز هویت و کاربران
- ثبت‌نام و ورود کاربر با JWT
- هش کردن رمز عبور با bcrypt (cost factor: 12)
- نقش‌های کاربری: `ADMIN` و `MEMBER`
- endpoint پروفایل کاربر (`GET /api/users/me`)

### مدیریت پروژه
- ایجاد پروژه با عنوان و توضیحات
- لیست پروژه‌های متعلق به کاربر احراز هویت‌شده
- هر پروژه شامل وظایف مرتبط (eager load) است

### مدیریت وظایف
- ایجاد وظیفه با عنوان، جزئیات، پروژه و تاریخ سررسید
- به‌روزرسانی وضعیت وظیفه: `TODO` → `IN_PROGRESS` → `DONE`
- تخصیص خودکار وظیفه به کاربر ایجادکننده

### زیرساخت و امنیت
- **Redis caching**: کش لیست پروژه‌ها (TTL: 30 ثانیه) با invalidation هنگام ایجاد پروژه
- **Rate limiting**: حداکثر 100 درخواست در دقیقه به ازای هر IP
- **Helmet**: هدرهای امنیتی HTTP
- **CORS**: پشتیبانی از cross-origin requests
- **اعتبارسنجی env**: متغیرهای محیطی با Zod parse می‌شوند

### توسعه و DevOps
- TypeScript با strict typing
- ESLint + Prettier
- Swagger UI در مسیر `/docs`
- Dockerfile و docker-compose برای اجرای یک‌فرمانه
- Prisma Migrate برای مدیریت schema دیتابیس

---

## 🛠️ تکنولوژی‌ها

| لایه | ابزار |
|------|-------|
| Runtime | Node.js ≥ 20 |
| Framework | Express 5 |
| زبان | TypeScript 5.9 |
| ORM | Prisma 7 |
| دیتابیس | PostgreSQL 16 |
| کش / Rate limit | Redis 7 |
| احراز هویت | JWT (jsonwebtoken) + bcryptjs |
| اعتبارسنجی | Zod 4 |
| مستندات API | Swagger (OpenAPI 3.0) + swagger-ui-express |
| تست | Vitest + Supertest |
| کیفیت کد | ESLint 9 + Prettier |
| کانتینر | Docker + Docker Compose |

---

## 🏗️ معماری پروژه

```
orbit-task-platform/
├── prisma/
│   └── schema.prisma          # مدل داده: User, Project, Task
├── src/
│   ├── config/
│   │   ├── db.ts              # Prisma client
│   │   ├── env.ts             # اعتبارسنجی متغیرهای محیطی
│   │   └── redis.ts           # اتصال Redis
│   ├── middlewares/
│   │   ├── auth.ts            # JWT authentication guard
│   │   ├── errorHandler.ts    # مدیریت خطای سراسری
│   │   ├── rateLimit.ts       # محدودیت نرخ درخواست
│   │   └── validate.ts        # Zod request validation
│   ├── modules/
│   │   ├── auth/              # ثبت‌نام و ورود
│   │   ├── users/             # پروفایل کاربر
│   │   ├── projects/          # CRUD پروژه + کش
│   │   └── tasks/             # ایجاد و به‌روزرسانی وظیفه
│   ├── utils/
│   │   └── jwt.ts             # sign / verify توکن
│   ├── app.ts                 # Express app و middlewareها
│   ├── server.ts              # bootstrap و اتصال به DB/Redis
│   └── types.ts
├── tests/
│   ├── auth.test.ts
│   └── health.test.ts
├── swagger.yaml               # OpenAPI specification
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### جریان درخواست (Request Flow)

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

## 🗄️ مدل داده

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

### Enumها

| Enum | مقادیر |
|------|--------|
| `Role` | `ADMIN`, `MEMBER` |
| `TaskStatus` | `TODO`, `IN_PROGRESS`, `DONE` |

### روابط
- هر **User** می‌تواند مالک چند **Project** باشد (`onDelete: Cascade`)
- هر **Project** شامل چند **Task** است (`onDelete: Cascade`)
- هر **Task** می‌تواند به یک **User** به‌عنوان assignee اختصاص یابد (`onDelete: SetNull`)

---

## 🚀 شروع سریع

### پیش‌نیازها

- [Node.js](https://nodejs.org/) نسخه 20 یا بالاتر
- [PostgreSQL](https://www.postgresql.org/) 16 (یا Docker)
- [Redis](https://redis.io/) 7 (یا Docker)
- npm

### نصب محلی

**1. کلون مخزن**

```bash
git clone https://github.com/mahdi-esmaeilnezhad/orbit-task-platform.git
cd orbit-task-platform
```

**2. تنظیم متغیرهای محیطی**

```bash
cp .env.example .env
```

فایل `.env` را ویرایش کنید (جزئیات در [بخش Environment Variables](#-متغیرهای-محیطی)).

**3. نصب وابستگی‌ها**

```bash
npm install
```

**4. تولید Prisma Client**

```bash
npx prisma generate
```

**5. اجرای migration**

```bash
npx prisma migrate dev --name init
```

**6. اجرای سرور توسعه**

```bash
npm run dev
```

سرور روی `http://localhost:4000` اجرا می‌شود.

| مسیر | توضیح |
|------|-------|
| `http://localhost:4000/health` | Health check |
| `http://localhost:4000/docs` | Swagger UI |
| `http://localhost:4000/api/*` | REST API |

---

## 🐳 اجرای با Docker

ساده‌ترین روش اجرای کل stack (API + PostgreSQL + Redis):

```bash
cp .env.example .env
docker compose up --build
```

Docker Compose سه سرویس را بالا می‌آورد:

| سرویس | Container | پورت |
|--------|-----------|------|
| API | `orbit-api` | `4000` |
| PostgreSQL | `orbit-postgres` | `5432` |
| Redis | `orbit-redis` | `6379` |

> هنگام استارت، container API به‌صورت خودکار `prisma migrate deploy` را اجرا کرده و سپس `npm start` را فراخوانی می‌کند.

برای توقف:

```bash
docker compose down
```

برای حذف volume دیتابیس:

```bash
docker compose down -v
```

---

## ⚙️ متغیرهای محیطی

| متغیر | پیش‌فرض | توضیح |
|-------|---------|-------|
| `NODE_ENV` | `development` | محیط اجرا: `development` \| `test` \| `production` |
| `PORT` | `4000` | پورت سرور HTTP |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/orbit` | connection string PostgreSQL |
| `JWT_SECRET` | — | کلید امضای JWT (حداقل 10 کاراکتر) |
| `JWT_EXPIRES_IN` | `1d` | مدت اعتبار توکن (مثلاً `1d`, `7d`, `12h`) |
| `REDIS_URL` | `redis://localhost:6379` | آدرس Redis |

### نمونه `.env` برای Docker

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/orbit
JWT_SECRET=your_super_secure_secret_key_here
JWT_EXPIRES_IN=1d
REDIS_URL=redis://redis:6379
```

> ⚠️ در production حتماً `JWT_SECRET` قوی و یکتا تنظیم کنید و آن را در مخزن commit نکنید.

---

## 📡 مستندات API

### احراز هویت

تمام endpointهای محافظت‌شده نیاز به هدر زیر دارند:

```
Authorization: Bearer <your_jwt_token>
```

---

### `GET /health`

بررسی سلامت API — بدون نیاز به احراز هویت.

**Response `200`**

```json
{
  "status": "ok"
}
```

---

### `POST /api/auth/register`

ثبت‌نام کاربر جدید.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "علی محمدی"
}
```

| فیلد | قوانین |
|------|--------|
| `email` | فرمت ایمیل معتبر |
| `password` | حداقل 8 کاراکتر |
| `fullName` | حداقل 2 کاراکتر |

**Response `201`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `409`** — ایمیل تکراری

```json
{
  "message": "Email already exists"
}
```

---

### `POST /api/auth/login`

ورود کاربر.

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

دریافت پروفایل کاربر احراز هویت‌شده. 🔒

**Response `200`**

```json
{
  "id": "clx...",
  "email": "user@example.com",
  "fullName": "علی محمدی",
  "role": "MEMBER",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

---

### `GET /api/projects`

لیست پروژه‌های متعلق به کاربر جاری (با وظایف). 🔒

- نتیجه از **Redis cache** خوانده می‌شود (TTL: 30 ثانیه)
- کلید کش: `projects:{userId}`

**Response `200`**

```json
[
  {
    "id": "clx...",
    "title": "پروژه Orbit",
    "description": "پلتفرم مدیریت وظایف تیمی",
    "ownerId": "clx...",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "tasks": []
  }
]
```

---

### `POST /api/projects`

ایجاد پروژه جدید. 🔒

**Request Body**

```json
{
  "title": "پروژه Orbit",
  "description": "پلتفرم مدیریت وظایف تیمی"
}
```

| فیلد | قوانین |
|------|--------|
| `title` | حداقل 3 کاراکتر |
| `description` | حداقل 10 کاراکتر |

**Response `201`** — شیء پروژه ایجادشده

> پس از ایجاد، کش پروژه‌های کاربر invalidate می‌شود.

---

### `POST /api/tasks`

ایجاد وظیفه جدید. 🔒

**Request Body**

```json
{
  "title": "پیاده‌سازی API",
  "details": "ساخت endpointهای auth و projects",
  "projectId": "clx_project_id",
  "dueDate": "2026-02-01T00:00:00.000Z"
}
```

| فیلد | قوانین |
|------|--------|
| `title` | حداقل 3 کاراکتر |
| `details` | حداقل 5 کاراکتر |
| `projectId` | شناسه پروژه (حداقل 5 کاراکتر) |
| `dueDate` | اختیاری — ISO 8601 datetime |

**Response `201`** — شیء وظیفه با `status: "TODO"`

---

### `PATCH /api/tasks/:id/status`

به‌روزرسانی وضعیت وظیفه. 🔒

**Request Body**

```json
{
  "status": "IN_PROGRESS"
}
```

مقادیر مجاز: `TODO` | `IN_PROGRESS` | `DONE`

**Response `200`** — شیء وظیفه به‌روزشده

---

### کدهای خطای رایج

| کد | معنی |
|----|------|
| `400` | خطای اعتبارسنجی (Zod) |
| `401` | عدم احراز هویت یا credentials نامعتبر |
| `409` | تداخل (مثلاً ایمیل تکراری) |
| `429` | تعداد درخواست بیش از حد (rate limit) |
| `500` | خطای داخلی سرور |

**نمونه خطای اعتبارسنجی**

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

مستندات تعاملی OpenAPI در آدرس زیر در دسترس است:

```
http://localhost:4000/docs
```

فایل specification: [`swagger.yaml`](./swagger.yaml)

---

## 🧪 تست‌ها

پروژه از **Vitest** و **Supertest** برای تست یکپارچه‌سازی API استفاده می‌کند. Prisma و Redis در تست‌ها mock می‌شوند.

```bash
# اجرای یک‌باره
npm test

# حالت watch
npm run test:watch
```

### تست‌های موجود

| فایل | پوشش |
|------|------|
| `tests/health.test.ts` | `GET /health` |
| `tests/auth.test.ts` | `POST /api/auth/register` |

---

## 📜 اسکریپت‌های npm

| دستور | توضیح |
|-------|-------|
| `npm run dev` | اجرای سرور با hot-reload (`tsx watch`) |
| `npm run build` | کامپایل TypeScript به `dist/` |
| `npm run start` | اجرای نسخه build‌شده |
| `npm run lint` | بررسی ESLint |
| `npm run lint:fix` | رفع خودکار خطاهای ESLint |
| `npm run format` | فرمت کد با Prettier |
| `npm run test` | اجرای تست‌ها |
| `npm run test:watch` | تست در حالت watch |

---

## 🔒 نکات امنیتی

- رمز عبور با **bcrypt** (12 round) هش می‌شود — هرگز plain-text ذخیره نمی‌شود
- JWT با secret قابل تنظیم امضا می‌شود
- **Helmet** هدرهای امنیتی HTTP را تنظیم می‌کند
- **Rate limiting** از حملات brute-force و DDoS سطح application جلوگیری می‌کند
- اعتبارسنجی ورودی با **Zod** قبل از رسیدن به لایه دیتابیس
- در production: `JWT_SECRET` قوی، HTTPS، و محدود کردن CORS

---

## 🗺️ نقشه راه (Roadmap)

ایده‌های توسعه آینده:

- [ ] Refresh token و logout
- [ ] CRUD کامل برای tasks (ویرایش، حذف، فیلتر)
- [ ] عضویت چند کاربر در یک پروژه (team members)
- [ ] Pagination و sorting برای لیست‌ها
- [ ] Webhook یا notification system
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] پوشش تست گسترده‌تر (projects, tasks, rate limit)
- [ ] Role-based access control پیشرفته‌تر

---

## 🤝 مشارکت

مشارکت شما خوش‌آمد است!

1. این مخزن را Fork کنید
2. یک branch جدید بسازید: `git checkout -b feature/amazing-feature`
3. تغییرات را commit کنید: `git commit -m 'Add amazing feature'`
4. branch را push کنید: `git push origin feature/amazing-feature`
5. یک Pull Request باز کنید

لطفاً قبل از PR:
- `npm run lint` و `npm test` را اجرا کنید
- از `npm run format` برای یکدست‌سازی کد استفاده کنید

---

## 💼 نکات رزومه

این پروژه برای نمایش مهارت‌های زیر در رزومه مناسب است:

- طراحی و پیاده‌سازی بک‌اند ماژولار TypeScript با Express، Prisma و PostgreSQL
- پیاده‌سازی احراز هویت JWT و workflow اعتبارسنجی درخواست
- بهبود عملکرد API با Redis caching و rate limiting
- کانتینرسازی سرویس‌ها با Docker Compose
- نوشتن تست یکپارچه‌سازی برای endpointهای حیاتی با Vitest و Supertest

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است. جزئیات در فایل [LICENSE](LICENSE).

---

## 👤 نویسنده

**Mahdi Esmaeilnezhad**

- GitHub: [@mahdi-esmaeilnezhad](https://github.com/mahdi-esmaeilnezhad)
- Repository: [orbit-task-platform](https://github.com/mahdi-esmaeilnezhad/orbit-task-platform)

---

<div align="center">

اگر این پروژه برایتان مفید بود، یک ⭐ روی GitHub بگذارید!

</div>
