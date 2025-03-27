import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { BaseRecord } from "@/lib/database/base/models.d";
import { DatabaseAdapter } from "@/lib/database/base/adapters.d";

/**
 * Interface defining the minimum methods required for a Prisma model client
 */
interface PrismaModelClient {
    findMany: (args?: {
        where?: any;
        include?: any;
        orderBy?: any;
    }) => Promise<any[]>;
    findUnique: (args: {
        where: any;
        include?: any;
    }) => Promise<any | null>;
    findFirst: (args: {
        where: any;
        include?: any;
    }) => Promise<any | null>;
    create: (args: { 
        data: any;
        include?: any;
    }) => Promise<any>;
    update: (args: { 
        where: any; 
        data: any;
        include?: any;
    }) => Promise<any>;
    delete: (args: { where: any }) => Promise<any>;
    deleteMany: (args: { where: any }) => Promise<any>;
}

/**
 * Base adapter class that implements common CRUD operations for a Prisma model
 * Specific adapters can extend this class and only override methods that require custom logic
 * 
 * @template T - Entity type extending BaseRecord
 * @template TId - Type of the ID field (string or number)
 * @template TModelClient - Type of the Prisma model client
 */
export abstract class BaseAdapter<
    T extends BaseRecord<TId>,
    TId = number,
    TModelClient extends PrismaModelClient = PrismaModelClient
> implements DatabaseAdapter<T, TId> {
    
    /**
     * Creates a new BaseAdapter instance
     * 
     * @param modelName - The name of the Prisma model to use (e.g., "user", "podcast")
     */
    constructor(protected readonly modelName: string) {}

    /**
     * Retrieves all records from the database
     * @param tx - Optional transaction client
     * @returns Promise resolving to an array of all records
     */
    async getAll(tx?: Prisma.TransactionClient): Promise<T[]> {
        const client = tx || db;
        // Access the model client through the db or transaction client
        const modelClient = this.getModelClient(client);
        const results = await modelClient.findMany();
        return results as T[];
    }

    /**
     * Retrieves a single record by its ID
     * @param id - ID of the record to retrieve
     * @param tx - Optional transaction client
     * @returns Promise resolving to the record if found, null otherwise
     */
    async getById(id: TId, tx?: Prisma.TransactionClient): Promise<T | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const result = await modelClient.findUnique({
            where: { id },
        });
        return result as T | null;
    }

    /**
     * Creates a new record in the database
     * @param data - Data for creating the record
     * @param tx - Optional transaction client
     * @returns Promise resolving to the created record
     */
    async create(data: Omit<T, "id" | "createdAt" | "updatedAt">, tx?: Prisma.TransactionClient): Promise<T> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        
        // Prepare data with timestamps
        const createData = this.prepareCreateData(data);
        
        const result = await modelClient.create({
            data: createData,
        });
        return result as T;
    }

    /**
     * Updates an existing record in the database
     * @param id - ID of the record to update
     * @param data - Data for updating the record
     * @param tx - Optional transaction client
     * @returns Promise resolving to the updated record
     */
    async update(
        id: TId, 
        data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>, 
        tx?: Prisma.TransactionClient
    ): Promise<T> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        
        // Prepare data with updated timestamp
        const updateData = this.prepareUpdateData(data);
        
        const result = await modelClient.update({
            where: { id },
            data: updateData,
        });
        return result as T;
    }

    /**
     * Deletes a record from the database
     * @param id - ID of the record to delete
     * @param tx - Optional transaction client
     */
    async delete(id: TId, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        await modelClient.delete({
            where: { id },
        });
    }

    /**
     * Gets the model client from either the db or transaction client
     * @param client - Transaction client or db
     * @returns Model client
     */
    protected getModelClient(client: any): TModelClient {
        return client[this.modelName] as TModelClient;
    }

    /**
     * Prepares data for create operation by adding timestamps
     * @param data - Original create data
     * @returns Create data with timestamps
     */
    protected prepareCreateData(data: Omit<T, "id" | "createdAt" | "updatedAt">): any {
        return {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    /**
     * Prepares data for update operation by adding updatedAt timestamp
     * @param data - Original update data
     * @returns Update data with timestamp
     */
    protected prepareUpdateData(data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): any {
        return {
            ...data,
            updatedAt: new Date(),
        };
    }
} 