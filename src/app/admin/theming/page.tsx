import { Suspense } from "react";
import { UsersTable } from "@/components/data-tables/users-table";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { usersService } from "@/services/users-service";

export const metadata: Metadata = {
    title: "Landing | Admin",
};

const LandingPageAdminSection = async () => {
    return (
        <GeneralPageSection title="Landing Page Settings" description="Manage your landing page settings">
            TODO
        </GeneralPageSection>
    );
};

export default function LandingPageAdminPage() {
    return (
        <main data-theme="workzone" className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <LandingPageAdminSection />
            </Suspense>
        </main>
    );
}
