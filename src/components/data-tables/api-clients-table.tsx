"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DataTable, TextCell, DateCell } from "@/components/ui/data-table";
import { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DeleteApiClientDialog } from "../dialogs/delete-api-client-dialog";

import { type ApiClientSchema } from "@/schemas/api-clients/schema";

const columns: ColumnDef<ApiClientSchema>[] = [
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
        accessorKey: "isActive",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className={row.original.isActive ? "text-green-500" : "text-gray-500"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </span>
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
            actions: (apiClient: ApiClientSchema) => (
                <>
                    <Link href={`/admin/api-clients/edit/${apiClient.id}`}>
                        <Button variant="outline" size="icon">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteApiClientDialog client={apiClient} />
                </>
            ),
        } as ColumnMeta<ApiClientSchema, ApiClientSchema>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {(
                    columns[columns.length - 1].meta as ColumnMeta<ApiClientSchema, ApiClientSchema>
                )?.actions?.(row.original)}
            </div>
        ),
    },
];

export function ApiClientsTable({ apiClients }: { apiClients: ApiClientSchema[] }) {
    return (
        <DataTable
            data={apiClients}
            columns={columns}
            emptyState={{
                title: "No API clients found",
                description: "Add a new API client to get started.",
            }}
        />
    );
}
