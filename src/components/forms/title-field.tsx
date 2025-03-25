"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormState } from "@/contexts/form-context";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function TitleField() {
    const form = useFormContext();
    const { setTitleValue } = useFormState();
    const initialRenderRef = useRef(true);

    // Set initial title value in form context only once on mount
    useEffect(() => {
        if (initialRenderRef.current) {
            const initialTitle = form.getValues().title as string;
            setTitleValue(initialTitle);
            initialRenderRef.current = false;
        }
    }, [form, setTitleValue]);

    return (
        <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="My Amazing Podcast"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                setTitleValue(e.target.value);
                            }}
                            className={cn(fieldState.error && "border-red-500")}
                        />
                    </FormControl>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
            )}
        />
    );
}
