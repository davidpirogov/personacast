"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemForm } from "@/app/admin/menu/menu-item-form";
import { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
import { toast } from "sonner";

function CreateMenuItemPage() {
    const router = useRouter();

    const handleCreateSuccess = () => {
        toast.success("Menu item created successfully");
        router.push("/admin/menu");
    };

    return (
        <div className="container py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create Menu Item</CardTitle>
                    <CardDescription>Add a new navigation menu item to your site</CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuItemForm onSuccess={handleCreateSuccess} />
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminCreateMenuItemPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <CreateMenuItemPage />
            </Suspense>
        </main>
    );
}
