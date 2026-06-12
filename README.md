# Operra API

Multi-tenant SaaS backend powering the Operra platform. Built with Node.js, TypeScript, and Express — backed by PostgreSQL, Redis, and AWS Bedrock.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 + TypeScript |
| Framework | Express 5 |
| ORM | Prisma (PostgreSQL) |
| Cache / Jobs | Redis (ioredis) |
| Auth | JWT + bcrypt |
| AI | AWS Bedrock (Claude Sonnet) |
| Email | Mailgun |
| SMS | Twilio |
| Payments | Stripe |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry (GHCR) |

---

## Architecture

Operra API is a multi-tenant SaaS backend designed around:

- organization-scoped resources
- modular domain-driven services
- API-first infrastructure
- usage-based billing
- AI-native integrations
- horizontally scalable containerized deployment

The platform uses:

- PostgreSQL for persistence
- Redis for caching, jobs, and rate limiting
- Prisma ORM for database access
- Docker Compose for local orchestration
- GitHub Actions for CI/CD
- GHCR for container distribution

---

## Features

- **Multi-tenancy** — organization-scoped data with membership roles and permissions
- **Auth** — JWT-based authentication with refresh token support
- **API Keys** — hashed API key issuance and validation for programmatic access
- **Billing** — Stripe subscription management across Starter, Growth, Business, and Enterprise plans with usage limits
- **Bookings** — booking lifecycle management with post-create/post-cancel hooks
- **Customers** — customer records scoped to organizations
- **Integrations** — per-org Mailgun, Twilio, Stripe, and outbound webhook configuration
- **Analytics** — API request usage tracking and reporting
- **Notifications** — in-app notification delivery
- **AI** — AWS Bedrock inference endpoint with per-org request logging
- **Background Jobs** — scheduled billing, email, and reminder jobs via Redis

---

## Project Structure

```txt
src/
├── app.ts                  # Express app setup and route mounting
├── server.ts               # HTTP server entry point
├── routes.ts               # Core API router
├── config/                 # Env, rate limits, plan limits, logger, Redis
├── core/
│   ├── middleware/         # Auth, error handling, rate limiting
│   ├── permissions/        # RBAC helpers
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Shared utilities
├── database/               # Prisma client, seed, org setup
├── jobs/                   # Background job definitions
├── lib/                    # AWS Bedrock, Prisma, Redis singletons
└── modules/
    ├── ai/                 # AWS Bedrock inference
    ├── analytics/          # Usage analytics
    ├── api-keys/           # API key management
    ├── auth/               # Authentication
    ├── billing/            # Stripe billing + webhooks
    ├── bookings/           # Booking management
    ├── customers/          # Customer management
    ├── health/             # Health checks
    ├── integrations/       # Mailgun, Twilio, Stripe integrations
    ├── memberships/        # Organization memberships
    ├── notifications/      # Notifications
    ├── organizations/      # Organization management
    ├── payments/           # Payment records
    ├── services/           # Internal services
    ├── usage/              # Usage tracking
    └── users/              # User management
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 15+
- Redis 7+
- Docker Desktop (recommended)

---

## Local Development Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

The API will be available at:

```txt
http://localhost:3000
```

---

## Docker Development (Recommended)

### Start Full Stack

```bash
docker compose up -d --build
```

This starts:

- Operra API
- PostgreSQL
- Redis

### Useful Docker Commands

```bash
# View running containers
docker ps

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild API container
docker compose build api

# Restart API service
docker compose restart api
```

### Default Ports

| Service | Port |
|---|---|
| API | 3000 |
| PostgreSQL | 5433 |
| Redis | 6379 |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `STRIPE_PUBLIC_KEY` | No | Stripe public key |
| `STRIPE_PRICE_STARTER` | No | Starter plan price ID |
| `STRIPE_PRICE_GROWTH` | No | Growth plan price ID |
| `STRIPE_PRICE_BUSINESS` | No | Business plan price ID |
| `STRIPE_PRICE_PROFESSIONAL` | No | Professional plan price ID |
| `MAILGUN_API_KEY` | No | Mailgun API key |
| `MAILGUN_DOMAIN` | No | Mailgun sending domain |
| `MAILGUN_FROM_EMAIL` | No | Default sender email |
| `TWILIO_ACCOUNT_SID` | No | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | No | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | No | Twilio phone number |
| `AWS_REGION` | No | AWS region |
| `AWS_BEDROCK_MODEL_ID` | No | AWS Bedrock model |
| `FRONTEND_URL` | No | Frontend CORS origin |
| `PORT` | No | HTTP port |

Integration variables are validated lazily, meaning the API can boot without optional third-party services configured.

---

## API Overview

All routes are prefixed with:

```txt
/api/v1
```

| Route | Description |
|---|---|
| `/auth` | Authentication |
| `/users` | User management |
| `/organizations` | Organization management |
| `/memberships` | Membership management |
| `/api-keys` | API key issuance and validation |
| `/analytics` | Usage analytics |
| `/billing` | Stripe billing |
| `/billing/webhook` | Stripe webhooks |
| `/payments` | Payment records |
| `/notifications` | Notifications |
| `/bookings` | Booking management |
| `/customers` | Customer records |
| `/health` | Health checks |
| `/integrations` | Third-party integrations |
| `/ai` | AWS Bedrock inference |

---

## Health Checks

| Endpoint | Description |
|---|---|
| `GET /api/v1/health/live` | Liveness probe |
| `GET /api/v1/health/ready` | Readiness probe (DB + Redis) |

---

## Plan Limits

| Plan | Monthly Requests |
|---|---|
| Starter | 1,000 |
| Growth | 10,000 |
| Business | 100,000 |
| Enterprise | Unlimited |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run production build |
| `npm run db:seed` | Seed database |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:generate` | Generate Prisma client |

---

## CI/CD

GitHub Actions workflows included:

### `ci.yml`

Runs on:
- push
- pull requests

Pipeline:
- installs dependencies
- generates Prisma client
- type-checks TypeScript

### `release.yml`

Runs on:
- push to `main`

Pipeline:
- builds Docker image
- publishes image to GHCR
- deploys staging environment

---

## Deployment

### Container Registry

Production images are published to:

```txt
ghcr.io/ventryx-technologies/operra-api
```

### Staging

A dedicated staging overlay exists:

```txt
docker-compose.staging.yml
```

Run staging deployment:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.staging.yml \
  up -d
```

---

## Security Notes

- Never commit `.env` files or production secrets
- Use `.env.example` as the environment template
- Rotate secrets immediately if exposed
- Production deployments should use managed secret storage
- API keys are hashed before persistence
- Stripe webhooks are signature verified

---

## License

Copyright © 2026 Ventryx Technologies LLC

All rights reserved.

This software and associated documentation files are proprietary and confidential.
Unauthorized copying, modification, distribution, or use is prohibited.
