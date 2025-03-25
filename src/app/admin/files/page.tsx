import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { filesService } from "@/services/files-service";
import { FilesTable } from "@/components/data-tables/files-table";

export const metadata: Metadata = {
    title: "Files | Admin",
};

const FilesList = async () => {
    const files = await filesService.list();

    return (
        <GeneralPageSection title="Files" description="Manage your files">
            <FilesTable files={files} />
        </GeneralPageSection>
    );
};

export default function FilesPage() {
    return (
        <main className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <FilesList />
            </Suspense>
        </main>
    );
}
