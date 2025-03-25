import { z } from "zod";

const baseMenuItemSchema = z.object({
    label: z.string().min(1, "Label is required"),
    href: z.string().min(1, "URL is required"),
    order: z.number(),
    isActive: z.boolean().default(true),
    requiredRoles: z.array(z.string()).default([]),
    relOptions: z.string().default("").transform(val => val.split(" ").filter(Boolean)),
    parentId: z.number().nullish().transform(val => val ?? null),
});

export const menuItemCreateSchema = baseMenuItemSchema.extend({
    isSystem: z.boolean().default(false),
});

export const menuItemUpdateSchema = z.object({
    label: z.string().min(1, "Label is required").optional(),
    href: z.string().min(1, "URL is required").optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
    requiredRoles: z.array(z.string()).optional(),
    relOptions: z.string().optional().transform(val => val ? val.split(" ").filter(Boolean) : undefined),
    parentId: z.number().nullable().optional(),
});

export const menuItemSchema = baseMenuItemSchema.extend({
    isSystem: z.boolean().default(false),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

export const menuItemResponseSchema = menuItemSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type MenuItemResponse = z.infer<typeof menuItemResponseSchema>;

export const reorderMenuItemsSchema = z.object({
    items: z.array(
        z.object({
            id: z.number(),
            order: z.number(),
        }),
    ),
});

export type ReorderMenuItemsRequest = z.infer<typeof reorderMenuItemsSchema>;
