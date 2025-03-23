import { SiteSettings } from "./defaults";

const ThemingPreviewSettingsPanel = ({ settings }: { settings: SiteSettings }) => {
    return (
        <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Site Title</label>
                    <div className="mt-1 text-gray-900">{settings.title}</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Hero Type</label>
                    <div className="mt-1 text-gray-900">{settings.hero.type}</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Colors</label>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.primary.hex }}
                            />
                            <span className="text-sm">Primary: {settings.colors.primary.hex}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.secondary.hex }}
                            />
                            <span className="text-sm">Secondary: {settings.colors.secondary.hex}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.accent.hex }}
                            />
                            <span className="text-sm">Accent: {settings.colors.accent.hex}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemingPreviewSettingsPanel;
