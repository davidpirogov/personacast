"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { MenuItem } from "@/types/menu";

interface MenuContextType {
    menuItems: MenuItem[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType>({
    menuItems: [],
    isLoading: true,
    error: null,
    refetch: async () => {},
});

// Hook to use menu items in components
export const useMenu = () => useContext(MenuContext);

interface MenuProviderProps {
    children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/menu-items", {
                next: {
                    revalidate: 300, // Cache for 5 minutes
                    tags: ["menu-items"],
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch menu items");
            }

            const data = await response.json();
            setMenuItems(data);
        } catch (err) {
            console.error("Failed to load menu items:", err);
            setError(err instanceof Error ? err : new Error("Failed to load menu items"));
            // Set empty menu items on error to prevent UI issues
            setMenuItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <MenuContext.Provider
            value={{
                menuItems,
                isLoading,
                error,
                refetch: fetchMenuItems,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}
