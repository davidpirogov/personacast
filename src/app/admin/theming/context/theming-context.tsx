"use client";

import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { SiteSettings } from "../defaults";

interface ThemingState {
    settings: SiteSettings;
    isDirty: boolean;
    isLoading: boolean;
    error: string | null;
}

interface ThemingActions {
    updateSettings: (updates: Partial<SiteSettings>) => void;
    updateHeroImage: (heroId: string | null, type: "url" | "upload" | "default") => void;
    saveChanges: () => Promise<void>;
    resetChanges: () => void;
}

type ThemingContextType = ThemingState & ThemingActions;

const ThemingContext = createContext<ThemingContextType | null>(null);

type ThemingAction =
    | { type: "UPDATE_SETTINGS"; payload: Partial<SiteSettings> }
    | { type: "UPDATE_HERO_IMAGE"; payload: { heroId: string | null; type: "url" | "upload" | "default" } }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SAVE_SUCCESS"; payload: SiteSettings }
    | { type: "RESET"; payload: SiteSettings };

function themingReducer(state: ThemingState, action: ThemingAction): ThemingState {
    switch (action.type) {
        case "UPDATE_SETTINGS":
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
                isDirty: true,
            };
        case "UPDATE_HERO_IMAGE":
            const newState = {
                ...state,
                settings: {
                    ...state.settings,
                    hero: {
                        ...state.settings.hero,
                        fileId: action.payload.heroId,
                    },
                },
                isDirty: true,
            };
            return newState;
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SAVE_SUCCESS":
            return {
                ...state,
                settings: action.payload,
                isDirty: false,
                isLoading: false,
                error: null,
            };
        case "RESET":
            return {
                ...state,
                settings: action.payload,
                isDirty: false,
                isLoading: false,
                error: null,
            };
        default:
            return state;
    }
}

interface ThemingProviderProps {
    children: ReactNode;
    initialSettings: SiteSettings;
}

export function ThemingProvider({ children, initialSettings }: ThemingProviderProps) {
    const [state, dispatch] = useReducer(themingReducer, {
        settings: initialSettings,
        isDirty: false,
        isLoading: false,
        error: null,
    });

    const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
        dispatch({ type: "UPDATE_SETTINGS", payload: updates });
    }, []);

    const updateHeroImage = useCallback((heroId: string | null, type: "url" | "upload" | "default") => {
        dispatch({ type: "UPDATE_HERO_IMAGE", payload: { heroId, type } });
    }, []);

    const saveChanges = useCallback(async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERROR", payload: null });

            // Get the current site_settings variable
            const getResponse = await fetch(`/api/variables/by-name/system.site_settings`, {
                method: "GET",
            });

            if (!getResponse.ok) {
                const errorData = await getResponse.json();
                throw new Error(errorData.error || "Failed to get current settings");
            }

            const currentVariable = await getResponse.json();

            // Update the site_settings variable
            const response = await fetch(`/api/variables/${currentVariable.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "system.site_settings",
                    value: JSON.stringify(state.settings),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save settings");
            }

            const updatedVariable = await response.json();
            const parsedSettings = JSON.parse(updatedVariable.value);

            dispatch({ type: "SAVE_SUCCESS", payload: parsedSettings });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: error instanceof Error ? error.message : "Failed to save settings",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [state.settings]);

    const resetChanges = useCallback(() => {
        dispatch({ type: "RESET", payload: initialSettings });
    }, [initialSettings]);

    const contextValue = {
        ...state,
        updateSettings,
        updateHeroImage,
        saveChanges,
        resetChanges,
    };

    return <ThemingContext.Provider value={contextValue}>{children}</ThemingContext.Provider>;
}

export function useTheming() {
    const context = useContext(ThemingContext);
    if (!context) {
        throw new Error("useTheming must be used within a ThemingProvider");
    }
    return context;
}
