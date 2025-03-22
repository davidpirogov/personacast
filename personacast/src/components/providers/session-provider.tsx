"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const REFRESH_INTERVAL = 5 * 60;

export function SessionProvider({ children }: { children: ReactNode }) {
    return (
        <NextAuthSessionProvider refetchInterval={REFRESH_INTERVAL} refetchOnWindowFocus={true}>
            {children}
        </NextAuthSessionProvider>
    );
}
