import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { Variable } from "@/lib/database/types/models.d";
import { VariablesAdapterType } from "@/lib/database/types/adapters.d";

/**
 * Example adapter implementation using the base adapter pattern
 * This shows how to extend the base adapter with specialized methods
 */
class VariablesAdapter extends IdAdapter<Variable> implements VariablesAdapterType {
    constructor() {
        // Pass the Prisma model name to the base adapter
        super("variable");
    }

    /**
     * Specialized method to find a variable by name
     * @param name - Variable name to search for
     * @param tx - Optional transaction client
     * @returns Promise resolving to the variable if found, null otherwise
     */
    async getByName(name: string, tx?: Prisma.TransactionClient): Promise<Variable | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return (await modelClient.findUnique({
            where: { name },
        })) as Variable | null;
    }
}

export default VariablesAdapter;
