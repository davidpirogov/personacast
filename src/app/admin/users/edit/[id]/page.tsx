import { UserForm } from "@/components/forms/user-form";
import { UsersService } from "@/services/users-service";
import { notFound } from "next/navigation";

const usersService = new UsersService();

interface EditUserPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
    const { id } = await params;
    const user = await usersService.getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Edit User</h1>
            <UserForm user={user} />
        </div>
    );
}
