"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { isRoleAnAuthenticatedRole } from "@/lib/database/user";

export function useSessionState() {
    const session = useSession();

    const isAuthenticated = useCallback(() => {
        if (!session.data) return false;

        // Check if user has a role
        const role = session.data.user?.role;
        if (!role) return false;

        return isRoleAnAuthenticatedRole(role);
    }, [session.data]);

    return {
        session: session.data,
        status: session.status,
        update: session.update,
        isLoading: session.status === "loading",
        isAuthenticated: isAuthenticated(),
    };
}
