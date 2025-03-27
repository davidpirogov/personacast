import { Variable } from "@/lib/database/types/models.d";
import VariablesAdapter from "@/lib/database/adapters/variables";
import { VariablesService } from "./variables.d";
import { IdService, createIdService } from "./base";

/**
 * Implementation of VariablesService using the base service pattern
 */
class VariablesServiceImpl extends IdService<Variable> implements VariablesService {
    constructor() {
        super(new VariablesAdapter());
    }

    /**
     * Get a variable by name
     */
    async getByName(name: string): Promise<Variable | null> {
        // Assuming the adapter has a getByName method
        return (this.adapter as any).getByName(name);
    }
}

// Export a singleton instance
export const variablesService = new VariablesServiceImpl();

// Export the interface for better type inference
export type { VariablesService };
