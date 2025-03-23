import { NextRequest, NextResponse } from "next/server";
import { variablesService } from "@/services/variables-service";
import { variableSchema } from "@/schemas/variables";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validatedData = variableSchema.parse(body);

        // Create variable
        const variable = await variablesService.create(validatedData);

        return NextResponse.json(variable);
    } catch (error) {
        console.error("Error creating variable:", error);
        return NextResponse.json({ error: "Error creating variable" }, { status: 400 });
    }
}
