"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/components/ui/loading";

interface SessionCheckProps {
    redirectTo?: string;
    redirectIfOnPage?: boolean;
}

export function SessionCheck({ redirectTo = "/", redirectIfOnPage = true }: SessionCheckProps) {
    const { data: session, status } = useSession();

    useEffect(() => {
        // Only redirect if we have a session and either:
        // 1. We're not already on the page we're redirecting to (prevents infinite loop)
        // 2. redirectIfOnPage is true (explicit override)
        if (session && (window.location.pathname !== redirectTo || redirectIfOnPage)) {
            redirect(redirectTo);
        }
    }, [session, redirectTo, redirectIfOnPage]);

    if (status === "loading") {
        return <Loader />;
    }

    return null;
}
