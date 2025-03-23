"use client";

import { Variable } from "@/types/database";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DataTable, ImageCell, TextCell, DateCell } from "@/components/ui/data-table";
import { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import { DeleteVariableDialog } from "../dialogs/delete-variable-dialog";

const columns: ColumnDef<Variable>[] = [
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
        accessorKey: "value",
        header: "Value",
        enableSorting: true,
        cell: ({ row, column }) => <TextCell value={row.original.value} row={row.original} column={column} />,
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
            actions: (variable: Variable) => (
                <>
                    <Link href={`/admin/variables/edit/${variable.id}`}>
                        <Button variant="outline" size="icon">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteVariableDialog variable={variable} />
                </>
            ),
        } as ColumnMeta<Variable, Variable>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {(columns[columns.length - 1].meta as ColumnMeta<Variable, Variable>)?.actions?.(
                    row.original,
                )}
            </div>
        ),
    },
];

export function VariablesTable({ variables }: { variables: Variable[] }) {
    return (
        <DataTable
            data={variables}
            columns={columns}
            emptyState={{
                title: "No variables found",
                description: "Add a new variable to get started.",
            }}
        />
    );
}
