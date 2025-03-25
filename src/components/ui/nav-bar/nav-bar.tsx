"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signIn, signOut } from "next-auth/react";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useSessionState } from "@/lib/hooks/use-session-state";
import { useMenu } from "@/components/providers/menu/menu-provider";
import Image from "next/image";
import { useSiteSettings } from "@/app/providers";

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
    return (
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {src ? (
                <Image src={src} alt={alt} fill sizes="32px" className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                    {alt.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
}

export function NavBar() {
    const pathname = usePathname();
    const isAdminSection = pathname?.startsWith("/admin");
    const { session, isLoading } = useSessionState();
    const { menuItems, isLoading: isMenuLoading } = useMenu();
    const { canAccessAdmin } = usePermissions();
    const siteSettings = useSiteSettings();

    const isActive = (href: string, exact?: boolean) => {
        if (href === "/" || exact) {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    // Show loading state
    if (isLoading || isMenuLoading) {
        return (
            <nav className="fixed top-0 z-50 w-full bg-background/5 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="mr-6 flex items-center space-x-2">
                                <span className="font-bold text-foreground">{siteSettings.title}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Get top-level menu items
    const topLevelItems = menuItems.filter((item) => !item.parentId);

    // Get admin submenu items if we're in the admin section
    const adminParentItem = topLevelItems.find((item) => item.href === "/admin");
    const adminSubItems = adminParentItem
        ? menuItems.filter((item) => item.parentId === adminParentItem.id)
        : [];

    return (
        <nav className="fixed top-0 z-50 w-full bg-white backdrop-blur-lg border-b border-gray-200 supports-[backdrop-filter]:bg-white/95 data-[theme=landing]:bg-background/5 data-[theme=landing]:backdrop-blur-lg data-[theme=landing]:border-b data-[theme=landing]:border-white/10 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="mr-6 flex items-center space-x-2">
                                <span className="font-bold text-foreground">{siteSettings.title}</span>
                            </Link>
                            <NavigationMenu>
                                <NavigationMenuList className="gap-6">
                                    {topLevelItems.map((item) => (
                                        <NavigationMenuItem key={item.id}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "data-[theme=landing]:text-foreground/80 data-[theme=workzone]:text-foreground/80 transition-colors px-3 py-2 rounded-md",
                                                    isActive(item.href)
                                                        ? "data-[theme=landing]:bg-primary data-[theme=landing]:text-primary-foreground data-[theme=workzone]:bg-primary data-[theme=workzone]:text-primary-foreground"
                                                        : "data-[theme=landing]:hover:bg-primary/10 data-[theme=landing]:hover:text-primary-foreground data-[theme=workzone]:hover:bg-primary/10 data-[theme=workzone]:hover:text-primary-foreground",
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <div className="flex items-center">
                            {session ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar src={session.user.image} alt={session.user.name || ""} />
                                        <div className="flex flex-col">
                                            <div className="text-foreground/80">
                                                <div className="text-sm font-bold">{session.user.name}</div>
                                                <div className="text-xs mt-[-2px] text-foreground/60">
                                                    {session.user.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Admin Submenu - Desktop */}
                    {isAdminSection && adminSubItems.length > 0 && (
                        <div className="border-t border-border/10">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-6 h-12">
                                    {adminSubItems.map((item) => (
                                        <NavigationMenuItem key={item.id}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "data-[theme=landing]:text-foreground/80 data-[theme=workzone]:text-foreground/80 transition-colors px-3 py-2 rounded-md",
                                                    isActive(item.href, true)
                                                        ? "data-[theme=landing]:bg-accent/10 data-[theme=landing]:text-accent-foreground data-[theme=workzone]:bg-accent/10 data-[theme=workzone]:text-accent-foreground"
                                                        : "data-[theme=landing]:hover:bg-accent/20 data-[theme=landing]:hover:text-accent-foreground data-[theme=workzone]:hover:bg-accent/20 data-[theme=workzone]:hover:text-accent-foreground",
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex h-14 items-center justify-between md:hidden">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
                                <SheetTitle className="px-4 pt-4 pb-2">{siteSettings.title} Menu</SheetTitle>
                                <NavigationMenu
                                    orientation="vertical"
                                    className="w-full [&_[role=menuitem]]:w-full"
                                >
                                    <NavigationMenuList className="flex-col items-stretch gap-0 w-full [&>li]:w-full">
                                        {/* Main Menu Items */}
                                        {topLevelItems.map((item, index) => (
                                            <NavigationMenuItem
                                                key={item.id}
                                                className={cn(
                                                    "w-full flex !inline-flex [&>a]:w-full",
                                                    index !== 0 ? "border-t" : "",
                                                )}
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "w-full h-full py-3 px-4 block",
                                                        isActive(item.href)
                                                            ? "bg-accent text-accent-foreground"
                                                            : "hover:bg-accent/50",
                                                    )}
                                                >
                                                    {item.label}
                                                </Link>
                                            </NavigationMenuItem>
                                        ))}

                                        {/* Admin Submenu Items - Mobile */}
                                        {isAdminSection && adminSubItems.length > 0 && (
                                            <>
                                                <div className="py-[1px] px-4 text-sm font-medium text-foreground/60 border-t"></div>
                                                {adminSubItems.map((item) => (
                                                    <NavigationMenuItem
                                                        key={item.id}
                                                        className="w-full flex !inline-flex [&>a]:w-full"
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            className={cn(
                                                                "w-full h-full py-3 px-5 block text-sm",
                                                                isActive(item.href, true)
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "hover:bg-accent/50",
                                                            )}
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </NavigationMenuItem>
                                                ))}
                                            </>
                                        )}

                                        {/* Authentication - Mobile Menu */}
                                        <div className="mt-4 px-4 py-2 border-t">
                                            {session ? (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-sm text-foreground/80">
                                                        {session.user.name} ({session.user.role})
                                                    </span>
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => signIn()}
                                                    className="text-sm text-foreground/70 hover:text-foreground"
                                                >
                                                    Admin & Editor Login
                                                </button>
                                            )}
                                        </div>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </SheetContent>
                        </Sheet>
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-bold">{siteSettings.title}</span>
                        </Link>
                    </div>

                    {/* Authentication - Mobile Top Bar */}
                    <div className="flex items-center">
                        {session && (
                            <button
                                onClick={() => signOut()}
                                className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors text-sm"
                            >
                                Sign out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
