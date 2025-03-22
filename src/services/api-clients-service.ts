import { ApiClient } from "@/types/database";
import ApiClientsAdapter from "@/lib/database/adapters/api-clients";
import crypto from "crypto";

export class ApiClientsService {
    private adapter: ApiClientsAdapter;

    constructor() {
        this.adapter = new ApiClientsAdapter();
    }

    async getAllClients(): Promise<ApiClient[]> {
        return this.adapter.getAll();
    }

    async getClientById(id: string): Promise<ApiClient | null> {
        return this.adapter.getById(id);
    }

    async createClient(data: Pick<ApiClient, "name" | "description" | "isActive">): Promise<ApiClient> {
        const token = await this.generateToken();
        return this.adapter.create({
            ...data,
            token,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async updateClient(
        id: string,
        data: Partial<Omit<ApiClient, "id" | "created_at" | "updated_at">>,
    ): Promise<ApiClient> {
        return this.adapter.update(id, data);
    }

    async deleteClient(id: string): Promise<void> {
        return this.adapter.delete(id);
    }

    async generateToken(): Promise<string> {
        // Generate a secure random token using Node's crypto module
        return crypto.randomBytes(32).toString("hex");
    }
}
