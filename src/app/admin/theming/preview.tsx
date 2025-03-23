import { SiteSettings } from "./defaults";
import ThemingPreviewImagePanel from "./hero-image-mgmt";
import ThemingPreviewSettingsPanel from "./theming-settings";

export default function ThemingPreview({ settings }: { settings: SiteSettings }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ThemingPreviewSettingsPanel settings={settings} />
            <ThemingPreviewImagePanel settings={settings} />
        </div>
    );
}
