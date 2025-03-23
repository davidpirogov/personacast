"use client";

import { Variable } from "@/types/database";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteVariableDialogProps {
    variable: Variable;
}

export function DeleteVariableDialog({ variable }: DeleteVariableDialogProps) {
    return (
        <DeleteRecordDialog
            record={variable}
            title={variable.name}
            deleteUrl={`/api/variables/${encodeURIComponent(variable.id)}`}
            onDelete={async () => {}}
        />
    );
}
