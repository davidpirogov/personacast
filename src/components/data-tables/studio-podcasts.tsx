"use client";

import Link from "next/link";
import {
    ColumnDef,
    ColumnMeta,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown, EyeIcon, PencilIcon } from "lucide-react";
import { Podcast } from "@/types/database";
import { TextCell } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { DeleteStudioPodcastDialog } from "@/components/dialogs/delete-studio-podcast-dialog";

const columns: ColumnDef<Podcast>[] = [
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: ({ row, column }) => (
            <div className="flex items-center gap-2">
                <TextCell value={row.original.title} row={row.original} column={column} />
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        enableSorting: true,
        cell: ({ row, column }) => (
            <TextCell value={row.original.description} row={row.original} column={column} />
        ),
    },
    {
        id: "actions",
        header: "",
        enableSorting: false,
        meta: {
            className: "text-right",
            actions: (podcast: Podcast) => (
                <>
                    <Link
                        href={`/studio/podcasts/${encodeURIComponent(podcast.id)}`}
                        className="px-4 py-2 bg-white border rounded text-gray-500 border-gray-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button variant="outline" size="icon">
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/studio/podcasts/${encodeURIComponent(podcast.id)}/edit`}>
                        <Button variant="outline" size="icon">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteStudioPodcastDialog podcast={podcast} />
                </>
            ),
        },
        cell: ({ row }) => (
            <div className="flex gap-2 justify-end">
                <div className="flex justify-end gap-2">
                    {(columns[columns.length - 1].meta as ColumnMeta<Podcast, Podcast>)?.actions?.(
                        row.original,
                    )}
                </div>
            </div>
        ),
    },
];

const sortIconStyles = "h-4 w-4 p-0.5 rounded hover:bg-gray-200 transition-colors";

export function StudioPodcastsTable({ podcasts }: { podcasts: Podcast[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: podcasts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const emptyPodcastsFillerRow = (
        <tr>
            <td colSpan={3} className="px-6 py-4">
                <div className="flex justify-center items-center text-center h-full gap-4">
                    No podcasts defined. <br />
                    Add a podcast to create a podcast.
                </div>
            </td>
        </tr>
    );

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-xs text-gray-700 uppercase bg-gray-50"
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{
                                        cursor: header.column.getCanSort() ? "pointer" : "default",
                                    }}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <ArrowUpDown className={sortIconStyles} />
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {podcasts.length === 0 && emptyPodcastsFillerRow}
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                                (window.location.href = `/studio/podcasts/${encodeURIComponent(row.original.id)}`)
                            }
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4 font-medium text-gray-900">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
