"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface FormContextType {
    titleValue: string;
    isGeneratingSlug: boolean;
    originalSlug?: string;
    setTitleValue: (value: string) => void;
    setIsGeneratingSlug: (value: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({
    children,
    initialTitle = "",
    originalSlug,
}: {
    children: ReactNode;
    initialTitle?: string;
    originalSlug?: string;
}) {
    const [titleValue, setTitleValueState] = useState(initialTitle);
    const [isGeneratingSlug, setIsGeneratingSlugState] = useState(!originalSlug);

    // Memoize the callbacks to prevent unnecessary rerenders
    const setTitleValue = useCallback((value: string) => {
        setTitleValueState(value);
    }, []);

    const setIsGeneratingSlug = useCallback((value: boolean) => {
        setIsGeneratingSlugState(value);
    }, []);

    // Memoize the context value to ensure it doesn't change unless the state changes
    const contextValue = useMemo(
        () => ({
            titleValue,
            isGeneratingSlug,
            originalSlug,
            setTitleValue,
            setIsGeneratingSlug,
        }),
        [titleValue, isGeneratingSlug, originalSlug, setTitleValue, setIsGeneratingSlug],
    );

    return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
}

export function useFormState() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error("useFormState must be used within a FormProvider");
    }
    return context;
}
