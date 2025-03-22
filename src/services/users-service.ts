import { User } from '@/types/database';
import { UsersAdapterImpl } from '@/lib/database/adapters/users';

const usersAdapter = new UsersAdapterImpl();

export class UsersService {
    async getAllUsers(): Promise<User[]> {
        return usersAdapter.getAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return usersAdapter.getById(id);
    }

    async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return usersAdapter.create(data);
    }

    async updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> {
        return usersAdapter.update(id, data);
    }

    async deleteUser(id: string): Promise<void> {
        return usersAdapter.delete(id);
    }

    // Additional user-specific methods
    async findByEmail(email: string): Promise<User | null> {
        const users = await usersAdapter.getAll();
        return users.find(user => user.email === email) || null;
    }

    async toggleUserActive(id: string): Promise<User> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return this.updateUser(id, { isActive: !user.isActive });
    }

    async updateRole(id: string, role: "podcaster:editor" | "podcaster:admin"): Promise<User> {
        return this.updateUser(id, { role });
    }
} 