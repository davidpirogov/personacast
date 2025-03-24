"use client";

import { FileMetadata, HeroImage } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DataTable, ImageCell, TextCell, DateCell } from "@/components/ui/data-table";
import { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DeleteFileDialog } from "../dialogs/delete-file-dialog";
import { formatBytes } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DeleteHeroImageDialog } from "../dialogs/delete-hero-image-dialog";

const columns: ColumnDef<HeroImage>[] = [
    {
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
        meta: {
            className: "w-[120px] min-w-[120px] sm:w-[140px] sm:min-w-[140px]",
        },
        cell: ({ row, column }) => {
            return (
                <div className="flex items-center gap-2 overflow-hidden">
                    {row.original.file.mimeType.startsWith("image/") && (
                        <div className="shrink-0">
                            <ImageCell
                                value={`/api/files/${row.original.file.id}/resize/64x64`}
                                row={row.original}
                                column={column}
                                roundedClassName="rounded-sm"
                                className="h-6 w-6 sm:h-8 sm:sw-8 md:h-10 md:w-10"
                            />
                        </div>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help font-mono truncate">{row.original.id}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-mono">Hero Image: {row.original.id}</p>
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
        accessorKey: "description",
        header: "Description",
        enableSorting: true,
        cell: ({ row, column }) => (
            <TextCell value={row.original.description} row={row.original} column={column} />
        ),
    },
    {
        accessorKey: "urlTo",
        header: "URL",
        enableSorting: true,
        cell: ({ row, column }) => <TextCell value={row.original.urlTo} row={row.original} column={column} />,
    },
    {
        accessorKey: "used-by",
        header: "Used By",
        enableSorting: true,
        cell: ({ row, column }) => (
            <div className="flex items-center gap-2">
                {row.original.podcastId && (
                    <TextCell value={row.original.podcast?.title} row={row.original} column={column} />
                )}
                {row.original.episodeId && (
                    <TextCell
                        value={/*row.original.episode?.title*/ "TODO: Episode"}
                        row={row.original}
                        column={column}
                    />
                )}
            </div>
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
            actions: (heroImage: HeroImage) => (
                <>
                    <Link href={`/api/files/${heroImage.file.id}/download`} target="_blank" download>
                        <Button variant="outline" size="icon">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteHeroImageDialog heroImage={heroImage} />
                </>
            ),
        } as ColumnMeta<HeroImage, HeroImage>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {(columns[columns.length - 1].meta as ColumnMeta<HeroImage, HeroImage>)?.actions?.(
                    row.original,
                )}
            </div>
        ),
    },
];

export function HeroImagesTable({ heroImages }: { heroImages: HeroImage[] }) {
    return (
        <TooltipProvider>
            <DataTable
                data={heroImages}
                columns={columns}
                emptyState={{
                    title: "No hero images found",
                    description: "Set a hero image to get started.",
                }}
            />
        </TooltipProvider>
    );
}
