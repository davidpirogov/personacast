import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { UuidAdapter } from "@/lib/database/base/uuid-adapter";
import { AccountsAdapterType } from "@/lib/database/types/adapters.d";
import { Account } from "@/lib/database/types/models.d";

/**
 * Adapter for managing Account entities
 * Using base adapter pattern for common CRUD operations with specialized methods
 */
class AccountsAdapter extends UuidAdapter<Account> implements AccountsAdapterType {
    constructor() {
        super("account");
    }

    /**
     * Find an account by provider and provider account ID
     * @param provider - OAuth provider
     * @param providerAccountId - Provider's account ID
     * @param tx - Optional transaction client
     * @returns Promise resolving to the account if found, null otherwise
     */
    async findByProvider(
        provider: string,
        providerAccountId: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Account | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const account = await modelClient.findFirst({
            where: {
                provider,
                providerAccountId,
            },
        });
        return account as Account | null;
    }

    /**
     * Delete all accounts for a specific user
     * @param userId - User ID
     * @param tx - Optional transaction client
     */
    async deleteByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        await modelClient.deleteMany({
            where: { userId },
        });
    }
}

export default AccountsAdapter;
