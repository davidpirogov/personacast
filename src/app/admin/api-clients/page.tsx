import { Suspense } from "react";
import { ApiClientsTable } from "@/components/data-tables/api-clients-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Loader } from "@/components/ui/loading";

export default function ApiClientsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">API Clients</h1>
                <Link href="/admin/api-clients/new">
                    <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Client
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<Loader />}>
                <ApiClientsTable />
            </Suspense>
        </div>
    );
}
