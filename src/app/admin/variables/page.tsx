import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { variablesService } from "@/services/variables-service";
import { VariablesTable } from "@/components/data-tables/variables-table";
import { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
export const metadata: Metadata = {
    title: "Variables | Admin",
};

const VariablesList = async () => {
    const variables = await variablesService.list();

    return (
        <GeneralPageSection title="Variables" description="Manage your variables">
            <VariablesTable variables={variables} />
        </GeneralPageSection>
    );
};

export default function VariablesPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <VariablesList />
            </Suspense>
        </main>
    );
}
