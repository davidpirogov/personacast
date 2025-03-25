"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSessionState } from "@/lib/hooks/use-session-state";

const staticLinks = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "Podcasts",
        href: "/podcasts",
    },
];

const defaultSignInLink = {
    title: "Sign in",
    href: "/sign-in",
};

const defaultSignOutLink = {
    title: "Sign out",
    href: "/sign-out",
};

function QuickLinksContent() {
    const { session } = useSessionState();

    const [authLink, setAuthLink] = useState<{ title: string; href: string }>(defaultSignInLink);

    useEffect(() => {
        const authLink = session ? defaultSignOutLink : defaultSignInLink;
        setAuthLink(authLink);
    }, [session]);

    return (
        <div className="space-y-4">
            {staticLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block">
                    <Card className="overflow-hidden bg-background/40 hover:bg-background/90 transition-colors">
                        <CardHeader className="p-4">
                            <span>{link.title}</span>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export function QuickLinks() {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <QuickLinksContent />
        </div>
    );
}
