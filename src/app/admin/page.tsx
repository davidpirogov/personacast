import "@/app/globals.css";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import GeneralPageSection from "@/components/sections/general-page-section";
import Link from "next/link";
import { Users, KeyRound, Layout, Settings, File, ImageIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Admin",
};

const AdminPreambleLink = ({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}) => {
    return (
        <Link
            href={href}
            className="group p-6 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </Link>
    );
};

const AdminPreambleSection = async () => {
    return (
        <GeneralPageSection title="Admin" description="Manage your admin tasks from this page">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminPreambleLink
                        href="/admin/users"
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                        title="Users"
                        description="Manage user accounts and permissions"
                    />
                    <AdminPreambleLink
                        href="/admin/api-clients"
                        icon={<KeyRound className="w-6 h-6 text-blue-600" />}
                        title="API Clients"
                        description="Manage API clients and access tokens"
                    />
                    <AdminPreambleLink
                        href="/admin/theming"
                        icon={<Layout className="w-6 h-6 text-green-600" />}
                        title="Landing Page Theming"
                        description="Customize landing page content, colors, fonts, and layout"
                    />
                    <AdminPreambleLink
                        href="/admin/variables"
                        icon={<Settings className="w-6 h-6 text-yellow-600" />}
                        title="Variables"
                        description="Manage variables and their values"
                    />
                    <AdminPreambleLink
                        href="/admin/files"
                        icon={<File className="w-6 h-6 text-red-600" />}
                        title="Files"
                        description="Manage files and their metadata"
                    />
                    <AdminPreambleLink
                        href="/admin/hero-images"
                        icon={<ImageIcon className="w-6 h-6 text-red-600" />}
                        title="Hero Images"
                        description="Manage hero images"
                    />
                </div>
            </div>
        </GeneralPageSection>
    );
};

export default async function AdminPage() {
    return (
        <main className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <AdminPreambleSection />
            </Suspense>
        </main>
    );
}
