# Schema Architecture

This document outlines the schema architecture used throughout the application for data validation, transformation, and type safety.

## Overview

The schema layer provides a consistent interface for validating data throughout the application, ensuring type safety with TypeScript and runtime validation with Zod. The architecture follows a hierarchical design pattern similar to our service layer, with base schemas handling common validation patterns and specialized schemas for specific entity types.

## Core Architecture

### Base Schema Interfaces

```
BaseSchema (core interface)
├── IdSchema (for entities with numeric IDs)
└── UuidSchema (for entities with UUID/string IDs)
```

Each schema provides standard validation for:

- Full database models
- Create requests (without ID, timestamps)
- Update requests (partial fields)
- Response objects (potentially filtered)
- Response lists

### Factory Functions

Factory functions simplify schema creation:

- `createBaseSchema` - Creates a schema for any entity type
- `createIdSchema` - Creates a schema for entities with numeric IDs
- `createUuidSchema` - Creates a schema for entities with string/UUID IDs
- `createWrappers` - Creates request/response wrapper schemas

### Validation Utilities

Common validation patterns are available through:

- `stringValidators` - String validation helpers
- `numberValidators` - Number validation helpers
- `booleanValidators` - Boolean validation helpers
- `dateValidators` - Date validation helpers
- `transformers` - Data transformation utilities

## Directory Structure

Schemas follow this file structure:

- `entity-name.d.ts` - Interface and type definitions
- `entity-name.ts` - Schema implementation

## Creating a New Schema

### 1. Define Types and Interfaces

Create a new file named `your-entity.d.ts`:

```typescript
import { z } from "zod";
import { IdSchema } from "./base";

export interface YourEntity {
    id: number;
    field1: string;
    field2: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface YourEntityCreate {
    field1: string;
    field2: number;
}

export type YourEntityUpdate = Partial<YourEntityCreate>;

export interface YourEntityResponse {
    id: number;
    field1: string;
    field2: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface YourEntitySchema
    extends IdSchema<YourEntity, YourEntityCreate, YourEntityUpdate, YourEntityResponse> {}
```

### 2. Implement the Schema

Create a new file named `your-entity.ts`:

```typescript
import { z } from "zod";
import { createIdSchema, createWrappers } from "./base";
import { stringValidators, numberValidators } from "./base/schema-utils";
import { YourEntity, YourEntityCreate, YourEntitySchema, YourEntityUpdate } from "./your-entity.d";

// Base fields for validation
const yourEntityBaseFields = {
    field1: stringValidators.required("Field1 is required"),
    field2: numberValidators.positiveInt("Field2 must be a positive integer"),
};

// Create schema using factory function
export const yourEntitySchema: YourEntitySchema = createIdSchema<
    YourEntity,
    YourEntityCreate,
    YourEntityUpdate
>(yourEntityBaseFields);

// Create wrapper schemas
const wrappers = createWrappers(yourEntitySchema.response);

// Export schemas
export const schemas = {
    // Core schemas
    model: yourEntitySchema.model,
    create: yourEntitySchema.create,
    update: yourEntitySchema.update,
    response: yourEntitySchema.response,
    list: yourEntitySchema.listResponse,

    // Wrapped schemas for API endpoints
    createRequest: wrappers.requestWrapper,
    updateRequest: wrappers.requestWrapper,
    singleResponse: wrappers.responseWrapper,
    listResponse: wrappers.listResponseWrapper,
};

// Type exports for backward compatibility
export type YourEntityResponse = z.infer<typeof yourEntitySchema.response>;
```

## Using Schemas in Your Application

### In Server Actions

```typescript
"use server";

import { schemas } from "@/lib/schemas/your-entity";
import { yourEntityService } from "@/lib/services/your-entity";

export async function createYourEntity(formData: FormData) {
    // Get and validate the raw form data
    const rawData = {
        field1: formData.get("field1"),
        field2: Number(formData.get("field2")),
    };

    try {
        // Validate with schema
        const validatedData = schemas.create.parse(rawData);

        // Create the entity using service
        const entity = await yourEntityService.create(validatedData);

        return { success: true, data: entity };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.errors };
        }
        return { success: false, error: "Failed to create entity" };
    }
}
```

### In API Routes

```typescript
// In an API route handler (e.g., src/app/api/your-entities/route.ts)
import { schemas } from "@/lib/schemas/your-entity";
import { yourEntityService } from "@/lib/services/your-entity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const entities = await yourEntityService.list();

        // Validate response with schema
        const validatedResponse = schemas.listResponse.parse({
            data: entities,
        });

        return NextResponse.json(validatedResponse);
    } catch (error) {
        console.error("Failed to fetch entities:", error);
        return NextResponse.json({ error: "Failed to fetch entities" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body with schema
        const validatedRequest = schemas.createRequest.parse(body);

        // Create entity using service
        const entity = await yourEntityService.create(validatedRequest.data);

        // Validate and return response
        const validatedResponse = schemas.singleResponse.parse({
            data: entity,
        });

        return NextResponse.json(validatedResponse, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
        }

        console.error("Failed to create entity:", error);
        return NextResponse.json({ error: "Failed to create entity" }, { status: 500 });
    }
}
```

## Benefits of This Architecture

1. **Consistency:** Standardized validation across all entities
2. **Code Reduction:** Base factories eliminate duplication
3. **Type Safety:** Full TypeScript integration
4. **Maintainability:** Centralized validation logic
5. **Flexibility:** Easy to customize for special cases
6. **Integration:** Seamless integration with services layer

## Best Practices

1. **Keep Schemas DRY:** Use utility functions for common patterns
2. **Layer Separation:** Schemas should focus on validation, not business logic
3. **Response Filtering:** Carefully consider what fields to expose in responses
4. **Error Handling:** Provide clear validation error messages
5. **Documentation:** Include JSDoc comments for all schemas
6. **Testing:** Create unit tests for complex validations
