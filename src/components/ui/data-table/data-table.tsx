"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableProps } from "./types";

export function DataTable<TData>({
    data,
    columns,
    emptyState = {
        title: "No data available",
        description: "Try adjusting your filters or adding new data.",
    },
    defaultSorting = [],
    onRowClick,
    className = "relative overflow-x-auto shadow-md sm:rounded-lg",
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>(defaultSorting);

    const table = useReactTable({
        data: data,
        columns: columns as ColumnDef<TData, any>[],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const EmptyState = () => (
        <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm font-medium">{emptyState.title}</p>
                    {emptyState.description && (
                        <p className="text-sm text-muted-foreground">{emptyState.description}</p>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className={cn("rounded-md border", className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={cn(
                                        header.column.getCanSort() && "cursor-pointer select-none",
                                        header.column.columnDef.meta?.className,
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && <ArrowUpDown className="h-4 w-4" />}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <EmptyState />
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                onClick={() => onRowClick?.(row.original)}
                                className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cell.column.columnDef.meta?.className}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
