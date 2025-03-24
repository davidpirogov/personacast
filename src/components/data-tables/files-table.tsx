"use client";

import { FileMetadata } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DataTable, ImageCell, TextCell, DateCell } from "@/components/ui/data-table";
import { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DeleteFileDialog } from "../dialogs/delete-file-dialog";
import { formatBytes } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const columns: ColumnDef<FileMetadata>[] = [
    {
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
        meta: {
            className: "w-[120px] min-w-[120px] sm:w-[140px] sm:min-w-[140px]",
        },
        cell: ({ row, column }) => {
            const fullId = row.original.id;
            const shortId = fullId.slice(-6); // Show last 6 characters

            return (
                <div className="flex items-center gap-2 overflow-hidden">
                    {row.original.mimeType.startsWith("image/") && (
                        <div className="shrink-0">
                            <ImageCell
                                value={`/api/files/${row.original.id}/resize/32x32`}
                                row={row.original}
                                column={column}
                                roundedClassName="rounded-sm"
                                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
                            />
                        </div>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help font-mono truncate">{shortId}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-mono">{fullId}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row, column }) => (
            <div className="flex items-center gap-2">
                <TextCell value={row.original.name} row={row.original} column={column} />
            </div>
        ),
    },
    {
        accessorKey: "path",
        header: "Path",
        enableSorting: true,
        cell: ({ row, column }) => <TextCell value={row.original.path} row={row.original} column={column} />,
    },
    {
        accessorKey: "size",
        header: "Size",
        enableSorting: true,
        cell: ({ row, column }) => (
            <TextCell value={formatBytes(row.original.size)} row={row.original} column={column} />
        ),
    },
    {
        accessorKey: "mimeType",
        header: "MIME Type",
        enableSorting: true,
        cell: ({ row, column }) => (
            <TextCell value={row.original.mimeType} row={row.original} column={column} />
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        enableSorting: true,
        cell: ({ row, column }) => (
            <DateCell value={row.original.createdAt} row={row.original} column={column} />
        ),
    },
    {
        id: "actions",
        header: "",
        enableSorting: false,
        meta: {
            className: "text-right",
            actions: (file: FileMetadata) => (
                <>
                    <Link href={`/api/files/${file.id}/download`} target="_blank" download>
                        <Button variant="outline" size="icon">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteFileDialog file={file} />
                </>
            ),
        } as ColumnMeta<FileMetadata, FileMetadata>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {(columns[columns.length - 1].meta as ColumnMeta<FileMetadata, FileMetadata>)?.actions?.(
                    row.original,
                )}
            </div>
        ),
    },
];

export function FilesTable({ files }: { files: FileMetadata[] }) {
    return (
        <TooltipProvider>
            <DataTable
                data={files}
                columns={columns}
                emptyState={{
                    title: "No files found",
                    description: "Upload a new file to get started.",
                }}
            />
        </TooltipProvider>
    );
}
