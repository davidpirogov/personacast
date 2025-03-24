import { variablesService } from "@/services/variables-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    try {
        const resolvedParams = await params;
        const name = resolvedParams.name;

        if (!name) {
            return NextResponse.json({ error: "Variable name is required" }, { status: 400 });
        }

        const variable = await variablesService.getByName(name);

        if (!variable) {
            return NextResponse.json({ error: `Variable "${name}" not found` }, { status: 404 });
        }

        return NextResponse.json(variable);
    } catch (error) {
        console.error("Error getting variable by name:", error);
        return NextResponse.json({ error: "Failed to get variable" }, { status: 500 });
    }
}
