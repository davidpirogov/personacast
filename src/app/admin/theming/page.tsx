import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { variablesService } from "@/services/variables-service";
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME } from "./defaults";
import ThemingPreview from "./preview";

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

    console.log(site_settings);

    return (
        <GeneralPageSection title="Landing Page Settings" description="Manage your landing page settings">
            <ThemingPreview settings={site_settings} />
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
