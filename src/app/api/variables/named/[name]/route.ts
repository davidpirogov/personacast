import { variablesService } from "@/services/variables-service";
import { NextRequest, NextResponse } from "next/server";
import { variableSchema } from "@/schemas/variables";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    try {
        const resolvedParams = await params;
        const name = resolvedParams.name;
        if (!name) {
            return NextResponse.json({ error: "Invalid variable name" }, { status: 400 });
        }

        const variable = await variablesService.getByName(name);

        if (!variable) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(variable);
    } catch (error) {
        console.error("System error getting variable by name:", error);
        return NextResponse.json({ error: "Failed to get variable by name" }, { status: 500 });
    }
}
