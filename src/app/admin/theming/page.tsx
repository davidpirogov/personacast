import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { variablesService } from "@/services/variables-service";
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME } from "./defaults";
import { LandingPageProvider } from "./context/landing-page-context";
import { LandingPageContent } from "./landing-page-content";
import { PageTitleWithSave } from "./components/page-title-with-save";

export const metadata: Metadata = {
    title: "Landing | Admin",
};

const LandingPageAdminSection = async () => {
    let site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);
    if (!site_settings_variable) {
        await variablesService.create({
            name: SITE_SETTINGS_NAME,
            value: JSON.stringify(DEFAULT_SITE_SETTINGS),
        });
        site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);
    }

    if (!site_settings_variable) {
        throw new Error("Site settings variable not found");
    }

    const site_settings = JSON.parse(site_settings_variable.value);

    return (
        <LandingPageProvider initialSettings={site_settings}>
            <GeneralPageSection
                title=""
                description="Manage your landing page settings"
                link={<PageTitleWithSave title="Landing Page Settings" />}
            >
                <LandingPageContent />
            </GeneralPageSection>
        </LandingPageProvider>
    );
};

export default function LandingPageAdminPage() {
    return (
        <main className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <LandingPageAdminSection />
            </Suspense>
        </main>
    );
}
