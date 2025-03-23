import { ApiClient } from "@/types/database";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";
import crypto from "crypto";
import { ApiClientService } from "@/types/services";

export class DefaultApiClientService implements ApiClientService {
    private adapter: ApiClientsAdapter;

    constructor() {
        this.adapter = new ApiClientsAdapter();
    }

    async list(): Promise<ApiClient[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<ApiClient | null> {
        return this.adapter.getById(id);
    }

    async create(data: Pick<ApiClient, "name" | "description" | "isActive">): Promise<ApiClient> {
        const token = await this.generateToken();
        return this.adapter.create({
            ...data,
            token,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async update(
        id: number,
        data: Partial<Omit<ApiClient, "id" | "created_at" | "updated_at">>,
    ): Promise<ApiClient> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        return this.adapter.delete(id);
    }

    async generateToken(): Promise<string> {
        // Generate a secure random token using Node's crypto module
        return crypto.randomBytes(32).toString("hex");
    }
}

export const apiClientService = new DefaultApiClientService();
