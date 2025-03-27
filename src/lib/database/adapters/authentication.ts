import type { Adapter, AdapterUser, AdapterAccount } from "@auth/core/adapters";
import UsersAdapter from "@/lib/database/adapters/users";
import AccountsAdapter from "@/lib/database/adapters/accounts";
import { UsersAdapterType, AccountsAdapterType } from "@/lib/database/types/adapters.d";

/**
 * AuthenticationAdapter implements a different pattern because it needs to work
 * with AuthJS and its types.
 */
class AuthenticationAdapter implements Adapter {
    private usersAdapter: UsersAdapterType;
    private accountsAdapter: AccountsAdapterType;

    constructor() {
        this.usersAdapter = new UsersAdapter();
        this.accountsAdapter = new AccountsAdapter();
    }

    async createUser(data: AdapterUser) {
        // Check if this is the first user
        const allUsers = await this.usersAdapter.getAll();
        const isFirstUser = allUsers.length === 0;

        const user = await this.usersAdapter.create({
            name: data.name!,
            email: data.email!,
            image: data.image ?? null,
            emailVerified: data.emailVerified,
            isActive: true,
            role: isFirstUser ? "podcaster:admin" : "authenticated",
            accounts: [],
        });
        return user as AdapterUser;
    }

    async getUser(id: string) {
        const user = await this.usersAdapter.getById(id);
        return user as AdapterUser | null;
    }

    async getUserByEmail(email: string) {
        const users = await this.usersAdapter.getAll();
        const user = users.find((u) => u.email === email);
        return user as AdapterUser | null;
    }

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
        const account = await this.accountsAdapter.findByProvider(provider, providerAccountId);
        if (!account) {
            return null;
        }

        const user = await this.usersAdapter.getById(account.userId);
        return user as AdapterUser | null;
    }

    async updateUser(user: AdapterUser) {
        const updated = await this.usersAdapter.update(user.id, {
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? null,
            emailVerified: user.emailVerified,
        });
        return updated as AdapterUser;
    }

    async linkAccount(account: AdapterAccount) {
        await this.accountsAdapter.create({
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
        });
    }

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
        const account = await this.accountsAdapter.findByProvider(provider, providerAccountId);
        if (account) {
            await this.accountsAdapter.delete(account.id);
        }
    }

    async deleteUser(userId: string) {
        await this.accountsAdapter.deleteByUserId(userId);
        await this.usersAdapter.delete(userId);
    }
}

export default AuthenticationAdapter;
