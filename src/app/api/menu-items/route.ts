import { NextRequest, NextResponse } from "next/server";
import { menuItemsService } from "@/services/menu-items-service";
import { menuItemCreateSchema } from "@/schemas/menu-items";

export async function GET(req: NextRequest) {
    try {
        // Check for tree parameter to return hierarchical data
        const { searchParams } = new URL(req.url);
        const tree = searchParams.get("tree") === "true";

        if (tree) {
            const menuItems = await menuItemsService.getMenuTree();
            return NextResponse.json(menuItems);
        } else {
            const menuItems = await menuItemsService.list();
            return NextResponse.json(menuItems);
        }
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return NextResponse.json({ error: "Error fetching menu items" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validatedData = menuItemCreateSchema.parse(body);

        // Create menu item (isSystem will be false by default)
        const menuItem = await menuItemsService.create(validatedData);

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error("Error creating menu item:", error);
        return NextResponse.json({ error: "Error creating menu item" }, { status: 400 });
    }
}
