import { NextRequest, NextResponse } from "next/server";
import { UsersService } from "@/services/users-service";
import { z } from "zod";

const usersService = new UsersService();

const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    role: z.enum(["podcaster:editor", "podcaster:admin"]).optional(),
    isActive: z.boolean().optional(),
    image: z.string().nullable().optional(),
    emailVerified: z
        .string()
        .nullable()
        .optional()
        .transform((val) => (val ? new Date(val) : null)),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await usersService.getUserById(params.id);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const validatedData = updateUserSchema.parse(body);

        const user = await usersService.getUserById(params.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await usersService.updateUser(params.id, validatedData);
        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await usersService.getUserById(params.id);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await usersService.deleteUser(params.id);
    return new NextResponse(null, { status: 204 });
}
