import { Suspense } from "react";
import { ApiClientsTable } from "@/components/data-tables/api-clients-table";
import { Loader } from "@/components/ui/loading";
import GeneralPageSection from "@/components/sections/general-page-section";
import { Metadata } from "next";
import { apiClientService } from "@/services/api-client-service";
import { apiClientListSchema } from "@/schemas/api-clients/schema";
export const metadata: Metadata = {
    title: "API Clients | Admin",
};

const ApiClientsList = async () => {
    const apiClients = await apiClientService.list();
    const apiClientListResponse = apiClientListSchema.parse(apiClients);

    return (
        <GeneralPageSection title="API Clients" description="Manage your API clients">
            <ApiClientsTable apiClients={apiClientListResponse} />
        </GeneralPageSection>
    );
};

export default function ApiClientsPage() {
    return (
        <main data-theme="workzone" className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <ApiClientsList />
            </Suspense>
        </main>
    );
}
