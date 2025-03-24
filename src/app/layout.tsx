import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ThemeScript } from "@/components/providers/theme-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | Personacast",
        default: "Personacast",
    },
    description: "Podcasts with AI persona twists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
            </head>
            <body className={inter.className}>
                <ThemeScript />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
