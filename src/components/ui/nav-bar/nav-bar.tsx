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
import Image from "next/image";
import { Role } from "next-auth";
import { navBarClasses } from "./classes";

type NavItem = {
    href: string;
    className: string;
    children: string;
    exact?: boolean;
    roles?: Role[];
};

const navItems: NavItem[] = [
    {
        href: "/",
        className: "text-foreground transition-colors",
        children: "Home",
        roles: [],
    },
    {
        href: "/podcasts",
        className: "text-foreground transition-colors",
        children: "Podcasts",
        roles: [],
    },
    {
        href: "/studio",
        className: "text-foreground transition-colors",
        children: "Studio",
        roles: ["podcaster:editor", "podcaster:admin"],
    },
    {
        href: "/admin",
        className: "text-foreground transition-colors",
        children: "Admin",
        roles: ["podcaster:admin"],
    },
];

const adminNavItems: NavItem[] = [
    {
        href: "/admin/api-clients",
        className: "text-foreground transition-colors",
        children: "API Clients",
    },
    {
        href: "/admin/users",
        className: "text-foreground transition-colors",
        children: "Users",
    },
    {
        href: "/admin/theming",
        className: "text-foreground transition-colors",
        children: "Theming",
    },
];

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
    const isStudioSection = pathname?.startsWith("/studio");
    const { session, isLoading } = useSessionState();
    const { canAccessAdmin } = usePermissions();

    const isActive = (href: string, exact?: boolean) => {
        if (href === "/" || exact) {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    // Admin menu is disabled for now
    const isAdminMenuEnabled = false;

    // Show loading state
    if (isLoading) {
        return (
            <nav className="fixed top-0 z-50 w-full bg-background/5 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="mr-6 flex items-center space-x-2">
                                <span className="font-bold text-foreground">Personacast</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    const renderableMenuItems = navItems
        .map((item) => {
            // If the item has no roles, it is visible to all users
            if (item.roles && item.roles.length === 0) {
                return item;
            }
            // If the user is not authenticated, the item is not visible
            if (!session) {
                return null;
            }

            // If the item has roles, it is only visible to users with the required roles
            if (item.roles && item.roles.length > 0 && item.roles.includes(session?.user.role)) {
                return item;
            }

            return null;
        })
        .filter((item) => item !== null);

    const useLandingTheme = !isAdminSection && !isStudioSection;
    const navBarClassName = navBarClasses(useLandingTheme);

    console.log("navBarClassName", navBarClassName);

    return (
        <nav data-theme={useLandingTheme ? "landing" : "workzone"} className={navBarClassName}>
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="mr-6 flex items-center space-x-2">
                                <span className="font-bold text-foreground">Personacast</span>
                            </Link>
                            <NavigationMenu>
                                <NavigationMenuList className="gap-6">
                                    {renderableMenuItems.map((props) => (
                                        <NavigationMenuItem key={props.href}>
                                            <Link
                                                {...props}
                                                className={cn(
                                                    "landing:text-foreground/80 workzone:text-foreground/80 transition-colors px-3 py-2 rounded-md",
                                                    isActive(props.href)
                                                        ? "landing:bg-accent landing:text-accent-foreground workzone:bg-primary workzone:text-primary-foreground"
                                                        : "landing:hover:bg-accent/10 landing:hover:text-accent-foreground workzone:hover:bg-primary/10 workzone:hover:text-primary-foreground",
                                                )}
                                            />
                                        </NavigationMenuItem>
                                    ))}
                                    {isAdminMenuEnabled && session && canAccessAdmin && (
                                        <NavigationMenuItem>
                                            <Link
                                                href="/admin"
                                                className={cn(
                                                    "text-foreground/80 transition-colors px-3 py-2 rounded-md",
                                                    isActive("/admin")
                                                        ? "bg-accent/10 text-accent-foreground"
                                                        : "hover:bg-accent/20 hover:text-accent-foreground",
                                                )}
                                            >
                                                Admin
                                            </Link>
                                        </NavigationMenuItem>
                                    )}
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
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Admin Submenu - Desktop */}
                    {isAdminSection && (
                        <div className="border-t border-border/10">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-6 h-12">
                                    {adminNavItems.map((props) => (
                                        <NavigationMenuItem key={props.href}>
                                            <Link
                                                href={props.href}
                                                className={cn(
                                                    "landing:text-foreground/80 workzone:text-foreground/80 transition-colors px-3 py-2 rounded-md",
                                                    isActive(props.href, props.exact)
                                                        ? "landing:bg-accent/10 landing:text-accent-foreground workzone:bg-accent/10 workzone:text-accent-foreground"
                                                        : "landing:hover:bg-accent/20 landing:hover:text-accent-foreground workzone:hover:bg-accent/20 workzone:hover:text-accent-foreground",
                                                )}
                                            >
                                                {props.children}
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
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetTitle>Personacast Menu</SheetTitle>
                                <NavigationMenu
                                    orientation="vertical"
                                    className="w-full [&_[role=menuitem]]:w-full"
                                >
                                    <NavigationMenuList className="flex-col items-stretch gap-0 w-full [&>li]:w-full">
                                        {/* Main Menu Items */}
                                        {navItems.map((props, index) => (
                                            <NavigationMenuItem
                                                key={props.href}
                                                className={cn(
                                                    "w-full flex !inline-flex [&>a]:w-full",
                                                    index !== 0 ? "border-t" : "",
                                                )}
                                            >
                                                <Link
                                                    {...props}
                                                    className={cn(
                                                        props.className,
                                                        "w-full h-full py-4 px-4 block",
                                                        isActive(props.href)
                                                            ? "bg-accent text-accent-foreground"
                                                            : "hover:bg-accent/50",
                                                    )}
                                                />
                                            </NavigationMenuItem>
                                        ))}

                                        {/* Conditional Admin Link */}
                                        {session && canAccessAdmin && (
                                            <NavigationMenuItem className="w-full flex !inline-flex [&>a]:w-full border-t">
                                                <Link
                                                    href="/admin"
                                                    className={cn(
                                                        "text-foreground/80 transition-colors",
                                                        "w-full h-full py-4 px-4 block",
                                                        isActive("/admin")
                                                            ? "bg-accent/10 text-accent-foreground"
                                                            : "hover:bg-accent/20 hover:text-accent-foreground",
                                                    )}
                                                >
                                                    Admin
                                                </Link>
                                            </NavigationMenuItem>
                                        )}

                                        {/* Admin Submenu Items - Mobile */}
                                        {isAdminSection && session && canAccessAdmin && (
                                            <>
                                                <div className="py-[1px] px-4 text-sm font-medium text-foreground/60 border-t"></div>
                                                {adminNavItems.map((props) => (
                                                    <NavigationMenuItem
                                                        key={props.href}
                                                        className="w-full flex !inline-flex [&>a]:w-full"
                                                    >
                                                        <Link
                                                            href={props.href}
                                                            className={cn(
                                                                props.className,
                                                                "w-full h-full py-4 px-6 block text-sm",
                                                                isActive(props.href, props.exact)
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "hover:bg-accent/50",
                                                            )}
                                                        >
                                                            {props.children}
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
                                                    className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                                                >
                                                    Sign in
                                                </button>
                                            )}
                                        </div>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </SheetContent>
                        </Sheet>
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-bold">Personacast</span>
                        </Link>
                    </div>

                    {/* Authentication - Mobile Top Bar */}
                    <div className="flex items-center">
                        {session ? (
                            <button
                                onClick={() => signOut()}
                                className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                            >
                                Sign out
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground hover:bg-accent/20 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
