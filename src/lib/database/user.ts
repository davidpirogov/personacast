import { cache } from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";

export const getCurrentUser = cache(async () => {
    const session = await auth();
    if (!session?.user) {
        return null;
    }
    return session.user;
});

export const canAccessAdmin = async (user: Session["user"] | null) => {
    if (!user) return false;
    // Only allow users with elevated roles
    return user.role === "podcaster:admin";
};

export const canAccessStudio = async (user: Session["user"] | null) => {
    if (!user) return false;
    // Only allow users with elevated roles
    return user.role === "podcaster:editor";
};

export const isRoleAnAuthenticatedRole = (roleName: string | undefined | null) => {
    if (!roleName) return false;

    return roleName === "authenticated" || roleName.startsWith("podcaster");
};
