"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loading";
import { redirect } from "next/navigation";

export default function SignInPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            redirect("/");
        }
    }, [session]);

    if (status === "loading") {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Sign in</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        When signing in for the first time, your account will need to be approved by admins.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Choose your preferred authentication method</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" variant="outline" onClick={() => signIn("discord")}>
                            Continue with Discord
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
