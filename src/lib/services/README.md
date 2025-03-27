# Service Layer Architecture

This document outlines the service architecture used throughout the application and provides guidance on implementing new services that conform to the established patterns.

## Overview

The service layer provides a consistent interface for business logic operations, abstracting away data access details while enforcing type safety through TypeScript. Services implement the Repository pattern, with base classes handling common CRUD operations and specialized methods added as needed.

## Core Architecture

### Base Service Classes

Our architecture includes a hierarchy of abstract base services:

```
Service (base interface)
├── CRUDService (interface)
│   ├── IdCRUDService (interface for numeric IDs)
│   └── UuidCRUDService (interface for string UUIDs)
└── CustomService (utility services without CRUD)
```

**Implementation Classes:**
- `IdService` - Implements `IdCRUDService` for entities with numeric IDs
- `UuidService` - Implements `UuidCRUDService` for entities with string UUIDs

### Base Service Interfaces

The base interfaces provide standard CRUD operations with appropriate typing:

```typescript
// Base service interface
export interface Service<T> {
    list(): Promise<T[]>;
    get(id: any): Promise<T | null>;
}

// CRUD service interface
export interface CRUDService<T> extends Service<T> {
    create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
    update(id: any, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T>;
    delete(id: any): Promise<void>;
}

// ID-based CRUD service
export interface IdCRUDService<T> extends CRUDService<T> {
    get(id: number): Promise<T | null>;
    update(id: number, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T>;
    delete(id: number): Promise<void>;
}

// UUID-based CRUD service
export interface UuidCRUDService<T> extends CRUDService<T> {
    get(id: string): Promise<T | null>;
    update(id: string, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T>;
    delete(id: string): Promise<void>;
}
```

### Adapter Integration

Services use database adapters to handle data persistence:

```typescript
class IdService<T> implements IdCRUDService<T> {
    protected adapter: IdAdapterType<T>;
    
    constructor(adapter: IdAdapterType<T>) {
        this.adapter = adapter;
    }
    
    async list(): Promise<T[]> {
        return this.adapter.getAll();
    }
    
    async get(id: number): Promise<T | null> {
        return this.adapter.getById(id);
    }
    
    // Other CRUD methods...
}
```

### Directory Structure

Services follow this file structure:
- `example-service.d.ts` - Interface and type definitions
- `example-service.ts` - Implementation

## Creating a New Service

### 1. Identify Service Type

Determine which type of service you need:

| Service Type | Use Case | Base Class |
|--------------|----------|------------|
| ID-based | Entity with numeric primary key | `IdService` |
| UUID-based | Entity with string UUID primary key | `UuidService` |
| Utility | No database entity, specialized functions | None (custom implementation) |

### 2. Create the Interface File

Create a new file named `your-service.d.ts`:

```typescript
// For ID-based entity
import { YourEntity } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface YourEntityService extends IdCRUDService<YourEntity> {
    // Add specialized methods here
    specialMethod(param: Type): Promise<ReturnType>;
}

// For UUID-based entity
import { YourEntity } from "@/lib/database/types/models.d";
import { UuidCRUDService } from "@/lib/services/base/services.d";

export interface YourEntityService extends UuidCRUDService<YourEntity> {
    // Add specialized methods here
    specialMethod(param: Type): Promise<ReturnType>;
}

// For utility service
export interface YourUtilityService {
    methodOne(param: Type): Promise<ReturnType>;
    methodTwo(param: Type): Promise<ReturnType>;
}
```

### 3. Implement the Service

Create a new file named `your-service.ts`:

```typescript
// For ID-based entity
import { YourEntity } from "@/lib/database/types/models.d";
import YourEntityAdapter from "@/lib/database/adapters/your-entity";
import { YourEntityService } from "./your-service.d";
import { IdService } from "./base";

class YourEntityServiceImpl extends IdService<YourEntity> implements YourEntityService {
    constructor() {
        super(new YourEntityAdapter());
    }

    async specialMethod(param: Type): Promise<ReturnType> {
        // Implementation
    }
}

// For UUID-based entity
import { YourEntity } from "@/lib/database/types/models.d";
import YourEntityAdapter from "@/lib/database/adapters/your-entity";
import { YourEntityService } from "./your-service.d";
import { UuidService } from "./base";

class YourEntityServiceImpl extends UuidService<YourEntity> implements YourEntityService {
    constructor() {
        super(new YourEntityAdapter());
    }

    async specialMethod(param: Type): Promise<ReturnType> {
        // Implementation
    }
}

// For utility service
import { YourUtilityService } from "./your-service.d";

class YourUtilityServiceImpl implements YourUtilityService {
    async methodOne(param: Type): Promise<ReturnType> {
        // Implementation
    }

    async methodTwo(param: Type): Promise<ReturnType> {
        // Implementation
    }
}

// Export a singleton instance
export const yourEntityService = new YourEntityServiceImpl();

// Export the interface for better type inference
export type { YourEntityService };
```

## Service Dependencies

Services often depend on other services. To avoid circular dependencies:

1. **Import Order**: Import services in a consistent order
2. **Dependency Injection**: Consider injecting dependencies in the constructor for better testability
3. **Facade Pattern**: For complex interdependencies, consider a facade service

Example of service with dependencies:

```typescript
import { IdService } from "./base";
import { filesService } from "./files";
import { OtherDependencyService } from "./other-dependency";

class EntityServiceImpl extends IdService<Entity> implements EntityService {
    constructor() {
        super(new EntityAdapter());
    }
    
    async specialMethod(id: number): Promise<ReturnType> {
        // Use other services
        const file = await filesService.get(fileId);
        const otherData = await OtherDependencyService.getData(id);
        
        // Process data
        return processedResult;
    }
}
```

## Best Practices

### Naming Conventions

- Interface: `EntityNameService`
- Implementation: `EntityNameServiceImpl`
- Filename: `entity-name.ts` and `entity-name.d.ts`
- Export variable: `entityNameService` (camelCase)

### Implementation Guidelines

1. **Separation of Concerns:**
   - Keep business logic in services
   - Data access through adapters
   - Validation using schemas

2. **Method Implementation:**
   - Override base methods only when necessary
   - Extend with specialized methods as needed
   - Document complex methods with JSDoc

3. **Error Handling:**
   - Use appropriate error types
   - Log errors at appropriate levels
   - Provide clear error messages

4. **Testing:**
   - Create unit tests for all services
   - Mock dependencies for isolated testing
   - Test edge cases and error conditions

5. **Transactions:**
   - For operations that affect multiple entities, consider using transactions
   - Handle rollback in case of errors

## Examples

### ID-based Service (Hero Image Service)

```typescript
// hero-images.d.ts
import { HeroImage } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface HeroImageService extends IdCRUDService<HeroImage> {
    getByFileId(fileId: string): Promise<HeroImage | null>;
    prepareHeroImageFiles(heroImage: HeroImage): Promise<OptimizedHeroImage>;
}

// hero-images.ts
class HeroImageServiceImpl extends IdService<HeroImage> implements HeroImageService {
    constructor() {
        super(new HeroImagesAdapter());
    }
    
    async getByFileId(fileId: string): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.fileId === fileId) || null;
    }
}

export const heroImageService = new HeroImageServiceImpl();
```

### UUID-based Service (File Metadata Service)

```typescript
// files.d.ts
import { FileMetadata } from "@/lib/database/types/models.d";
import { UuidCRUDService } from "@/lib/services/base/services.d";

export interface FileMetadataService extends UuidCRUDService<FileMetadata> {
    upload(file: File): Promise<FileMetadata>;
    getByName(name: string): Promise<FileMetadata | null>;
}

// files.ts
class FileMetadataServiceImpl extends UuidService<FileMetadata> implements FileMetadataService {
    constructor() {
        super(new FilesAdapter());
    }
    
    async upload(file: File): Promise<FileMetadata> {
        // Implementation
    }
}

export const filesService = new FileMetadataServiceImpl();
```

### Utility Service (Favicon Service)

```typescript
// favicons.d.ts
export interface FaviconService {
    updateManifest(settings: SiteSettings): Promise<void>;
    syncWithSiteSettings(): Promise<void>;
}

// favicons.ts
class FaviconServiceImpl implements FaviconService {
    async updateManifest(settings: SiteSettings): Promise<void> {
        // Implementation
    }
    
    async syncWithSiteSettings(): Promise<void> {
        // Implementation
    }
}

export const faviconService = new FaviconServiceImpl();
```

### Service with Custom CRUD Logic

To override base CRUD methods:

```typescript
class CustomEntityServiceImpl extends IdService<Entity> implements CustomEntityService {
    constructor() {
        super(new EntityAdapter());
    }
    
    // Override create method to add custom logic
    async create(data: Omit<Entity, "id" | "createdAt" | "updatedAt">): Promise<Entity> {
        // Custom pre-processing
        const processedData = this.preProcessData(data);
        
        // Call the parent implementation
        const entity = await super.create(processedData);
        
        // Custom post-processing
        await this.postProcessEntity(entity);
        
        return entity;
    }
}
```

## Benefits of This Architecture

1. **Consistency:** Standardized implementation across all services
2. **Code Reduction:** Base classes eliminate duplication of CRUD operations
3. **Type Safety:** Generic typing ensures type safety throughout the codebase
4. **Maintainability:** Centralized logic in base classes
5. **Extensibility:** Easy to extend with specialized methods
6. **Testability:** Services can be easily mocked and tested in isolation

## Common Pitfalls

1. **Circular Dependencies:** Avoid circular imports between services
2. **Over-specialization:** Don't add methods that belong in other services
3. **Type Errors:** Ensure entity types match between interface and implementation
4. **Singleton Misuse:** Don't create multiple instances of services
5. **Not Using Base Classes:** Always extend from the appropriate base class
6. **Business Logic in Adapters:** Keep business logic in services, not adapters

## Using Services in Your Application

Services are designed to be used in server-side contexts, particularly in:
- Server Components
- Server Actions
- API Routes
- Backend utilities

### In Server Components

```tsx
// In a React Server Component (RSC)
import { podcastService } from "@/lib/services/podcasts";

export default async function PodcastList() {
  // Fetch data directly in the component
  const podcasts = await podcastService.list();
  
  return (
    <div>
      <h1>Podcasts</h1>
      <ul>
        {podcasts.map(podcast => (
          <li key={podcast.id}>{podcast.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### In Server Actions

```tsx
// In a server action file (e.g., src/actions/podcasts.ts)
"use server";

import { podcastService } from "@/lib/services/podcasts";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for validation
const podcastSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function createPodcast(formData: FormData) {
  // Validate input
  const validatedFields = podcastSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  
  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }
  
  try {
    // Create podcast using the service
    const podcast = await podcastService.create(validatedFields.data);
    
    // Revalidate the page cache
    revalidatePath("/podcasts");
    
    return { success: true, podcast };
  } catch (error) {
    console.error("Failed to create podcast:", error);
    return { error: "Failed to create podcast" };
  }
}
```

### In API Routes

```tsx
// In an API route handler (e.g., src/app/api/podcasts/route.ts)
import { podcastService } from "@/lib/services/podcasts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const podcasts = await podcastService.list();
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Failed to fetch podcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcasts" },
      { status: 500 }
    );
  }
}
```

### Service Composition

For complex operations that involve multiple services, compose them in a higher-level function:

```typescript
// In a utility function (e.g., src/lib/utils/podcast-utils.ts)
import { podcastService } from "@/lib/services/podcasts";
import { episodeService } from "@/lib/services/episodes";
import { heroImageService } from "@/lib/services/hero-images";

export async function getPodcastWithEpisodesAndImages(podcastId: number) {
  // Fetch podcast
  const podcast = await podcastService.get(podcastId);
  if (!podcast) {
    return null;
  }
  
  // Fetch episodes for this podcast
  const episodes = await episodeService.getByPodcastId(podcastId);
  
  // Fetch hero image
  const heroImage = await heroImageService.getByPodcastId(podcastId);
  
  // Combine the data
  return {
    ...podcast,
    episodes,
    heroImage,
  };
}
``` 