import { NextRequest, NextResponse } from "next/server";
import { menuItemsService } from "@/services/menu-items-service";
import { reorderMenuItemsSchema } from "@/schemas/menu-items";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validatedData = reorderMenuItemsSchema.parse(body);

        // Reorder all menu items while preserving the relative order of specified items
        await menuItemsService.reorderItems(validatedData.items);

        return NextResponse.json({
            success: true,
            message: "All menu items have been reordered successfully"
        });
    } catch (error) {
        console.error("Error reordering menu items:", error);
        
        if (error instanceof ZodError) {
            return NextResponse.json({ 
                error: "Invalid request data",
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to reorder menu items",
            message: error instanceof Error ? error.message : "Unknown error occurred"
        }, { status: 500 });
    }
}
