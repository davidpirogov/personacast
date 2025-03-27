import { ApiClient } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface ApiClientService extends IdCRUDService<ApiClient> {
    /**
     * Generate a new token for an API client
     */
    generateToken(tokenLength: number): Promise<string>;
}
