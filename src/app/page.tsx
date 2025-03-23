"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loading";
import { HeroSection } from "@/components/sections/hero-section";

export default function LandingPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            // redirect("/dashboard");
        }
    }, [session]);

    if (status === "loading") {
        return <Loader />;
    }

    return (
        <main className="min-h-screen bg-background">
            <HeroSection />
        </main>
    );
}
