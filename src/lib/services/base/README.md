# Service Base Pattern

This directory contains the implementation of a base service pattern that parallels the database adapter pattern. The pattern reduces code duplication across service implementations by providing common base classes for standard CRUD operations.

## Structure

- `services.d.ts`: Core service interfaces that define common operations
- `base-service.ts`: Abstract base service that implements common CRUD operations
- `id-service.ts`: Concrete service for entities with numeric IDs
- `uuid-service.ts`: Concrete service for entities with string/UUID IDs
- `service-factory.ts`: Factory functions for creating services
- `examples/`: Example implementations using the base pattern

## Architecture

The service layer follows a consistent pattern to facilitate maintainability, extensibility, and type safety. The architecture is built on these core components:

### Entity Types

Services are categorized based on the primary key type of their entities:

- **ID-based entities**: Use `IdService` as base class for entities with numeric primary keys
- **UUID-based entities**: Use `UuidService` as base class for entities with string/UUID primary keys

### Service Interfaces

Service interfaces define the contract that implementations must fulfill. They extend base interfaces:

- `CRUDService<T>`: Base interface for any entity type
- `IdCRUDService<T>`: Interface for ID-based entities
- `UuidCRUDService<T>`: Interface for UUID-based entities

These interfaces ensure consistent method signatures across all services while allowing for specialized methods.

### Service Implementations

Service implementations extend abstract base classes that handle common CRUD operations:

- `BaseService<T>`: Abstract base class for any entity type
- `IdService<T>`: Concrete implementation for ID-based entities
- `UuidService<T>`: Concrete implementation for UUID-based entities

## Adding a New Service

### 1. Define the Service Interface

Create a service interface that extends the appropriate base service type:

```typescript
import { ApiClient } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface ApiClientService extends IdCRUDService<ApiClient> {
    // Add specialized methods
    generateToken(id: number): Promise<string>;
}
```

### 2. Implement the Service

Create a service implementation that extends the appropriate base service class:

```typescript
import { ApiClient } from "@/lib/database/types/models.d";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";
import { IdService } from "@/lib/services/base/id-service";
import crypto from "crypto";

class DefaultApiClientService extends IdService<ApiClient> implements ApiClientService {
    constructor() {
        // Pass the adapter to the base class
        super(new ApiClientsAdapter());
    }

    // Override methods as needed
    async create(data: Omit<ApiClient, "id" | "createdAt" | "updatedAt">): Promise<ApiClient> {
        const token = await this.generateToken(0);
        return super.create({
            ...data,
            token,
        });
    }

    // Add specialized methods
    async generateToken(id: number): Promise<string> {
        return crypto.randomBytes(32).toString("hex");
    }
}
```

### 3. Export a Singleton Instance

Export a singleton instance of your service:

```typescript
// Export a singleton instance
export const apiClientService = new DefaultApiClientService();
```

## Simplified Service Creation

For services that don't require specialized methods, you can use the factory functions:

```typescript
import { createIdService } from "@/lib/services/base";
import { ApiClient } from "@/lib/database/types/models.d";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";

// Create and export the service
export const apiClientService = createIdService<ApiClient>(new ApiClientsAdapter());
```

## Design Patterns

The service base pattern leverages several design patterns to achieve its goals:

### 1. Template Method Pattern

The base service classes (`BaseService`, `IdService`, `UuidService`) provide template implementations for CRUD operations that can be extended or overridden by subclasses. This ensures consistent behavior while allowing for customization.

### 2. Strategy Pattern

Different strategies for handling entities (ID vs UUID) are encapsulated in separate service classes. This allows for specialized handling of entity types without duplicating code.

### 3. Factory Pattern

Factory functions (`createIdService`, `createUuidService`) provide a simplified way to create services without needing to implement a full class when no custom logic is required.

### 4. Singleton Pattern

Services are typically exported as singleton instances, ensuring a single point of truth for service operations throughout the application.

### 5. Adapter Pattern

The service layer works with database adapters to abstract away data access details, allowing the service to focus on business logic.

## Benefits

The service base pattern provides several advantages:

- **Reduced code duplication**: Common CRUD operations are implemented once in base classes
- **Consistent behavior**: All services handle CRUD operations in a uniform way
- **Type safety**: Proper typing for different entity types throughout the codebase
- **Clear separation of concerns**: Services focus on business logic, adapters handle data access
- **Simplified creation**: Factory functions for services that don't need custom logic
- **Specialized logic where needed**: Custom methods and overrides for specific business requirements
- **Reduced boilerplate**: No need to implement standard CRUD methods in each service
- **Easier maintenance**: Focus on business logic instead of repetitive CRUD code
- **Enhanced extensibility**: New services can be added quickly and consistently
