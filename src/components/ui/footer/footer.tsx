"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSiteSettings } from "@/app/providers";
import { useSessionState } from "@/lib/hooks/use-session-state";

export function Footer() {
    const siteSettings = useSiteSettings();
    const { session } = useSessionState();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 data-[theme=landing]:bg-background/5 py-12 border-t border-slate-200 data-[theme=landing]:border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">{siteSettings.title}</h3>
                        <p className="text-slate-600 data-[theme=landing]:text-slate-300 mb-4">
                            {siteSettings.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-slate-600 hover:text-slate-900 data-[theme=landing]:text-slate-300 data-[theme=landing]:hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/podcasts"
                                    className="text-slate-600 hover:text-slate-900 data-[theme=landing]:text-slate-300 data-[theme=landing]:hover:text-white"
                                >
                                    Podcasts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">About</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-slate-600 hover:text-slate-900 data-[theme=landing]:text-slate-300 data-[theme=landing]:hover:text-white"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-slate-600 hover:text-slate-900 data-[theme=landing]:text-slate-300 data-[theme=landing]:hover:text-white"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 data-[theme=landing]:border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-600 data-[theme=landing]:text-slate-400">
                        © {currentYear} {siteSettings.title}. All rights reserved.
                    </p>

                    {!session && (
                        <button
                            onClick={() => signIn()}
                            className="text-sm text-slate-500 hover:text-slate-700 data-[theme=landing]:text-slate-400 data-[theme=landing]:hover:text-white mt-4 md:mt-0"
                        >
                            Admin & Editor Login
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}
