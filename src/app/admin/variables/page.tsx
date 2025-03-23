import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { variablesService } from "@/services/variables-service";
import { VariablesTable } from "@/components/data-tables/variables-table";

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
        <main data-theme="workzone" className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <VariablesList />
            </Suspense>
        </main>
    );
}
