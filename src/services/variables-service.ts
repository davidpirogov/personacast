import { VariablesAdapter } from "@/lib/database/adapters/variables";
import { Variable, VariablesAdapterType } from "@/types/database";
import { VariablesService } from "@/types/services";

export class DefaultVariablesService implements VariablesService {
    private adapter: VariablesAdapterType;

    constructor() {
        this.adapter = new VariablesAdapter();
    }

    async list(): Promise<Variable[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<Variable | null> {
        return this.adapter.getById(id);
    }

    async create(data: Omit<Variable, "id" | "createdAt" | "updatedAt">): Promise<Variable> {
        return this.adapter.create(data);
    }

    async update(
        id: number,
        data: Partial<Omit<Variable, "id" | "createdAt" | "updatedAt">>,
    ): Promise<Variable> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.adapter.delete(id);
    }

    async getByName(name: string): Promise<Variable | null> {
        return this.adapter.getByName(name);
    }
}

export const variablesService = new DefaultVariablesService();
