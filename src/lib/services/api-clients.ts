import { ApiClient } from "@/lib/database/types/models.d";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";
import crypto from "crypto";
import { ApiClientService } from "./api-clients.d";
import { IdService } from "@/lib/services/base/id-service";

class ApiClientServiceImpl extends IdService<ApiClient> implements ApiClientService {
    private TOKEN_LENGTH = 32;

    constructor() {
        super(new ApiClientsAdapter());
        this.TOKEN_LENGTH = parseInt(process.env.API_CLIENT_TOKEN_LENGTH || "32");
    }

    async create(data: Omit<ApiClient, "id" | "createdAt" | "updatedAt">): Promise<ApiClient> {
        const token = await this.generateToken(this.TOKEN_LENGTH);
        return super.create({
            ...data,
            token,
        });
    }

    async generateToken(tokenLength: number): Promise<string> {
        return crypto.randomBytes(tokenLength).toString("hex");
    }
}

// Export a singleton instance
export const apiClientService = new ApiClientServiceImpl();

// Export the interface for better type inference
export type { ApiClientService };
