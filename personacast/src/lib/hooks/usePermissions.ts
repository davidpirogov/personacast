import { useSession } from "next-auth/react";

const DEFAULT_AUTHENTICATED = {
    canView: false,
    canEdit: false,
    canDelete: false,
    canAccessAdmin: false,
    isAuthenticated: true,
    role: "authenticated",
};

export function usePermissions() {
    const { data: session } = useSession();
    const role = session?.user?.role || "authenticated";

    // If no session, return not authenticated
    if (!session) {
        return {
            canView: false,
            canEdit: false,
            canDelete: false,
            canAccessAdmin: false,
            isAuthenticated: false,
            role: "unauthenticated",
        };
    }

    // Default authenticated user with no special permissions
    if (role === "authenticated") {
        return DEFAULT_AUTHENTICATED;
    }

    // Return role-specific permissions
    return {
        canView: ["podcaster:editor", "podcaster:admin"].includes(role),
        canEdit: ["podcaster:editor", "podcaster:admin"].includes(role),
        canDelete: ["podcaster:editor", "podcaster:admin"].includes(role),
        canAccessAdmin: role === "podcaster:admin",
        isAuthenticated: true,
        role,
    };
}
