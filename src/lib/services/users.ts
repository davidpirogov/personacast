import { User } from "@/lib/database/types/models.d";
import UsersAdapter from "@/lib/database/adapters/users";
import { UsersService } from "./users.d";
import { UuidService } from "./base";

/**
 * This service does not follow the pattern of the other services because it has to interface with Authjs
 */
export class UsersServiceImpl extends UuidService<User> implements UsersService {
    constructor() {
        super(new UsersAdapter());
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
        const users = await this.list();
        return users.find((user) => user.email === email) || null;
    }

    /**
     * Toggle a user's active status
     */
    async toggleUserActive(id: string): Promise<User> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return this.updateUser(id, { isActive: !user.isActive });
    }

    /**
     * Update a user's role
     */
    async updateRole(id: string, role: "podcaster:editor" | "podcaster:admin"): Promise<User> {
        return this.updateUser(id, { role });
    }
}

// Export a singleton instance
export const usersService = new UsersServiceImpl();

// Export the interface for better type inference
export type { UsersService };
