import { ApiClientsService } from "@/services/api-clients-service";
import { NextRequest, NextResponse } from "next/server";
import {
    apiClientListResponseSchema,
    apiClientSingleResponseSchema,
    apiClientCreationSingleResponseSchema,
    createApiClientSchema,
    apiClientResponseFields,
    type ApiClientSelect,
} from "@/schemas/api-clients/schema";

export async function GET(request: NextRequest) {
    try {
        // Parse select fields from query params
        const searchParams = request.nextUrl.searchParams;
        const selectParam = searchParams.get("select");
        const select: ApiClientSelect = selectParam ? JSON.parse(selectParam) : apiClientResponseFields;

        const clients = await new ApiClientsService().getAllClients();

        // Validate response against schema with selected fields
        const response = apiClientListResponseSchema.parse({ clients });
        return NextResponse.json(response);
    } catch (error) {
        console.error("System error getting API clients:", error);
        return NextResponse.json({ error: "Failed to get API clients" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate request body against schema
        const validatedData = createApiClientSchema.parse(data);

        const client = await new ApiClientsService().createClient(validatedData);

        // Validate response against creation schema that includes token
        const response = apiClientCreationSingleResponseSchema.parse({ client });
        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error("System error creating API client:", error);
        return NextResponse.json({ error: "Failed to create API client" }, { status: 500 });
    }
}
