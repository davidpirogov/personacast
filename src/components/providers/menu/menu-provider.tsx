"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem } from "@/types/database";
import { useSessionState } from "@/lib/hooks/use-session-state";

// Define the shape of our context
interface MenuContextType {
    menuItems: MenuItem[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

// Create the context with a default value
const MenuContext = createContext<MenuContextType>({
    menuItems: [],
    isLoading: true,
    error: null,
    refetch: async () => {},
});

// Hook to use the menu context
export const useMenu = () => useContext(MenuContext);

// Filter menu items based on user role
function filterMenuItemsByRole(menuItems: MenuItem[], role: string | null): MenuItem[] {
    return menuItems
        .filter(
            (item) =>
                item.isActive &&
                (item.requiredRoles.length === 0 || (role && item.requiredRoles.includes(role))),
        )
        .map((item) => ({
            ...item,
            children: item.children ? filterMenuItemsByRole(item.children, role) : undefined,
        }));
}

// Menu provider component
export function MenuProvider({ children }: { children: ReactNode }) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { session } = useSessionState();

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/menu-items?tree=true");

            if (!response.ok) {
                throw new Error("Failed to fetch menu items");
            }

            const data = await response.json();
            setMenuItems(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching menu items:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Filter menu items based on user role
    const filteredMenuItems = filterMenuItemsByRole(menuItems, session?.user?.role || null);

    return (
        <MenuContext.Provider
            value={{
                menuItems: filteredMenuItems,
                isLoading,
                error,
                refetch: fetchMenuItems,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}
