import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "./(client)/providers/root-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PersonaCast",
    description: "Your AI-powered podcast platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <RootProvider>{children}</RootProvider>
            </body>
        </html>
    );
}
