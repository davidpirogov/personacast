import { Inter } from "next/font/google";
import { NavBar } from "@/components/ui/nav-bar/nav-bar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Personacast",
        template: "%s | Personacast",
    },
    description: "Podcasts with AI persona twist",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <html lang="en">
            <ThemeProvider className={inter.className}>
                <SessionProvider session={session}>
                    <NavBar />
                    {children}
                    <Toaster />
                </SessionProvider>
            </ThemeProvider>
        </html>
    );
}
