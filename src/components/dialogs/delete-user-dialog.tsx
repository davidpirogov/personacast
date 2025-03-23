"use client";

import { User } from "@/types/database";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteUserDialogProps {
    user: User;
}

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
    return (
        <DeleteRecordDialog
            record={user}
            title={user.name}
            deleteUrl={`/api/users/${encodeURIComponent(user.id)}`}
            onDelete={async () => {}}
        />
    );
}
