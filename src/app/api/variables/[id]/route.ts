import { variablesService } from "@/services/variables-service";
import { NextRequest, NextResponse } from "next/server";
import { variableSchema } from "@/schemas/variables";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid variable ID" }, { status: 400 });
        }

        await variablesService.delete(Number(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("System error deleting variable:", error);
        return NextResponse.json({ error: "Failed to delete variable" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid variable ID" }, { status: 400 });
        }

        const body = await req.json();

        // Validate request body
        const validatedData = variableSchema.parse(body);

        // Update variable
        const variable = await variablesService.update(id, validatedData);

        return NextResponse.json(variable);
    } catch (error) {
        console.error("Error updating variable:", error);
        return NextResponse.json({ error: "Error updating variable" }, { status: 400 });
    }
}
