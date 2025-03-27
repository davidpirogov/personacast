import { User } from "@/lib/database/types/models.d";
import { UuidCRUDService } from "@/lib/services/base/services.d";

export interface UsersService extends UuidCRUDService<User> {
    /**
     * Get all users
     */
    getAllUsers(): Promise<User[]>;

    /**
     * Get a user by ID
     */
    getUserById(id: string): Promise<User | null>;

    /**
     * Create a new user
     */
    createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;

    /**
     * Update an existing user
     */
    updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User>;

    /**
     * Delete a user
     */
    deleteUser(id: string): Promise<void>;

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
