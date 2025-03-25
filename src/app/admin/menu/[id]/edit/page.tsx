"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemForm } from "@/app/admin/menu/menu-item-form";
import { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
import { MenuItemResponse } from "@/schemas/menu-items";
import { toast } from "sonner";

function EditMenuItemPage() {
    const router = useRouter();
    const params = useParams();
    const [menuItem, setMenuItem] = useState<MenuItemResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await fetch(`/api/menu-items/${params.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch menu item");
                }
                const data = await response.json();
                setMenuItem(data);
            } catch (error) {
                console.error("Error fetching menu item:", error);
                toast.error("Failed to load menu item");
                router.push("/admin/menu");
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItem();
    }, [params.id, router]);

    const handleUpdateSuccess = () => {
        toast.success("Menu item updated successfully");
        router.push("/admin/menu");
    };

    if (loading) {
        return <GeneralPageSectionSkeleton />;
    }

    if (!menuItem) {
        return null;
    }

    return (
        <div className="container py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Menu Item</CardTitle>
                    <CardDescription>Update the navigation menu item</CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuItemForm menuItem={menuItem} onSuccess={handleUpdateSuccess} />
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminEditMenuItemPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <EditMenuItemPage />
            </Suspense>
        </main>
    );
}
