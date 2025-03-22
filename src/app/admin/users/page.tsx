import { Suspense } from "react";
import { UsersTable } from "@/components/data-tables/users-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/ui/loading";

const NEW_USER_FEATURE_FLAG = false;

export default function UsersPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                {NEW_USER_FEATURE_FLAG && (
                    <Link href="/admin/users/new">
                        <Button>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New User
                        </Button>
                    </Link>
                )}
            </div>

            <Suspense fallback={<Loader />}>
                <UsersTable />
            </Suspense>
        </div>
    );
}
