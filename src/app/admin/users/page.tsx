import { Suspense } from "react";
import { UsersTable } from "@/components/data-tables/users-table";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/page-sections/general-page-section";
import { usersService } from "@/services/users-service";

export const metadata: Metadata = {
    title: "Users | Admin",
};

const UsersList = async () => {
    const users = await usersService.getAllUsers();

    return (
        <GeneralPageSection title="Users" description="Manage your users">
            <UsersTable users={users} />
        </GeneralPageSection>
    );
};

export default function UsersPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<Loader />}>
                <UsersList />
            </Suspense>
        </main>
    );
}
