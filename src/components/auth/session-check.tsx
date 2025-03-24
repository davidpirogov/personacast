"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/components/ui/loading";

interface SessionCheckProps {
    redirectTo?: string;
}

export function SessionCheck({ redirectTo = "/" }: SessionCheckProps) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            redirect(redirectTo);
        }
    }, [session, redirectTo]);

    if (status === "loading") {
        return <Loader />;
    }

    return null;
}
