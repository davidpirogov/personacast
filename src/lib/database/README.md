# Database Base Adapter Pattern

This folder contains the implementation of a base adapter pattern for database operations. The pattern reduces code duplication across adapter implementations by providing a common base class for standard CRUD operations.

## Structure

- `base/base-adapter.ts`: Abstract base adapter that implements common CRUD operations
- `base/id-adapter.ts`: Concrete implementation for entities with numeric IDs
- `base/uuid-adapter.ts`: Concrete implementation for entities with string/UUID IDs
- `adapters/`: Specific adapter implementations for each database model

## Adapter Migration Status

All adapters have been migrated to use the base adapter pattern:

1. **ID-based Adapters** (extending `IdAdapter<T>`):
   - `PodcastsAdapter`
   - `EpisodesAdapter`
   - `MenuItemsAdapter`
   - `HeroImagesAdapter`
   - `ApiClientsAdapter`
   - `VariablesAdapter`

2. **UUID-based Adapters** (extending `UuidAdapter<T>`):
   - `UsersAdapter`
   - `AccountsAdapter`
   - `FilesAdapter`

## How to Use

### 1. Create a new adapter by extending the appropriate base adapter

For entities with numeric IDs:

```typescript
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { YourModel } from "@/lib/database/types/models.d";
import { YourModelAdapterType } from "@/lib/database/types/adapters.d";

class YourModelAdapter extends IdAdapter<YourModel> implements YourModelAdapterType {
    constructor() {
        super("yourModelPrismaName");
    }
    
    // Add specialized methods here
}

export default YourModelAdapter;
```

For entities with UUID/string IDs:

```typescript
import { UuidAdapter } from "@/lib/database/base/uuid-adapter";
import { YourModel } from "@/lib/database/types/models.d";
import { YourModelAdapterType } from "@/lib/database/types/adapters.d";

class YourModelAdapter extends UuidAdapter<YourModel> implements YourModelAdapterType {
    constructor() {
        super("yourModelPrismaName");
    }
    
    // Add specialized methods here
}

export default YourModelAdapter;
```

### 2. Override base methods as needed

You can override any of the base methods to customize behavior:

```typescript
async create(
    data: Omit<YourModel, "id" | "createdAt" | "updatedAt">,
    tx?: Prisma.TransactionClient,
): Promise<YourModel> {
    // Your custom implementation
    const client = tx || db;
    const modelClient = this.getModelClient(client);
    
    // Pre-process data
    const { specialField, ...createData } = data;
    
    // Use base method's helpers
    const preparedData = this.prepareCreateData(createData);
    
    // Custom logic
    // ...
    
    return await modelClient.create({
        data: preparedData
    }) as YourModel;
}
```

### 3. Add specialized methods

```typescript
async findBySpecialField(value: string, tx?: Prisma.TransactionClient): Promise<YourModel | null> {
    const client = tx || db;
    const modelClient = this.getModelClient(client);
    
    return await modelClient.findUnique({
        where: { specialField: value }
    }) as YourModel | null;
}
```

## Design Patterns Used

1. **Template Method Pattern**: The base adapter provides a template for CRUD operations that can be extended or overridden by subclasses.
2. **Strategy Pattern**: Different strategies (ID vs UUID) are encapsulated in separate adapter classes.
3. **Adapter Pattern**: Adapts the Prisma client interface to our application's domain models.

## Benefits

- Reduces code duplication across adapters
- Ensures consistent handling of transactions and timestamps
- Makes adding new adapters simpler and less error-prone
- Allows specialized logic where needed through method overriding
- Maintains type safety throughout the codebase
- Centralizes common error handling and validation logic 