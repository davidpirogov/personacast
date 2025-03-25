"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItemFormData, MenuItemResponse, menuItemSchema } from "@/schemas/menu-items";
import { toast } from "sonner";

interface MenuItemFormProps {
    menuItem?: MenuItemResponse;
    onSuccess: () => void;
}

export function MenuItemForm({ menuItem, onSuccess }: MenuItemFormProps) {
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);

    const isEditing = !!menuItem;

    const form = useForm<MenuItemFormData>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            label: menuItem?.label || "",
            href: menuItem?.href || "",
            order: menuItem?.order || 0,
            isActive: menuItem?.isActive ?? true,
            isSystem: menuItem?.isSystem ?? false,
            requiredRoles: menuItem?.requiredRoles || [],
            parentId: menuItem?.parentId || null,
            relOptions: menuItem?.relOptions || [],
        },
    });

    // Fetch available menu items for parent selection
    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const response = await fetch("/api/menu-items");
                if (response.ok) {
                    const data = await response.json();
                    // Filter out the current item if we're editing
                    setMenuItems(
                        isEditing ? data.filter((item: MenuItemResponse) => item.id !== menuItem.id) : data,
                    );
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        }

        fetchMenuItems();
    }, [isEditing, menuItem]);

    async function onSubmit(data: MenuItemFormData) {
        try {
            setLoading(true);

            const endpoint = isEditing ? `/api/menu-items/${menuItem.id}` : "/api/menu-items";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save menu item");
            }

            onSuccess();
        } catch (error) {
            console.error("Error saving menu item:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save menu item");
        } finally {
            setLoading(false);
        }
    }

    const availableRoles = ["podcaster:admin", "podcaster:editor", "authenticated", "premium"];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="Menu item label" {...field} disabled={loading} />
                                </FormControl>
                                <FormDescription>The text displayed in the navigation menu</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="href"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="/path/to/page"
                                        {...field}
                                        disabled={loading || (isEditing && menuItem.isSystem)}
                                    />
                                </FormControl>
                                <FormDescription>The destination URL for this menu item</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Order</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Controls the ordering of menu items (lower numbers appear first)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Menu Item</FormLabel>
                                <Select
                                    disabled={loading || (isEditing && menuItem.isSystem)}
                                    onValueChange={(value) => {
                                        field.onChange(value === "none" ? null : Number(value));
                                    }}
                                    value={field.value?.toString() || "none"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a parent item (optional)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        {menuItems.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Makes this a sub-item under another menu item
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="relOptions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rel Options</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., nofollow external"
                                        value={
                                            Array.isArray(field.value) ? field.value.join(" ") : field.value
                                        }
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled={loading || (isEditing && menuItem.isSystem)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Space-separated rel attributes for the link (e.g., nofollow external)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active</FormLabel>
                                    <FormDescription>Show this item in the navigation menu</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={loading}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {isEditing && menuItem.isSystem && (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-center min-h-[4rem]">
                            <p className="text-sm text-blue-700">
                                System menu items have limited editable settings
                            </p>
                        </div>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="requiredRoles"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Required Roles</FormLabel>
                                <FormDescription>
                                    This menu item will only be visible to users with selected roles. If no
                                    roles are selected, the item will be visible to all users.
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {availableRoles.map((role) => (
                                    <FormField
                                        key={role}
                                        control={form.control}
                                        name="requiredRoles"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={role}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(role)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, role])
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (value) => value !== role,
                                                                          ),
                                                                      );
                                                            }}
                                                            disabled={
                                                                loading || (isEditing && menuItem.isSystem)
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{role}</FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                    {loading ? "Saving..." : isEditing ? "Update Menu Item" : "Create Menu Item"}
                </Button>
            </form>
        </Form>
    );
}
