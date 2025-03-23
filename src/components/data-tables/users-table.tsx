"use client";

import { User } from "@/types/database";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DeleteUserDialog } from "@/components/dialogs/delete-user-dialog";
import { DataTable, ImageCell, TextCell, DateCell, ColumnMeta } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row, column }) => (
            <div className="flex items-center gap-2">
                <ImageCell value={row.original.image} row={row.original} column={column} />
                <TextCell value={row.original.name} row={row.original} column={column} />
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
        cell: ({ row, column }) => <TextCell value={row.original.email} row={row.original} column={column} />,
    },
    {
        accessorKey: "role",
        header: "Role",
        enableSorting: true,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className={row.original.role === "podcaster:admin" ? "text-red-500" : ""}>
                    {row.original.role}
                </span>
            </div>
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
            actions: (user: User) => (
                <>
                    <Link href={`/admin/users/edit/${user.id}`}>
                        <Button variant="outline" size="icon">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <DeleteUserDialog user={user} />
                </>
            ),
        } as ColumnMeta<User>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                {(columns[columns.length - 1].meta as ColumnMeta<User>)?.actions?.(row.original)}
            </div>
        ),
    },
];

export function UsersTable({ users }: { users: User[] }) {
    return (
        <DataTable
            data={users}
            columns={columns}
            emptyState={{
                title: "No users found",
                description: "Add a new user to get started.",
            }}
        />
    );
}
