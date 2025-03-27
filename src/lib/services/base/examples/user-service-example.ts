import { User } from "@/lib/database/types/models.d";
import UsersAdapter from "@/lib/database/adapters/users";
import { UuidService } from "@/lib/services/base/uuid-service";

/**
 * UsersService interface extending the base UuidService
 */
interface UserServiceType extends UuidService<User> {
    /**
     * Find a user by email
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Toggle a user's active status
     */
    toggleUserActive(id: string): Promise<User>;

    /**
     * Update a user's role
     */
    updateRole(id: string, role: "podcaster:editor" | "podcaster:admin"): Promise<User>;
}

/**
 * Implementation of UserService using the base service pattern
 */
class UserService extends UuidService<User> implements UserServiceType {
    constructor() {
        // Pass the adapter to the base class
        super(new UsersAdapter());
    }
    
    /**
     * Find a user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        const users = await this.list();
        return users.find((user) => user.email === email) || null;
    }

    /**
     * Toggle a user's active status
     */
    async toggleUserActive(id: string): Promise<User> {
        const user = await this.get(id);
        if (!user) {
            throw new Error("User not found");
        }
        return this.update(id, { isActive: !user.isActive });
    }

    /**
     * Update a user's role
     */
    async updateRole(id: string, role: "podcaster:editor" | "podcaster:admin"): Promise<User> {
        return this.update(id, { role });
    }
}

// Export a singleton instance
export const userService = new UserService();

// Export the type for better type inference
export type { UserServiceType }; 