import { ApiClient } from "@/lib/database/types/models.d";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";
import { IdService } from "@/lib/services/base/id-service";
import crypto from "crypto";

/**
 * ApiClientService interface extending the base IdService
 */
interface ApiClientServiceType extends IdService<ApiClient> {
    /**
     * Generate a new token for an API client
     */
    generateToken(id: number): Promise<string>;
}

/**
 * Implementation of ApiClientService using the base service pattern
 */
class ApiClientService extends IdService<ApiClient> implements ApiClientServiceType {
    constructor() {
        // Pass the adapter to the base class
        super(new ApiClientsAdapter());
    }
    
    /**
     * Override create to automatically generate a token
     */
    async create(data: Omit<ApiClient, "id" | "createdAt" | "updatedAt">): Promise<ApiClient> {
        const token = await this.generateToken(0); // The id is not used here
        return await super.create({
            ...data,
            token,
        });
    }
    
    /**
     * Generate a secure random token
     */
    async generateToken(id: number): Promise<string> {
        // Generate a secure random token using Node's crypto module
        return crypto.randomBytes(32).toString("hex");
    }
}

// Export a singleton instance
export const apiClientService = new ApiClientService();

// Export the type for better type inference
export type { ApiClientServiceType }; 