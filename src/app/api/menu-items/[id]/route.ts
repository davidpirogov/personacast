import { NextRequest, NextResponse } from "next/server";
import { menuItemsService } from "@/services/menu-items-service";
import { menuItemSchema, menuItemUpdateSchema } from "@/schemas/menu-items";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid menu item ID" }, { status: 400 });
        }

        // Check for children parameter to include children
        const { searchParams } = new URL(req.url);
        const includeChildren = searchParams.get("children") === "true";

        let menuItem;
        if (includeChildren) {
            menuItem = await menuItemsService.getWithChildren(id);
        } else {
            menuItem = await menuItemsService.get(id);
        }

        if (!menuItem) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error("Error fetching menu item:", error);
        return NextResponse.json({ error: "Error fetching menu item" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid menu item ID" }, { status: 400 });
        }

        // Get existing menu item to check if it's a system item
        const existingItem = await menuItemsService.get(id);
        if (!existingItem) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }

        const body = await req.json();

        // For system items, only allow updating label, order, and isActive
        if (existingItem.isSystem) {
            const { label, order, isActive } = body;
            const validatedData = menuItemUpdateSchema.parse({ label, order, isActive });
            const menuItem = await menuItemsService.update(id, validatedData);
            return NextResponse.json(menuItem);
        }

        // For non-system items, allow all updates
        const validatedData = menuItemUpdateSchema.parse(body);
        const menuItem = await menuItemsService.update(id, validatedData);

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json({ error: "Error updating menu item" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid menu item ID" }, { status: 400 });
        }

        await menuItemsService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu item:", error);

        if (error instanceof Error && error.message === "Cannot delete system menu item") {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json({ error: "Error deleting menu item" }, { status: 500 });
    }
}
