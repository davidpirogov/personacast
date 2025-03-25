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
import { DataTable, TextCell } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { DeleteStudioPodcastDialog } from "@/components/dialogs/delete-studio-podcast-dialog";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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
                    <Link href={`/studio/podcasts/${encodeURIComponent(podcast.slug)}`}>
                        <Button variant="outline" size="icon">
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/studio/podcasts/${encodeURIComponent(podcast.slug)}/edit`}>
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
                {(columns[columns.length - 1].meta as ColumnMeta<Podcast, Podcast>)?.actions?.(row.original)}
            </div>
        ),
    },
];

const sortIconStyles = "h-4 w-4 p-0.5 rounded hover:bg-gray-200 transition-colors";

export function StudioPodcastsTable({ podcasts }: { podcasts: Podcast[] }) {
    return (
        <TooltipProvider>
            <DataTable
                data={podcasts}
                columns={columns}
                emptyState={{
                    title: "No podcasts found",
                    description: "Create a podcast to get started.",
                }}
            />
        </TooltipProvider>
    );
}
