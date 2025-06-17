# ReviewHub - E-commerce Rating & Review Platform

## Overview

ReviewHub is a full-stack e-commerce review platform that allows users to browse products and submit reviews. The application consists of a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database using Drizzle ORM. The platform focuses on providing a clean, modern interface for product discovery and community-driven reviews.



# E-commerce Rating & Review System

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Running the Application](#running-the-application)
4. [Database Schema & ER Diagram](#database-schema--er-diagram)
5. [API Endpoints](#api-endpoints)

---

## Prerequisites

* Node.js v16+ (or latest LTS)
* npm or yarn
* PostgreSQL v12+ (or compatible)
* Git

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce-rating-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install server dependencies**

   ```bash
   npm install @neondatabase/serverless drizzle-orm ws
   npm install --save-dev typescript cross-env tsx
   ```

4. **Generate database types**

   ```bash
   npx tsc db.ts  # compile Zod/Drizzle schema to TS types
   ```

5. **Configure environment**

   * Copy `.env.example` to `.env`
   * Fill in your database URL and any secrets:

     ```ini
     DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
     NODE_ENV=development
     ```

6. **Install cross-env globally (optional)**

   ```bash
   npm install -g cross-env
   ```

---

## Running the Application

From the **root** directory, start the server with:

```bash
npx cross-env NODE_ENV=development tsx server/index.ts
```

* Server runs at `http://localhost:5000`
* Live reload via `tsx`
  (via `tsx`)

---

From the **root** directory:

```bash
npm run dev
```

This will:

* Start the server on `http://localhost:5000`
* Watch for file changes

---

## Database Schema & ER Diagram

### Tables & Columns

```sql
-- Users\CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Products\CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Reviews\CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  rating INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
```

### ER Diagram (ASCII)

```
+---------+       +-----------+       +--------+
|  users  | 1   ⎯<|  reviews  |>⎯   1| products|
+---------+       +-----------+       +--------+
| id      |       | id        |       | id     |
| username|       | user_id   |       | name   |
| email   |       | product_id|       | ...    |
| ...     |       | rating    |       +--------+
+---------+       | title     |
                  | content   |
                  +-----------+
```

---

## API Endpoints

* **Auth**

  * `POST /api/auth/register` — Create account
  * `POST /api/auth/login` — Sign in

* **Products**

  * `GET /api/products` — List all products with stats
  * `GET /api/products/:id` — Get product details + reviews

* **Reviews**

  * `POST /api/reviews` — Submit a review
  * `GET /api/products/:id/reviews` — List reviews for product
  * `GET /api/reviews/check?userId=&productId=` — Check if user reviewed

---

## Testing the Application

### 1. Unit & Integration Tests (if configured)

If you have Jest (or another test runner) set up, run:

```bash
npm run test
```

This will execute your test suite, covering:

* API endpoint responses
* Schema validation with Zod
* Database functions (using a test database or in-memory)

### 2. Manual API Testing with Postman or cURL

#### a) **Register a new user**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "username": "testuser", "email": "test@example.com", "password": "secret123" }'
```

#### b) **Login with that user**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "test@example.com", "password": "secret123" }'
```

#### c) **Fetch products**

```bash
curl http://localhost:5000/api/products
```

#### d) **Submit a review**

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{ "userId": 1, "productId": 1, "rating": 5, "title": "Great!", "content": "Loved it." }'
```

---

## Changelog
```
Changelog:
- June 16, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React + TypeScript with Vite build tool
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Authentication**: Simple email/password with localStorage persistence

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for lightweight client-side routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query for server state, React Context for auth
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **API Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL via Neon serverless
- **Data Validation**: Zod schemas for request validation
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with tsx, Vite middleware integration

### Database Schema
Three main entities with clear relationships:
- **Users**: Authentication and profile information
- **Products**: Product catalog with details and images
- **Reviews**: User reviews with ratings, linked to users and products
- Unique constraint prevents multiple reviews per user per product

## Data Flow

1. **Product Display**: Home page fetches all products with aggregated rating data
2. **Product Details**: Individual product pages show detailed info and reviews
3. **Authentication**: Modal-based login/register flow with localStorage persistence
4. **Review Submission**: Authenticated users can submit one review per product
5. **Real-time Updates**: TanStack Query invalidation keeps data fresh

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Uses `@neondatabase/serverless` with WebSocket support

### UI/UX Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Date-fns**: Date formatting utilities
- **Embla Carousel**: Carousel component (prepared for future use)

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Server-side bundling for production
- **Drizzle Kit**: Database migrations and schema management
