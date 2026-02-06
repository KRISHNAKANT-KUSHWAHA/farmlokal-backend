🌾 FarmLokal Backend Assignment

A scalable, production-ready backend service built for FarmLokal, a hyperlocal marketplace that connects households directly with local farmers and producers.
This project focuses on performance, reliability, real-world system design, and graceful failure handling, as required by the assignment.

🚀 Live Deployment

Backend Base URL (Render)

https://farmlokal-backend-9ftd.onrender.com

🔗 API Endpoints (Live)
🛍 Products API
GET /products
GET /products?limit=10
GET /products?search=Product
GET /products?category=fruits
GET /products?category=vegetables
GET /products?sort=price&order=asc
GET /products?category=vegetables&sort=price&order=asc&limit=5

📊 Metrics
GET /metrics

🔁 Webhook
POST /webhook


Headers

x-event-id: unique-event-id
Content-Type: application/json


Body

{
  "event": "order.updated",
  "id": 123
}

🛠 Tech Stack

Node.js + TypeScript

Fastify

MySQL (Aiven Cloud)

Redis (Render Key-Value Store)

ioredis

Pino Logger

Rate Limiting

Docker (optional)

Render (Deployment)

🧱 Architecture Overview

Modular folder structure (routes, controllers, services)

Clear separation of concerns

Centralized error handling

Redis used as a best-effort cache

MySQL connection pooling

Designed to handle large datasets (1M+ records)

🔐 Authentication

OAuth2 Client Credentials Flow (mock provider)

Access tokens fetched from provider

Tokens cached in Redis

Automatic token refresh

Concurrency-safe token fetching (prevents duplicate token requests)

🌐 External API Integrations
API A – Synchronous API

Timeout handling

Retries with exponential backoff

Graceful failure handling

API B – Webhook / Callback API

Webhook endpoint implementation

Redis-backed idempotency using x-event-id

Safe retries and duplicate event protection

🛍 Product Listing API
Endpoint
GET /products

Features

Pagination

Sorting (price, name)

Searching (name / description)

Filtering (category)

Optimized SQL queries

Indexed MySQL tables

Redis caching (TTL: 60 seconds)

Example Request
GET /products?category=vegetables&sort=price&order=asc&limit=5

📊 Metrics API
Endpoint
GET /metrics

Example Response
{
  "uptime": 123.45,
  "memory": {
    "rss": 12345678,
    "heapTotal": 9876543,
    "heapUsed": 8765432
  },
  "timestamp": "2026-02-06T10:53:16.000Z"
}

🔁 Webhook Idempotency

Duplicate webhook events are detected using Redis

Events with the same x-event-id are ignored

Ensures safe retries and exactly-once processing

⚡ Performance Optimizations

Redis response caching

Query-based cache keys

MySQL indexes

Connection pooling

Rate limiting (per IP)

Minimal database queries per request

🛡 Reliability & Fault Tolerance

Redis used as non-blocking cache

Graceful fallback to MySQL when Redis is unavailable

External API retries with backoff

Webhook idempotency

Structured logging for observability

⚠ Redis Availability Note (Important)

Redis is integrated for caching, rate limiting, and idempotency.

On Render Free Key-Value, Redis instances may:

Cold-start

Temporarily refuse connections

The application is designed to gracefully degrade:

Redis failures do not crash the API

System automatically falls back to MySQL

Ensures high availability in real-world production scenarios

⚙ Environment Variables
Local Development
PORT=3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=farmlokal

REDIS_HOST=localhost
REDIS_PORT=6379

OAUTH_URL=https://mock-oauth.com/token
OAUTH_CLIENT_ID=client123
OAUTH_CLIENT_SECRET=secret123

Production (Render + Aiven MySQL)
PORT=3000

MYSQL_HOST=your-aiven-host
MYSQL_PORT=your-aiven-port
MYSQL_USER=your-aiven-user
MYSQL_PASSWORD=your-aiven-password
MYSQL_DB=defaultdb

REDIS_URL=redis://render-internal-redis-url:6379

OAUTH_URL=https://mock-oauth.com/token
OAUTH_CLIENT_ID=client123
OAUTH_CLIENT_SECRET=secret123

📁 Project Structure
src/
 ├── config/
 │   ├── db.ts
 │   ├── redis.ts
 │   └── logger.ts
 ├── modules/
 │   ├── products/
 │   ├── webhook/
 │   └── auth/
 ├── middlewares/
 ├── routes/
 ├── app.ts
 └── server.ts

🧪 Local Setup
git clone <your-github-repo>
cd farmlokal-backend
npm install
npm run dev


Server runs at:

http://localhost:3000

🐳 Docker (Optional)
docker-compose up

🚀 Deployment

Backend: Render

Database: Aiven Cloud MySQL

Cache: Render Key-Value (Redis)

Render Commands

Build

npm install && npm run build


Start

node dist/server.js

📌 Trade-offs

Mock OAuth provider used for simplicity

Simple cache invalidation strategy

Redis free-tier cold start handled via graceful degradation

👨‍💻 Author

Krishnakant Kushwaha
Backend Engineering Assignment – FarmLokal

📄 License

MIT License
