import { Variable } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface VariablesService extends IdCRUDService<Variable> {
    /**
     * Get a variable by name
     */
    getByName(name: string): Promise<Variable | null>;
} 