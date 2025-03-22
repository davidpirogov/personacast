import { NextRequest, NextResponse } from "next/server";
import { UsersService } from "@/services/users-service";
import { z } from "zod";

const usersService = new UsersService();

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["podcaster:editor", "podcaster:admin"]),
    isActive: z.boolean(),
    image: z.string().nullable().optional(),
    emailVerified: z
        .string()
        .nullable()
        .optional()
        .transform((val) => (val ? new Date(val) : null)),
});

export async function GET() {
    const users = await usersService.getAllUsers();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createUserSchema.parse(body);

        const user = await usersService.createUser({
            ...validatedData,
            accounts: [],
            image: validatedData.image ?? null,
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
