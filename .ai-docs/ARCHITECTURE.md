# Bloom Affordable Housing Platform - Architecture Analysis

**Date**: April 13, 2026  
**Project**: Bloom Core Monorepo  
**Purpose**: Document the overall system architecture, technology stack, and key components

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Technology Stack](#technology-stack)
3. [Monorepo Structure](#monorepo-structure)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Shared Utilities & Libraries](#shared-utilities--libraries)
7. [Data Layer & Database](#data-layer--database)
8. [Infrastructure & DevOps](#infrastructure--devops)
9. [Key Features](#key-features)
10. [Development Workflow](#development-workflow)

---

## High-Level Overview

The system uses a **client/server architecture** with three primary packages:
- **`api`** - NestJS REST API backend
- **`sites`** - Next.js frontend applications (public + partner)
- **`shared-helpers`** - Shared utilities and components

**Deployment Strategy**: Monorepo packages deployed independently with Heroku/cloud-native architecture. Multi-tenant support with jurisdiction-specific configurations.

---

## Technology Stack

### Core Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | NestJS + TypeScript | REST API, business logic, microservice-ready |
| **Frontend** | Next.js + TypeScript + SASS | Server-side rendering, static generation, responsive UI |
| **Database** | PostgreSQL | Primary data store |
| **ORM** | Prisma | Type-safe database access, migrations |
| **Testing** | Jest | Unit and integration tests |
| **Package Management** | Lerna.js | Monorepo management, version control |

### Supporting Libraries
- **UI**: `@bloom-housing/ui-seeds`, `@bloom-housing/ui-components`
- **Email**: Handlebars templating
- **Internationalization**: Multi-language support (10+ languages)
- **Geocoding**: Location services
- **Feature Flags**: Runtime feature management

### Infrastructure
- **Container Runtime**: Docker
- **Orchestration**: Docker Compose (development), Kubernetes (production)
- **Infrastructure as Code**: OpenTofu (Terraform fork)
- **Monitoring**: Grafana dashboards
- **CI/CD**: GitHub Actions

---

## Monorepo Structure

```
bloom-core/
├── api/                          # NestJS backend
├── sites/
│   ├── public/                   # Applicant-facing frontend
│   └── partners/                 # Landlord/admin interface
├── shared-helpers/               # Shared utilities and components
├── backend/proxy/                # Nginx proxy configuration
├── infra/                        # Infrastructure as Code (OpenTofu)
├── docs/                         # Documentation and feature flags
├── utilities/                    # Utility scripts
├── app.json                      # Heroku deployment configuration
├── lerna.json                    # Lerna workspace configuration
├── package.json                  # Root workspace dependencies
└── tsconfig.json                 # TypeScript configuration
```

---

## Backend Architecture

### Location
`api/` directory - NestJS-based REST API

### Module Design Pattern

NestJS uses a **modular architecture** where features are organized into modules. Key modules include:

#### Core Business Modules
- **ApplicationModule**: Handles applicant applications (creation, updates, status tracking)
- **ListingModule**: Manages affordable housing listings
- **UserModule**: User accounts and profile management
- **AuthModule**: Authentication and authorization
- **PermissionModule**: Role-based access control (RBAC)

#### Infrastructure Modules
- **PrismaModule**: Database connection and Prisma client initialization
- **EmailModule**: Email sending with Handlebars templating
- **CacheModule**: Redis-based caching
- **CronJobModule**: Scheduled tasks (e.g., PII deletion, status updates)
- **FeatureFlagModule**: Runtime feature toggling

#### Cross-Cutting Concerns
- **GuardsModule**: Authentication and authorization guards
- **InterceptorsModule**: Logging, error handling, request/response transformation
- **PipesModule**: Validation and transformation pipelines
- **FiltersModule**: Global exception handling

#### Root Module
- **AppModule** (`src/modules/app.module.ts`): Orchestrates all modules, establishes Swagger documentation

### Services Layer

Key services implementing business logic:

| Service | Responsibility |
|---------|-----------------|
| `ApplicationService` | Business logic for housing applications (submit, update, review, export) |
| `UserService` | User management, authentication, password reset |
| `ListingService` | Listing CRUD, availability, geocoding |
| `EmailService` | Email templating and delivery with jurisdiction customization |
| `GeocodingService` | Address validation and geocoding via external APIs |
| `PermissionService` | RBAC implementation and access control |
| `FeatureFlagService` | Feature flag evaluation at runtime |
| `CsvExportService` | Export applications with optional PII masking |

### Controllers Layer

RESTful endpoints organized by domain:
- `/applications` - Application management
- `/listings` - Listing queries and management
- `/users` - User accounts and profiles
- `/auth` - Login, password reset, token refresh
- `/accounts` - Account management (admin)

### Data Access Pattern

**Prisma Views Configuration**:
- `.base`: Minimal required fields
- `.details`: Comprehensive field set
- `.summary`: Aggregated information

This allows selective querying to optimize performance and control data exposure.

### Database Migrations

Prisma migrations located in `api/prisma/migrations/`:
- Automatic migration generation from schema changes
- Seed scripts for development (`seed.ts`, `seed-dev.ts`, `seed-staging.ts`)
- Schema definition in `api/prisma/schema.prisma`

---

## Frontend Architecture

### Application Structure

#### Public Site (`sites/public/`)
**Purpose**: Applicant-facing interface  
**Key Features**:
- Browse affordable housing listings
- Apply for listings or redirect to external applications
- User authentication and profile management
- Application status tracking
- Multi-language support

#### Partner Site (`sites/partners/`)
**Purpose**: Landlord and administrator interface  
**Key Features**:
- Create and manage listings
- Review and process applications
- Manage listing preferences and requirements
- Generate reports and exports
- Fraud detection (duplicate applications)
- User and role management

### NextJS Configuration

Both frontend applications use Next.js with:
- **Server-Side Rendering (SSR)**: Dynamic content personalization
- **Static Generation**: Performance optimization for static pages
- **API Routes**: Custom backend integration
- **Environment Variables**: Dynamic API routing based on deployment environment

**Configuration File**: `next.config.js` in each site
- Feature flag injection
- API base URL configuration
- Image optimization settings

### Styling Architecture

- **SASS/SCSS**: Component-scoped styles
- **Design System**: `@bloom-housing/ui-seeds` (typography, spacing, colors)
- **Components**: `@bloom-housing/ui-components` (reusable UI elements)
- **Responsive Design**: Mobile-first approach with breakpoints

---

## Shared Utilities & Libraries

### Location
`shared-helpers/` package - Published as `@bloom-housing/shared-helpers`


#### Internationalization
- **Supported Languages**: English, Spanish, Vietnamese, Chinese (Simplified), Filipino, Arabic, Bengali, Korean, Armenian, Farsi
- **Translation System**: JSON-based translation files
- **Dynamic Translation**: Database-stored translations for user-defined content

---

## Data Layer & Database

### Database Technology
**PostgreSQL** - Open-source relational database

### ORM: Prisma

**Schema Definition**: `api/prisma/schema.prisma`

### Seed Scripts

| Script | Purpose |
|--------|---------|
| `seed.ts` | Production seed data |
| `seed-dev.ts` | Development test data |
| `seed-staging.ts` | Staging environment data |

### Key Data Models

(Inferred from service and module structure)
- **Users**: Credentials, roles, preferences
- **Listings**: Property details, availability, preferences
- **Applications**: Applicant information, household data, answers
- **Jurisdictions**: Multi-tenant configuration
- **Translations**: User-defined string translations
- **Feature Flags**: Runtime feature toggles per jurisdiction
- **Audit Logs**: Application state changes and events

---

## Key Features

### Multi-Language Support

**Translation System**:
- 10+ languages: EN, ES, VI, ZH, TL, AR, BN, KO, HY, FA
- Database-stored translations for customization
- Automated machine translation generation: `api/scripts/generate-db-translation-sql.ts`
- Frontend language selector with persistence

**Implementation**:
- `shared-helpers/src/scripts/reformat-strings.ts`: Translation string management
- Dynamic loading based on user locale or jurisdiction settings

### Application Processing

**Duplicate Detection**: Identify applications from same person across listings or time periods

**Flagged Set Management**: Mark applications for special review (e.g., priority, waitlist)

**Data Export**: 
- CSV export with optional PII masking
- Geocoding information included
- Customizable field selection

**PII Handling**:
- Secure deletion via scheduled CronJobs
- Masking for reports and exports
- Compliance with privacy regulations (GDPR, CCPA)

### Email System

**Templating**: Handlebars-based email templates

**Customization**:
- Jurisdiction-specific templates
- Dynamic content injection (applicant name, listing details)
- Auto-responders and notifications

**Features**:
- Review order notifications
- Application status updates
- Administrative alerts

### Feature Flags

**System**: Runtime feature toggling per jurisdiction

**Use Cases**:
- A/B testing new features
- Gradual rollout of changes
- Disable features without redeployment
- Compliance-specific features per region

**Example Flags** (`docs/feature-flags/`):
- `disableAccessibilityFeaturesTag`
- `disableBuildingSelectionCriteria`
- `disableCommonApplication`
- `disableEthnicityQuestion`
- `disableJurisdictionalAdmin`
- `disableListingPreferences`

### Authentication & Authorization

**Methods**:
- Email/Password login
- Session-based authentication with JWT tokens
- Password reset flow with email verification

**Authorization**:
- Role-Based Access Control (RBAC)
- Object-level permissions (e.g., user can only see their applications)
- Decorator-based permission checking in NestJS

---

### Code Organization Best Practices

1. **Service Layer**: All business logic in services
2. **Controllers**: Thin controllers marshaling requests/responses
3. **DTOs**: Strong typing with validation schemas
4. **Guards/Pipes**: Centralized authentication and validation
5. **Shared Utilities**: Common logic in `shared-helpers`
6. **Type Safety**: Full TypeScript with strict mode enabled

---

## Security Considerations

1. **Database**: TLS encryption in transit, IP whitelisting
2. **API**: JWT authentication, CORS configuration
3. **Secrets**: Environment variables for sensitive data, never in code
4. **PII**: Automatic deletion, masking in exports
5. **Scanning**: GitLeaks for secret detection in CI/CD
6. **Dependencies**: Dependabot for vulnerability management

---

## Summary

Bloom is a sophisticated, production-ready monorepo for affordable housing management with:
- **Robust Architecture**: Modular NestJS backend, multi-site Next.js frontend
- **Enterprise Features**: Multi-language, RBAC, feature flags, audit logging
- **Cloud-Native**: Docker containers, IaC with OpenTofu, full CI/CD automation
- **Developer Experience**: Type-safe TypeScript, hot-reload, comprehensive testing
- **Scalability**: Multi-tenant design, separated deployments, event-driven patterns

The codebase follows industry best practices for maintainability, security, and performance.
