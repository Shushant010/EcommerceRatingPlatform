# ReviewHub - E-commerce Rating & Review Platform

## Overview

ReviewHub is a full-stack e-commerce review platform that allows users to browse products and submit reviews. The application consists of a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database using Drizzle ORM. The platform focuses on providing a clean, modern interface for product discovery and community-driven reviews.

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

## Deployment Strategy

The application is configured for Replit deployment with:
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds client, ESBuild bundles server
- **Database**: Environment variable `DATABASE_URL` for connection
- **Port Configuration**: Server runs on port 5000, exposed on port 80
- **Static Assets**: Built frontend served from `/dist/public`

The build process creates a production-ready Node.js server that serves both the API and static frontend files, making it suitable for single-instance deployment.

## Changelog
```
Changelog:
- June 16, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```