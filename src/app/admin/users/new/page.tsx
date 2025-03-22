import { UserForm } from "@/components/forms/user-form";

export default function NewUserPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">New User</h1>
            <UserForm />
        </div>
    );
}
