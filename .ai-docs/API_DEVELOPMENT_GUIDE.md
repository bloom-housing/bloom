# Bloom API - Development Reference Guide

## Quick Overview

**Backend Stack**: NestJS + TypeScript + Prisma ORM + PostgreSQL

**Architecture Pattern**: Layered modular architecture with clear separation of concerns from HTTP layer → Services → Data Access

---

## Directory Structure

```
api/src/
├── controllers/           # HTTP request handlers (thin, delegate to services)
├── services/             # Business logic & database interaction
├── dtos/                 # Data Transfer Objects (request/response validation)
├── decorators/           # Custom NestJS decorators
├── guards/               # Authentication & authorization middleware
├── interceptors/         # Cross-cutting concerns (logging, error handling)
├── pipes/                # Validation pipelines
├── filters/              # Global exception handling
├── modules/              # Feature modules (ApplicationModule, UserModule, etc)
├── types/                # TypeScript interfaces & custom types
├── enums/                # Enumerations for constants
├── utilities/            # Helper functions & utils
├── views/                # Prisma view definitions
├── validation-pipes/     # Custom validation logic
├── permission-configs/   # RBAC configuration
├── passports/            # Passport.js strategies (JWT, API key, etc)
└── main.ts              # Application entry point
```

---

## Core Design Patterns

### 1. **Layered Architecture**

```
Request → Controller (thin)
    ↓
Service (business logic)
    ↓
Prisma Client (type-safe queries)
    ↓
PostgreSQL (data persistence)
```

**Controllers**: Validate input → delegate to service → return DTO
**Services**: Implement business logic → call Prisma → return domain models
**Prisma**: Type-safe ORM → handle database operations

---

### 2. **Modular Organization**

Each feature is self-contained.

---

### 3. **Dependency Injection (DI) via NestJS**

NestJS automatically wires dependencies. Register in module `providers: [ServicName]`

---

### 4. **DTO-Based Validation**

Data Transfer Objects ensure type safety and validation:

---

### 5. **Guard & Decorator Pattern for Authorization**

Guards check if user is authenticated.
Decorators set permission context.
Custom decorators reduce boilerplate:

---

### 6. **Service Composition**

Services compose other services to avoid duplication.

---

## Key Components

### **Prisma Service**
- Singleton instance of Prisma client
- Handles all database queries
- Provides type-safe queries
- Query return types auto-inferred from schema


### **Controllers**
- Single responsibility: parse HTTP request → call service → return DTO
- Use decorators: `@Get()`, `@Post()`, `@Param()`, `@Body()`, `@Query()`
- Minimal business logic


### **Services**
- Contain all business logic
- Reusable across controllers
- Interact with Prisma
- Compose other services

Common service methods:
- `create()` / `update()` / `delete()`
- `findOne()` / `findMany()`
- `export()` / `validate()`
- Domain-specific methods (e.g., `detectDuplicates()`, `calculateEligibility()`)

## Data Access Patterns

### **Prisma Views**

Views optimize queries by pre-selecting fields:

```typescript
// In schema.prisma
model Application {
  id String @id
  firstName String
  email String
  // ...
  
  @@map("applications")
}

view ApplicationBase {
  id String
  firstName String
  email String
  @@map("application_base")
}

view ApplicationDetails {
  id String
  firstName String
  email String
  // ... all fields
  @@map("application_details")
}
```

**Usage**:
```typescript
// Get minimal fields
const summary = await this.prisma.applicationBase.findMany();

// Get full details
const full = await this.prisma.applicationDetails.findUnique({...});
```

### **Query Patterns**

```typescript
// Create with nested data
await this.prisma.application.create({
  data: {
    firstName: 'John',
    addresses: { create: [{...}] },
    answers: { create: [{...}] }
  },
  include: { addresses: true, answers: true }
});

// Update with conditions
await this.prisma.application.updateMany({
  where: { submittedAt: null },
  data: { reviewStatus: 'PENDING' }
});

// Find with complex filters
await this.prisma.application.findMany({
  where: {
    AND: [
      { jurisdictionId: jurisdictionId },
      { submittedAt: { not: null } }
    ]
  },
  orderBy: { createdAt: 'desc' },
  take: 50,
  skip: 0
});
```

---

## Service Responsibilities by Domain

| Service | Key Methods |
|---------|-----------|
| **ApplicationService** | create(), findOne(), findMany(), update(), export(), detectDuplicates() |
| **UserService** | create(), findOne(), updatePassword(), resetPassword() |
| **ListingService** | create(), findMany(), getAvailable(), geoCode() |
| **EmailService** | send(), getTemplate(), renderTemplate() |
| **PermissionService** | checkAccess(), hasPermission(), getAccessLevel() |
| **FeatureFlagService** | isEnabled(), getValue() |
| **CsvExportService** | export(), maskPII() |

---

## Common Code Patterns

### **Error Handling**

```typescript
import { BadRequestException, NotFoundException } from '@nestjs/common';

async getOne(id: string) {
  const app = await this.prisma.application.findUnique({ where: { id } });
  if (!app) throw new NotFoundException('Application not found');
  return app;
}
```

### **Permission Checking**

```typescript
async updateApplication(id: string, dto: UpdateDto, user: User) {
  // Check permissions before proceeding
  const permissions = await this.permissionService.getUserPermissions(user, id);
  if (!permissions.includes('application:write')) {
    throw new ForbiddenException();
  }
  return this.prisma.application.update({...});
}
```

### **Async/Await with Transactions**

```typescript
async submitApplication(id: string, user: User) {
  // Prisma transactions ensure atomic operations
  return await this.prisma.$transaction(async (tx) => {
    const app = await tx.application.update({
      where: { id },
      data: { status: 'SUBMITTED', submittedAt: new Date() }
    });
    
    await tx.activityLog.create({
      data: { applicationId: id, action: 'SUBMITTED', user: user.id }
    });
    
    return app;
  });
}
```

---

## Type Safety Best Practices

- Use **DTOs** for request/response validation
- Leverage **Prisma's generated types** (`@prisma/client`)
- Create **custom types** for domain concepts:

```typescript
type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED';
type PermissionAction = 'READ' | 'WRITE' | 'DELETE';
type UserRole = 'APPLICANT' | 'PARTNER' | 'ADMIN';
```

- Avoid `any`; use `unknown` or specific types:

```typescript
// Avoid
function process(data: any) { }

// Prefer
function process(data: Application | CreateApplicationDto) { }
```

---

## Testing Structure

Tests follow the code structure:

```
api/test/
├── unit/                 # Service/utility tests (no DB)
│   ├── application.service.spec.ts
│   └── ...
└── integration/          # Full E2E tests (with DB)
    ├── application.e2e.spec.ts
    └── ...
```

**Jest config**: `api/jest.config.js`

---

## Configuration & Secrets

**Never hardcode secrets**. Use environment variables:

```typescript
// ✅ Correct
const apiKey = process.env.EXTERNAL_API_KEY;

// ❌ Wrong
const apiKey = 'sk-1234567890';  // Never!
```

---

## Performance Considerations

1. **Selective Queries**: Use views to fetch only needed fields
2. **Pagination**: Use `take` and `skip` for large datasets
3. **Caching**: Cache frequently accessed data (feature flags, jurisdictions)
4. **N+1 Prevention**: Use `include` in Prisma to avoid multiple queries
5. **Indexing**: Database indexes on frequently filtered columns

```typescript
// ❌ N+1 Query Problem
const apps = await this.prisma.application.findMany();
for (const app of apps) {
  const user = await this.prisma.user.findUnique({ where: { id: app.userId } });
}

// ✅ Solution: Use include
const apps = await this.prisma.application.findMany({
  include: { user: true }  // Single query
});
```

---

## Summary

**Key Takeaways for Development**:
- Controllers are **thin** — they validate and delegate
- Services contain **all business logic**
- Use **DTOs** for validation; Prisma types for data models
- Leverage **composition** over inheritance
- Apply **guards & interceptors** for cross-cutting concerns
- Write **type-safe** code; avoid `any`
- Always check **permissions** before data access
- Use **transactions** for atomic operations
- Query efficiently with **views and selective includes**
