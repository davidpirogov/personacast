import { Role } from "next-auth";

type NavItem = {
    href: string;
    className: string;
    children: string;
    exact?: boolean;
    roles?: Role[];
};

export const navItems: NavItem[] = [
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

export const adminNavItems: NavItem[] = [
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
    {
        href: "/admin/files",
        className: "text-foreground transition-colors",
        children: "Files",
    },
    {
        href: "/admin/hero-images",
        className: "text-foreground transition-colors",
        children: "Hero Images",
    },
    {
        href: "/admin/variables",
        className: "text-foreground transition-colors",
        children: "Variables",
    },
];
