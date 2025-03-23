import { User } from "@/types/database";
import { UsersAdapter } from "@/lib/database/adapters/users";

/**
 * This service does not follow the pattern of the other services because it has to interface with Authjs
 */
export class UsersService {
    private adapter: UsersAdapter;

    constructor() {
        this.adapter = new UsersAdapter();
    }

    async getAllUsers(): Promise<User[]> {
        return this.adapter.getAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return this.adapter.getById(id);
    }

    async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return this.adapter.create(data);
    }

    async updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> {
        return this.adapter.update(id, data);
    }

    async deleteUser(id: string): Promise<void> {
        return this.adapter.delete(id);
    }

    // Additional user-specific methods
    async findByEmail(email: string): Promise<User | null> {
        const users = await this.adapter.getAll();
        return users.find((user) => user.email === email) || null;
    }

    async toggleUserActive(id: string): Promise<User> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return this.updateUser(id, { isActive: !user.isActive });
    }

    async updateRole(id: string, role: "podcaster:editor" | "podcaster:admin"): Promise<User> {
        return this.updateUser(id, { role });
    }
}

export const usersService = new UsersService();
