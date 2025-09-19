# Overview

CraftHub is an AI-powered artisan marketplace that connects local artisans with buyers. The platform allows artisans to upload products with AI assistance for pricing suggestions, marketing content, and storytelling. It features a full-stack web application with React frontend and Express backend, utilizing PostgreSQL for data persistence and OpenAI for AI-powered features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and build tooling
- **Routing**: Wouter for client-side routing with authentication-based route protection
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling
- **Form Management**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Authentication**: Replit Auth integration with session-based authentication using PostgreSQL session store
- **File Uploads**: Multer middleware for handling product image uploads with local storage
- **API Structure**: RESTful API design with route-based organization

## Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript
- **Key Tables**: 
  - Users (integrated with Replit Auth requirements)
  - Products with artisan relationships and image storage
  - Categories for product organization
  - Inquiries for buyer-artisan communication
  - Reviews and favorites for social features
  - Sessions table (required for Replit Auth)

## Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Authorization**: Route-level protection with authentication middleware
- **User Management**: Automatic user creation and profile management through Replit Auth flow

## AI Integration Architecture
- **Provider**: OpenAI API with GPT-5 model for content generation
- **Features**:
  - Pricing suggestions based on product details and market analysis
  - Marketing content generation (SEO titles, social captions, product descriptions)
  - Artisan story enhancement and craftsmanship storytelling
  - Product image analysis for automated descriptions
- **Implementation**: Dedicated OpenAI service layer with structured response types

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Authentication**: Replit Auth service for user authentication and session management
- **AI Services**: OpenAI API for content generation and product analysis

## Development & Deployment
- **Build System**: Vite for frontend development with React plugin and TypeScript support
- **Package Management**: NPM with lockfile for dependency management
- **Development Tools**: TSX for TypeScript execution, ESBuild for backend bundling
- **Replit Integration**: Replit-specific plugins for development banner and error handling

## UI & Styling
- **Component Library**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS with custom configuration and CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, Playfair Display, Dancing Script)

## File Handling
- **Upload Processing**: Multer for multipart form handling and file validation
- **Storage**: Local file system storage for product images (configured for prototype)