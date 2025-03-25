"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoveUp, MoveDown, ArrowUpDown } from "lucide-react";
import { MenuItemResponse } from "@/schemas/menu-items";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
import { useMenu } from "@/components/providers/menu/menu-provider";

export function MenuItemsTable() {
    const router = useRouter();
    const [items, setItems] = useState<MenuItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const { refetch: refreshMenu } = useMenu();

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/menu-items");

            if (!response.ok) {
                throw new Error("Failed to fetch menu items");
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
            toast.error("Failed to load menu items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/menu-items/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete menu item");
            }

            await fetchMenuItems();
            toast.success("Menu item deleted successfully");
        } catch (error) {
            console.error("Error deleting menu item:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete menu item");
        }
    };

    const handleReorder = async (updatedOrders: { id: number; order: number }[]) => {
        // Store current items state for rollback
        const previousItems = [...items];

        try {
            const response = await fetch("/api/menu-items/reorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: updatedOrders }),
            });

            if (!response.ok) {
                throw new Error("Failed to reorder menu items");
            }

            // Refresh the menu state to update the navigation
            refreshMenu();
        } catch (error) {
            // Rollback to previous state on error
            setItems(previousItems);
            console.error("Error reordering menu items:", error);
            toast.error("Failed to reorder menu items");
        }
    };

    const handleMoveUp = (id: number) => {
        const itemIndex = items.findIndex((item) => item.id === id);
        if (itemIndex <= 0) return;

        const newItems = [...items];

        // Swap orders
        const currentOrder = newItems[itemIndex].order;
        const prevOrder = newItems[itemIndex - 1].order;

        // Update the orders to be sent to API
        const updatedItems = [
            { id: newItems[itemIndex].id, order: prevOrder },
            { id: newItems[itemIndex - 1].id, order: currentOrder },
        ];

        // Swap positions in the UI immediately
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];

        // Update UI immediately
        setItems(newItems);
        // Make API call in background
        handleReorder(updatedItems);
    };

    const handleMoveDown = (id: number) => {
        const itemIndex = items.findIndex((item) => item.id === id);
        if (itemIndex < 0 || itemIndex >= items.length - 1) return;

        const newItems = [...items];

        // Swap orders
        const currentOrder = newItems[itemIndex].order;
        const nextOrder = newItems[itemIndex + 1].order;

        // Update the orders to be sent to API
        const updatedItems = [
            { id: newItems[itemIndex].id, order: nextOrder },
            { id: newItems[itemIndex + 1].id, order: currentOrder },
        ];

        // Swap positions in the UI immediately
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];

        // Update UI immediately
        setItems(newItems);
        // Make API call in background
        handleReorder(updatedItems);
    };

    if (loading) {
        return <GeneralPageSectionSkeleton />;
    }

    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Order</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>System</TableHead>
                        <TableHead>Required Roles</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No menu items found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow
                                key={item.id}
                                className={activeItem === item.id ? "bg-accent/20" : ""}
                                onClick={() => setActiveItem(item.id === activeItem ? null : item.id)}
                            >
                                <TableCell className="font-mono text-sm">{item.order}</TableCell>
                                <TableCell className="font-medium">{item.label}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {item.href}
                                </TableCell>
                                <TableCell>
                                    {item.isActive ? (
                                        <Badge
                                            variant="outline"
                                            className="bg-green-500/10 text-green-600 border-green-500"
                                        >
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="bg-slate-500/10 text-slate-600 border-slate-500"
                                        >
                                            Inactive
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.isSystem ? (
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-500/10 text-blue-600 border-blue-500"
                                        >
                                            System
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="bg-slate-500/10 text-slate-600 border-slate-500"
                                        >
                                            Custom
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.requiredRoles.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {item.requiredRoles.map((role) => (
                                                <Badge key={role} variant="secondary" className="text-xs">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">All users</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMoveUp(item.id)}
                                            disabled={items.indexOf(item) === 0}
                                        >
                                            <MoveUp className="h-4 w-4" />
                                            <span className="sr-only">Move Up</span>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMoveDown(item.id)}
                                            disabled={items.indexOf(item) === items.length - 1}
                                        >
                                            <MoveDown className="h-4 w-4" />
                                            <span className="sr-only">Move Down</span>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/admin/menu/${item.id}/edit`);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={item.isSystem}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{item.label}"? This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
