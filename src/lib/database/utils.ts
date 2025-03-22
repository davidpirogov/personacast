import { TimeoutError } from "@/lib/database/errors";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

/**
 * Executes database operations within a transaction to ensure data consistency.
 * If any operation fails, all changes are rolled back. This is useful when you need
 * to perform multiple related database operations that must succeed or fail together.
 *
 * @param callback - A function that receives a transaction client and performs database operations
 * @returns Promise resolving to the result of the callback function
 *
 * @example
 * ```typescript
 * // Example: Creating a user with associated accounts and settings
 * const result = await withTransaction(async (tx) => {
 *   // Create a new user
 *   const user = await tx.user.create({
 *     data: {
 *       email: "user@example.com",
 *       name: "John Doe",
 *       updatedAt: new Date(),
 *       createdAt: new Date()
 *     },
 *     include: {
 *       accounts: true
 *     }
 *   });
 *
 *   // Create associated account
 *   const account = await tx.account.create({
 *     data: {
 *       userId: user.id,
 *       type: "oauth",
 *       provider: "google",
 *       providerAccountId: "12345",
 *       updatedAt: new Date()
 *     }
 *   });
 *
 *   // Update user's settings
 *   await tx.userSettings.create({
 *     data: {
 *       userId: user.id,
 *       preferences: {
 *         theme: "dark",
 *         notifications: true
 *       }
 *     }
 *   });
 *
 *   return { user, account };
 * });
 * ```
 *
 * If any of these operations fail:
 * 1. No changes will be committed to the database
 * 2. The transaction will be rolled back automatically
 * 3. An error will be thrown
 *
 * This ensures data consistency across all tables involved in the transaction.
 *
 * Note: When using with adapters (like UsersAdapter), you should pass the
 * transaction client to the adapter methods if they support it. Otherwise,
 * you can use the transaction client directly as shown in the example above.
 */
export async function withTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await prisma.$transaction(async (tx) => {
        return await callback(tx);
    });
}

// Health check function
export async function healthCheck() {
    const timeoutMs = parseInt(process.env.HEALTH_CHECK_TIMEOUT_MS || "1000", 10);

    const queryPromise = prisma.$queryRaw<[{ "?column?": 1 }]>`SELECT 1`.then((result) => ({
        type: "query" as const,
        result,
    }));

    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError(timeoutMs));
        }, timeoutMs);
    });

    await Promise.race([queryPromise, timeoutPromise]);
    // If we get here, it means the query completed (the timeout would have thrown an error)
    return true;
}
