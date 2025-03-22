import { Inter } from "next/font/google";
import { NavBar } from "@/components/ui/nav-bar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Personacast",
        template: "%s | Personacast",
    },
    description: "Podcasts with AI persona twists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider>
                    <NavBar />
                    {children}
                    <Toaster />
                </SessionProvider>
            </body>
        </html>
    );
}
