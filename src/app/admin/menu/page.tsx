"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemsTable } from "./menu-items-table";
import { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

function MenuListPage() {
    return (
        <div className="container py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <div>
                        <CardTitle>Menu Management</CardTitle>
                        <CardDescription>Manage navigation menu items for your site</CardDescription>
                    </div>
                    <Link href="/admin/menu/new" passHref>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Menu Item
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <MenuItemsTable />
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminMenuPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <MenuListPage />
            </Suspense>
        </main>
    );
}
