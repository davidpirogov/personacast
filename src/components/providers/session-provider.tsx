"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

const REFRESH_INTERVAL = 5 * 60;

export function SessionProvider({ children, session }: { children: ReactNode; session: Session | null }) {
    return (
        <NextAuthSessionProvider
            refetchInterval={REFRESH_INTERVAL}
            refetchOnWindowFocus={false}
            session={session}
        >
            {children}
        </NextAuthSessionProvider>
    );
}
