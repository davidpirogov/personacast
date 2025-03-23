"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableCellProps, ColumnMeta } from "./types";
import { useState, useEffect } from "react";

export function TextCell<TData>({ value }: DataTableCellProps<TData>) {
    return <span className="font-medium">{value}</span>;
}

export function DateCell<TData>({ value }: DataTableCellProps<TData>) {
    const [formattedDate, setFormattedDate] = useState(() => {
        // Initial render - use ISO format for consistency
        return new Date(value).toISOString().split("T")[0];
    });

    useEffect(() => {
        // After hydration - use locale-specific format
        setFormattedDate(
            new Date(value).toLocaleDateString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),
        );
    }, [value]);

    return (
        <time dateTime={new Date(value).toISOString()} suppressHydrationWarning>
            {formattedDate}
        </time>
    );
}

export function BooleanCell<TData>({ value }: DataTableCellProps<TData>) {
    return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
}

export function ImageCell<TData>({ value, row }: DataTableCellProps<TData>) {
    if (!value) return null;

    return (
        <div className="flex items-center gap-2">
            <img src={value} alt={(row as any).name || "Image"} className="h-8 w-8 rounded-full" />
        </div>
    );
}

export function ActionsCell<TData>({ row, column }: DataTableCellProps<TData>) {
    const meta = column.columnDef.meta as ColumnMeta<TData>;
    if (!meta?.actions) return null;

    return <div className="flex justify-end gap-2">{meta.actions(row)}</div>;
}
