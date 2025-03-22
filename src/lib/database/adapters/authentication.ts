import type { Adapter, AdapterUser, AdapterAccount } from "@auth/core/adapters";
import { UsersAdapterImpl } from "@/lib/database/adapters/users";
import { AccountsAdapterImpl } from "@/lib/database/adapters/accounts";

export function AuthenticationAdapter(): Adapter {
    const usersAdapter = new UsersAdapterImpl();
    const accountsAdapter = new AccountsAdapterImpl();

    return {
        async createUser(data) {
            // Check if this is the first user
            const allUsers = await usersAdapter.getAll();
            const isFirstUser = allUsers.length === 0;

            const user = await usersAdapter.create({
                name: data.name!,
                email: data.email!,
                image: data.image ?? null,
                emailVerified: data.emailVerified,
                isActive: true,
                role: isFirstUser ? "podcaster:admin" : "authenticated",
                accounts: [],
            });
            return user as AdapterUser;
        },

        async getUser(id) {
            const user = await usersAdapter.getById(id);
            return user as AdapterUser | null;
        },

        async getUserByEmail(email) {
            const users = await usersAdapter.getAll();
            const user = users.find((u) => u.email === email);
            return user as AdapterUser | null;
        },

        async getUserByAccount({ provider, providerAccountId }) {
            const account = await accountsAdapter.findByProvider(provider, providerAccountId);
            if (!account) return null;

            const user = await usersAdapter.getById(account.userId);
            return user as AdapterUser | null;
        },

        async updateUser(user) {
            const updated = await usersAdapter.update(user.id, {
                name: user.name ?? "",
                email: user.email,
                image: user.image ?? null,
                emailVerified: user.emailVerified,
            });
            return updated as AdapterUser;
        },

        async linkAccount(account) {
            await accountsAdapter.create({
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? null,
                access_token: account.access_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: account.session_state ? String(account.session_state) : null,
                name: `${account.provider}-${account.providerAccountId}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },

        async unlinkAccount({ provider, providerAccountId }) {
            const account = await accountsAdapter.findByProvider(provider, providerAccountId);
            if (account) {
                await accountsAdapter.delete(account.id);
            }
        },

        async deleteUser(userId) {
            await accountsAdapter.deleteByUserId(userId);
            await usersAdapter.delete(userId);
        },
    };
}
