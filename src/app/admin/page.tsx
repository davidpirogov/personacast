import "@/app/globals.css";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import GeneralPageSection from "@/components/page-sections/general-page-section";
import Link from "next/link";
import { Users, KeyRound } from "lucide-react";

export const metadata: Metadata = {
    title: "Admin",
};

const AdminPreambleSection = async () => {
    return (
        <GeneralPageSection title="Admin" description="Manage your admin tasks from this page">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                        href="/admin/api-clients"
                        className="group p-6 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <KeyRound className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">API Clients</h3>
                                <p className="text-sm text-gray-500">Manage API clients and access tokens</p>
                            </div>
                        </div>
                    </Link>

                    <Link 
                        href="/admin/users"
                        className="group p-6 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                                <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </GeneralPageSection>
    );
};

export default async function AdminPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<Loader />}>
                <AdminPreambleSection />
            </Suspense>
        </main>
    );
}
