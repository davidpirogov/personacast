import { variablesService } from "@/services/variables-service";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        // Get the user session to check permissions
        const session = await auth();

        // Only allow access to users with podcaster:admin role
        if (!session?.user?.role || session.user.role !== "podcaster:admin") {
            return NextResponse.json({ value: "false" });
        }

        // Try to get the variable from the database
        const variable = await variablesService.getByName("SHOW_DEBUG_CONTROLS");

        // If the variable exists in the database, return its value
        if (variable) {
            return NextResponse.json({ value: variable.value });
        }

        // If the variable doesn't exist in the database, use environment variable
        const envValue = process.env.APP_SHOW_DEBUG_CONTROLS === "true" ? "true" : "false";

        return NextResponse.json({ value: envValue });
    } catch (error) {
        console.error("Error getting SHOW_DEBUG_CONTROLS variable:", error);
        return NextResponse.json({ value: "false" });
    }
}
