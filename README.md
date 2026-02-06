# FarmLokal Backend Assignment

## Overview
This project is a backend service built for **FarmLokal**, a hyperlocal marketplace connecting households directly with local farmers and producers.  
The system is designed with **performance, scalability, and reliability** as top priorities.

---

## Tech Stack
- Node.js (TypeScript)
- Fastify
- MySQL (Dockerized)
- Redis (Dockerized)
- Docker

---

## Architecture
- Modular folder structure (routes, controllers, services)
- Clear separation of concerns
- Redis used for caching, rate limiting, and token storage
- MySQL connection pooling for efficient database access

---

## Authentication
- OAuth2 Client Credentials flow
- Access tokens fetched from provider
- Tokens cached in Redis
- Automatic refresh on expiry
- Concurrency-safe token fetching to avoid redundant calls

---

## External API Integrations

### API A (Synchronous External API)
- Timeout handling
- Retry with exponential backoff
- Graceful failure handling

### API B (Webhook / Callback-based API)
- Callback endpoint implementation
- Redis-backed idempotency
- Safe retry & duplicate event handling

---

## Product Listing API

### Endpoint


### Features
- Cursor-based pagination
- Filtering by category and price range
- Sorting support
- Optimized for large datasets (1M+ records simulation)
- Indexed MySQL queries
- Redis caching with query-based cache keys (TTL: 60s)

---

## Performance Optimizations
- Redis response caching
- MySQL indexes
- Connection pooling
- Rate limiting (100 requests per minute per IP)

---

## Reliability
- Redis-based rate limiting
- External API retries with exponential backoff
- Webhook idempotency using Redis
- Graceful degradation on external API failures

---

## Setup Instructions

### Prerequisites
- Node.js
- Docker

---

### Run MySQL
```bash
docker run -d --name farmlokal-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=farmlokal mysql:8

docker run -d --name farmlokal-redis -p 6379:6379 redis:7

npm install
npm run dev

