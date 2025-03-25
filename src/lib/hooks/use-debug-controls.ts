"use client";

import { useState, useEffect } from "react";
import { usePermissions } from "./usePermissions";

interface DebugControlsState {
    showDebugControls: boolean;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook to determine if debug controls should be shown
 * Only users with podcaster:admin role can see debug controls and
 * only if the server-side APP_SHOW_DEBUG_CONTROLS is enabled
 */
export function useDebugControls(): DebugControlsState {
    const [state, setState] = useState<DebugControlsState>({
        showDebugControls: false,
        isLoading: true,
        error: null,
    });

    const { canAccessAdmin } = usePermissions();

    useEffect(() => {
        // Only fetch if user has admin permissions
        if (!canAccessAdmin) {
            setState({
                showDebugControls: false,
                isLoading: false,
                error: null,
            });
            return;
        }

        async function fetchDebugControlsConfig() {
            try {
                const response = await fetch("/api/variables/named/SHOW_DEBUG_CONTROLS");

                if (!response.ok) {
                    throw new Error("Failed to fetch debug controls configuration");
                }

                const data = await response.json();

                setState({
                    showDebugControls: data.value === "true",
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                setState({
                    showDebugControls: false,
                    isLoading: false,
                    error: error instanceof Error ? error : new Error("Unknown error"),
                });
            }
        }

        fetchDebugControlsConfig();
    }, [canAccessAdmin]);

    return state;
}
